/**
 * PDF Compress — rasterize pages via pdf.js, JPEG-recompress, repack with pdf-lib
 */

const PRESETS = {
  high:   { dpi: 150, q: 0.85 },
  medium: { dpi: 100, q: 0.75 },
  low:    { dpi: 72,  q: 0.6 },
};

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const statusMsg = document.getElementById('status-msg');
const presetEl = document.getElementById('preset');
const dpiEl = document.getElementById('dpi');
const qualityEl = document.getElementById('quality');
const qualityVal = document.getElementById('quality-val');
const resultCard = document.getElementById('result-card');

let pdfBytes = null;
let pdfName = '';
let origSize = 0;

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

presetEl.addEventListener('change', () => {
  if (presetEl.value !== 'custom' && PRESETS[presetEl.value]) {
    const p = PRESETS[presetEl.value];
    dpiEl.value = p.dpi;
    qualityEl.value = p.q;
    qualityVal.textContent = p.q.toFixed(2);
  }
});
qualityEl.addEventListener('input', () => {
  qualityVal.textContent = parseFloat(qualityEl.value).toFixed(2);
  presetEl.value = 'custom';
});
dpiEl.addEventListener('input', () => { presetEl.value = 'custom'; });

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; pdfName = '';
  editorCard.style.display = 'none';
  resultCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  origSize = file.size;
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${doc.getPageCount()} pages · ${formatSize(origSize)}`;
    editorCard.style.display = '';
    resultCard.style.display = 'none';
  } catch (err) {
    flash('Could not read PDF: ' + err.message, 'error');
  }
}

document.getElementById('compress-btn').addEventListener('click', async () => {
  if (!pdfBytes) return;
  flash('Compressing — this may take a moment…', 'busy');
  try {
    const dpi = Math.max(36, Math.min(300, parseInt(dpiEl.value, 10) || 100));
    const quality = Math.max(0.3, Math.min(0.95, parseFloat(qualityEl.value) || 0.75));
    const scale = dpi / 72; // PDF default = 72 DPI

    const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;
    const totalPages = pdf.numPages;

    const out = await PDFLib.PDFDocument.create();
    for (let i = 1; i <= totalPages; i++) {
      flash(`Compressing page ${i} of ${totalPages}…`, 'busy');
      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;

      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
      const jpgBytes = new Uint8Array(await blob.arrayBuffer());
      const jpg = await out.embedJpg(jpgBytes);

      // Use the original page size in pt (72 DPI) so the new PDF prints at the same size
      const ptSize = page.getViewport({ scale: 1 });
      const newPage = out.addPage([ptSize.width, ptSize.height]);
      newPage.drawImage(jpg, { x: 0, y: 0, width: ptSize.width, height: ptSize.height });
    }

    const compressed = await out.save();
    const newSize = compressed.byteLength;
    download(compressed, `${pdfName}-compressed.pdf`);

    document.getElementById('size-before').textContent = formatSize(origSize);
    document.getElementById('size-after').textContent = formatSize(newSize);
    const pct = ((1 - newSize / origSize) * 100);
    const savedMsg = pct > 0
      ? `${formatSize(origSize - newSize)} (${pct.toFixed(0)}%)`
      : `+${formatSize(newSize - origSize)} (got bigger)`;
    document.getElementById('size-saved').textContent = savedMsg;
    document.getElementById('size-saved').style.color = pct > 0 ? '#4caf50' : '#ff6666';
    resultCard.style.display = '';
    flash('✓ Done', 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
});

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function download(bytes, name) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 3500);
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
