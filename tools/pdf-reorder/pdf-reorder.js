/**
 * PDF Reorder — drag-to-reorder pages, save via pdf-lib
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const statusMsg = document.getElementById('status-msg');
const thumbsEl = document.getElementById('thumbs');

let pdfBytes = null;
let pdfName = '';
let order = []; // array of 0-based original page indices in current display order
let originalPageCount = 0;
let dragSrc = null;

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; pdfName = ''; order = [];
  thumbsEl.innerHTML = '';
  editorCard.style.display = 'none';
  fileInput.value = '';
});

document.getElementById('reverse-btn').addEventListener('click', () => {
  order = order.slice().reverse();
  renderThumbs();
});
document.getElementById('reset-order-btn').addEventListener('click', () => {
  order = Array.from({ length: originalPageCount }, (_, i) => i);
  renderThumbs();
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  flash('Reading PDF…', 'busy');

  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    originalPageCount = doc.getPageCount();
    order = Array.from({ length: originalPageCount }, (_, i) => i);
    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${originalPageCount} pages · ${(file.size / 1024).toFixed(1)} KB`;
    editorCard.style.display = '';
    await renderThumbs();
    flash('', '');
  } catch (err) {
    flash('Could not read PDF: ' + err.message, 'error');
  }
}

// Cache rendered thumbnails by original index
const thumbCache = new Map();

async function ensureThumb(originalIdx) {
  if (thumbCache.has(originalIdx)) return thumbCache.get(originalIdx);
  const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
  const pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;
  const page = await pdf.getPage(originalIdx + 1);
  const viewport = page.getViewport({ scale: 0.4 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width; canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  thumbCache.set(originalIdx, canvas);
  return canvas;
}

async function renderThumbs() {
  thumbsEl.innerHTML = '';
  for (let i = 0; i < order.length; i++) {
    const originalIdx = order[i];
    const div = document.createElement('div');
    div.className = 'thumb';
    div.draggable = true;
    div.dataset.idx = i;
    div.innerHTML = `<div class="num">${i + 1}</div><button class="x" type="button" aria-label="Remove">×</button>`;
    const canvas = await ensureThumb(originalIdx);
    const c2 = canvas.cloneNode();
    const ctx2 = c2.getContext('2d');
    ctx2.drawImage(canvas, 0, 0);
    div.insertBefore(c2, div.firstChild);

    div.addEventListener('dragstart', (e) => {
      dragSrc = i;
      div.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    div.addEventListener('dragend', () => div.classList.remove('dragging'));
    div.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
    div.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragSrc === null || dragSrc === i) return;
      const moved = order.splice(dragSrc, 1)[0];
      order.splice(i, 0, moved);
      dragSrc = null;
      renderThumbs();
    });
    div.querySelector('.x').addEventListener('click', (e) => {
      e.stopPropagation();
      order.splice(i, 1);
      renderThumbs();
    });

    thumbsEl.appendChild(div);
  }
}

document.getElementById('save-btn').addEventListener('click', async () => {
  if (!pdfBytes || order.length === 0) {
    flash('No pages selected.', 'error');
    return;
  }
  flash('Building PDF…', 'busy');
  try {
    const src = await PDFLib.PDFDocument.load(pdfBytes);
    const out = await PDFLib.PDFDocument.create();
    const copied = await out.copyPages(src, order);
    copied.forEach(p => out.addPage(p));
    const bytes = await out.save();
    download(bytes, `${pdfName}-reordered.pdf`);
    flash(`✓ Saved ${order.length} pages`, 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
});

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
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2500);
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
