/**
 * Delete Pages from PDF — SharpDev Tools
 * pdf.js renders thumbnails; pdf-lib builds the output PDF without marked pages.
 */

const pdfjsLib = await import(
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs'
);
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const { PDFDocument } = window.PDFLib;

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const progressArea = document.getElementById('progress-area');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const counter = document.getElementById('counter');
const thumbsGrid = document.getElementById('thumbs-grid');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');

let currentBytes = null;
let currentName = '';
let totalPages = 0;
let deleted = new Set();

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

async function loadPdf(file) {
  if (!file.type.includes('pdf') && !/\.pdf$/i.test(file.name)) {
    alert('Please pick a PDF file.');
    return;
  }
  currentName = file.name.replace(/\.pdf$/i, '');
  try {
    currentBytes = new Uint8Array(await file.arrayBuffer());
    progressArea.style.display = '';
    editorCard.style.display = 'none';
    const pdf = await pdfjsLib.getDocument({ data: currentBytes.slice() }).promise;
    totalPages = pdf.numPages;
    deleted = new Set();
    fileInfo.textContent = `${file.name} — ${totalPages} page${totalPages === 1 ? '' : 's'}`;
    thumbsGrid.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      progressBar.style.width = (((i - 1) / totalPages) * 100) + '%';
      progressText.textContent = `Rendering page ${i} of ${totalPages}...`;
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      page.cleanup();
      addThumbCard(i, canvas.toDataURL('image/jpeg', 0.7));
    }
    progressArea.style.display = 'none';
    editorCard.style.display = '';
    updateCounter();
  } catch (e) {
    progressArea.style.display = 'none';
    alert('Could not open PDF: ' + (e.message || e));
  }
}

function addThumbCard(pageNum, dataUrl) {
  const card = document.createElement('div');
  card.className = 'thumb-card';
  card.dataset.page = pageNum;
  card.innerHTML =
    '<div class="thumb-img-wrap">' +
      '<img alt="Page ' + pageNum + '" class="thumb-img"/>' +
      '<div class="delete-overlay">✕</div>' +
    '</div>' +
    '<div class="thumb-label">Page ' + pageNum + '</div>';
  card.querySelector('img').src = dataUrl;
  card.addEventListener('click', () => {
    if (deleted.has(pageNum)) {
      deleted.delete(pageNum);
      card.classList.remove('marked-deleted');
    } else {
      deleted.add(pageNum);
      card.classList.add('marked-deleted');
    }
    updateCounter();
  });
  thumbsGrid.appendChild(card);
}

function updateCounter() {
  const keep = totalPages - deleted.size;
  counter.textContent = `${keep} kept · ${deleted.size} marked for deletion`;
  counter.className = 'counter' + (deleted.size > 0 ? ' has-marks' : '');
  saveBtn.disabled = deleted.size === 0 || keep === 0;
}

clearBtn.addEventListener('click', () => {
  deleted.clear();
  thumbsGrid.querySelectorAll('.thumb-card.marked-deleted').forEach((c) =>
    c.classList.remove('marked-deleted')
  );
  updateCounter();
});

saveBtn.addEventListener('click', async () => {
  if (!currentBytes || deleted.size === 0) return;
  if (totalPages - deleted.size === 0) {
    alert('Cannot delete every page — at least one must remain.');
    return;
  }
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';
  statusMsg.textContent = '';
  try {
    const src = await PDFDocument.load(currentBytes);
    const keepIndices = [];
    for (let i = 0; i < totalPages; i++) if (!deleted.has(i + 1)) keepIndices.push(i);
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, keepIndices);
    copied.forEach((p) => out.addPage(p));
    const bytes = await out.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentName}-cleaned.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = `✓ Saved without ${deleted.size} page${deleted.size === 1 ? '' : 's'}`;
    statusMsg.className = 'status-msg ok';
  } catch (e) {
    statusMsg.textContent = 'Error: ' + (e.message || e);
    statusMsg.className = 'status-msg err';
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Cleaned PDF';
  }
});

resetBtn.addEventListener('click', () => {
  currentBytes = null;
  currentName = '';
  totalPages = 0;
  deleted = new Set();
  fileInput.value = '';
  editorCard.style.display = 'none';
  thumbsGrid.innerHTML = '';
  statusMsg.textContent = '';
});
