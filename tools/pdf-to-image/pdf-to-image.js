/**
 * PDF to JPG / PNG — SharpDev Tools
 * Renders every page of a PDF onto a canvas at the chosen DPI and
 * exports each page as a JPG or PNG. Everything runs in the browser
 * via PDF.js (vendored from Cloudflare's cdnjs mirror). Multi-page
 * ZIP download uses /shared/zip.js (store-only zip writer).
 */

const pdfjsLib = await import(
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs'
);
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

// ---- DOM refs ----
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const optionsCard = document.getElementById('options-card');
const convertBtn = document.getElementById('convert-btn');
const progressArea = document.getElementById('progress-area');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const resultArea = document.getElementById('result-area');
const fileNameEl = document.getElementById('file-name');
const pageCountEl = document.getElementById('page-count');
const thumbsGrid = document.getElementById('thumbs-grid');
const downloadZipBtn = document.getElementById('download-zip-btn');
const resetBtn = document.getElementById('reset-btn');
const jpgQuality = document.getElementById('jpg-quality');
const jpgQualityDisplay = document.getElementById('jpg-quality-display');
const jpgQualityGroup = document.getElementById('jpg-quality-group');

// ---- State ----
let currentPdf = null;
let currentFileName = '';
let renderedImages = []; // [{ pageNum, blob, mime, ext, dataUrl }]

// ---- Upload handlers ----
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) loadPdf(fileInput.files[0]);
});
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadPdf(e.dataTransfer.files[0]);
});

// ---- Format/quality toggle ----
document.querySelectorAll('input[name="fmt"]').forEach((r) => {
  r.addEventListener('change', () => {
    jpgQualityGroup.style.display = r.value === 'jpg' && r.checked ? '' : 'none';
    if (r.value === 'png' && r.checked) jpgQualityGroup.style.display = 'none';
  });
});
jpgQuality.addEventListener('input', () => {
  jpgQualityDisplay.textContent = jpgQuality.value;
});

// ---- Load PDF ----
async function loadPdf(file) {
  if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    alert('Please pick a PDF file.');
    return;
  }
  currentFileName = file.name.replace(/\.pdf$/i, '');
  try {
    const buf = await file.arrayBuffer();
    currentPdf = await pdfjsLib.getDocument({ data: buf }).promise;
    fileNameEl.textContent = file.name;
    pageCountEl.textContent = currentPdf.numPages + (currentPdf.numPages === 1 ? ' page' : ' pages');
    optionsCard.style.display = '';
    resultArea.style.display = 'none';
    thumbsGrid.innerHTML = '';
    renderedImages = [];
  } catch (e) {
    alert('Could not open PDF: ' + (e.message || e));
  }
}

// ---- Convert ----
convertBtn.addEventListener('click', async () => {
  if (!currentPdf) return;

  const fmt = document.querySelector('input[name="fmt"]:checked').value;
  const dpi = parseInt(document.querySelector('input[name="dpi"]:checked').value, 10);
  const quality = parseInt(jpgQuality.value, 10) / 100;
  const scale = dpi / 72; // pdf.js uses 72 DPI baseline
  const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
  const ext = fmt === 'png' ? 'png' : 'jpg';

  optionsCard.style.display = 'none';
  progressArea.style.display = '';
  thumbsGrid.innerHTML = '';
  renderedImages = [];

  const total = currentPdf.numPages;
  for (let i = 1; i <= total; i++) {
    progressText.textContent = `Rendering page ${i} of ${total}...`;
    progressBar.style.width = (((i - 1) / total) * 100) + '%';
    const page = await currentPdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d');
    // For JPG: white background (PDFs are transparent by default)
    if (fmt === 'jpg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await new Promise((res) =>
      canvas.toBlob(res, mime, fmt === 'jpg' ? quality : undefined)
    );
    const dataUrl = canvas.toDataURL(mime, fmt === 'jpg' ? quality : undefined);
    renderedImages.push({ pageNum: i, blob, mime, ext, dataUrl });
    page.cleanup();
  }
  progressBar.style.width = '100%';
  progressArea.style.display = 'none';
  renderResults();
});

// ---- Render thumbnails ----
function renderResults() {
  resultArea.style.display = '';
  thumbsGrid.innerHTML = '';
  renderedImages.forEach((img) => {
    const card = document.createElement('div');
    card.className = 'thumb-card';
    const sizeKb = Math.round(img.blob.size / 1024);
    card.innerHTML =
      '<div class="thumb-preview"><img alt="Page ' + img.pageNum + '" loading="lazy"/></div>' +
      '<div class="thumb-info">' +
        '<span class="thumb-label">Page ' + img.pageNum + '</span>' +
        '<span class="thumb-size">' + sizeKb + ' KB</span>' +
      '</div>' +
      '<button class="btn btn-secondary btn-sm thumb-dl" type="button">Download .' + img.ext + '</button>';
    card.querySelector('img').src = img.dataUrl;
    card.querySelector('.thumb-dl').addEventListener('click', () => downloadSingle(img));
    thumbsGrid.appendChild(card);
  });
}

function downloadSingle(img) {
  const url = URL.createObjectURL(img.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentFileName}-page-${String(img.pageNum).padStart(3, '0')}.${img.ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- ZIP download ----
downloadZipBtn.addEventListener('click', async () => {
  if (!renderedImages.length) return;
  downloadZipBtn.disabled = true;
  downloadZipBtn.textContent = 'Packing ZIP...';
  try {
    const entries = await Promise.all(
      renderedImages.map(async (img) => ({
        name: `${currentFileName}-page-${String(img.pageNum).padStart(3, '0')}.${img.ext}`,
        data: new Uint8Array(await img.blob.arrayBuffer()),
      }))
    );
    const blob = SDZip.create(entries);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFileName}-pages.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } finally {
    downloadZipBtn.disabled = false;
    downloadZipBtn.textContent = 'Download all as ZIP';
  }
});

// ---- Reset ----
resetBtn.addEventListener('click', () => {
  currentPdf = null;
  currentFileName = '';
  renderedImages = [];
  fileInput.value = '';
  optionsCard.style.display = 'none';
  resultArea.style.display = 'none';
  progressArea.style.display = 'none';
});
