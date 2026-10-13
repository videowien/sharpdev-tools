/**
 * PDF Redact — burn black bars into rasterized pages
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
const pageEl = document.getElementById('page-num');
const pageHint = document.getElementById('page-hint');
const boxCount = document.getElementById('box-count');
const statusMsg = document.getElementById('status-msg');

let pdfBytes = null;
let pdfName = '';
let pageCount = 0;
let pdfjsLib = null;
let currentPdf = null;
let currentPageNum = 1;
let displayScale = 1;
let pdfPageW = 0;
let pdfPageH = 0;
// boxesByPage: Map<pageNum, [{x, y, w, h} in PDF points]>
let boxesByPage = new Map();
let drawing = null;
let pageImage = null; // ImageData of base render (so we can redraw quickly)

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

pageEl.addEventListener('input', () => loadPage(parseInt(pageEl.value, 10) || 1));

document.getElementById('clear-boxes').addEventListener('click', () => {
  boxesByPage.set(currentPageNum, []);
  redrawCurrent();
});

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; pdfName = ''; currentPdf = null;
  boxesByPage = new Map();
  editorCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  boxesByPage = new Map();

  if (!pdfjsLib) {
    pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
  }
  try {
    currentPdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;
    pageCount = currentPdf.numPages;
    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${pageCount} pages · ${(file.size / 1024).toFixed(1)} KB`;
    editorCard.style.display = '';
    pageEl.value = 1; pageEl.max = pageCount;
    await loadPage(1);
  } catch (err) {
    flash('Could not read PDF: ' + err.message, 'error');
  }
}

async function loadPage(num) {
  currentPageNum = Math.max(1, Math.min(pageCount, num));
  pageEl.value = currentPageNum;
  pageHint.textContent = `(of ${pageCount})`;
  const page = await currentPdf.getPage(currentPageNum);
  const baseVp = page.getViewport({ scale: 1 });
  pdfPageW = baseVp.width; pdfPageH = baseVp.height;
  const targetW = Math.min(720, baseVp.width);
  displayScale = targetW / baseVp.width;
  const vp = page.getViewport({ scale: displayScale });
  canvas.width = vp.width; canvas.height = vp.height;
  canvas.style.width = vp.width + 'px';
  canvas.style.height = vp.height + 'px';
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  pageImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  redrawCurrent();
}

function redrawCurrent() {
  if (!pageImage) return;
  ctx.putImageData(pageImage, 0, 0);
  const boxes = boxesByPage.get(currentPageNum) || [];
  ctx.fillStyle = '#000';
  for (const b of boxes) {
    // Convert PDF points back to canvas pixels
    const x = b.x * displayScale;
    const y = (pdfPageH - b.y - b.h) * displayScale; // flip y
    const w = b.w * displayScale;
    const h = b.h * displayScale;
    ctx.fillRect(x, y, w, h);
  }
  if (drawing) {
    ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
    ctx.strokeRect(drawing.cx, drawing.cy, drawing.cw, drawing.ch);
    ctx.setLineDash([]);
  }
  boxCount.textContent = boxes.length;
}

canvas.addEventListener('mousedown', (e) => {
  const r = canvas.getBoundingClientRect();
  const px = e.clientX - r.left;
  const py = e.clientY - r.top;
  // Click inside existing box → delete
  const boxes = boxesByPage.get(currentPageNum) || [];
  const idx = boxes.findIndex(b => {
    const x = b.x * displayScale;
    const y = (pdfPageH - b.y - b.h) * displayScale;
    const w = b.w * displayScale; const h = b.h * displayScale;
    return px >= x && px <= x + w && py >= y && py <= y + h;
  });
  if (idx >= 0) { boxes.splice(idx, 1); boxesByPage.set(currentPageNum, boxes); redrawCurrent(); return; }
  drawing = { cx: px, cy: py, cw: 0, ch: 0 };
});
canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  const r = canvas.getBoundingClientRect();
  drawing.cw = (e.clientX - r.left) - drawing.cx;
  drawing.ch = (e.clientY - r.top) - drawing.cy;
  redrawCurrent();
});
canvas.addEventListener('mouseup', () => {
  if (!drawing) return;
  let { cx, cy, cw, ch } = drawing;
  if (cw < 0) { cx += cw; cw = -cw; }
  if (ch < 0) { cy += ch; ch = -ch; }
  if (cw >= 8 && ch >= 8) {
    // Convert canvas px to PDF point coords (PDF Y origin = bottom)
    const x = cx / displayScale;
    const w = cw / displayScale;
    const h = ch / displayScale;
    const y = pdfPageH - (cy / displayScale) - h;
    const boxes = boxesByPage.get(currentPageNum) || [];
    boxes.push({ x, y, w, h });
    boxesByPage.set(currentPageNum, boxes);
  }
  drawing = null;
  redrawCurrent();
});

document.getElementById('apply-btn').addEventListener('click', async () => {
  if (!pdfBytes) return;
  flash('Applying redactions — rasterizing affected pages…', 'busy');
  try {
    const src = await PDFLib.PDFDocument.load(pdfBytes);
    const out = await PDFLib.PDFDocument.create();
    const totalPages = src.getPageCount();
    const indices = Array.from({ length: totalPages }, (_, i) => i);
    const copied = await out.copyPages(src, indices);

    // Determine which pages to rasterize
    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1;
      const boxes = boxesByPage.get(pageNum);
      if (!boxes || boxes.length === 0) {
        // Unredacted — keep page as-is
        out.addPage(copied[i]);
        continue;
      }
      // Render page → JPEG with black bars burned in → embed as image-only page
      flash(`Burning redactions on page ${pageNum}…`, 'busy');
      const page = await currentPdf.getPage(pageNum);
      const RENDER_SCALE = 2; // 2× DPI for quality
      const vp = page.getViewport({ scale: RENDER_SCALE });
      const c = document.createElement('canvas');
      c.width = vp.width; c.height = vp.height;
      const cctx = c.getContext('2d');
      cctx.fillStyle = '#fff'; cctx.fillRect(0, 0, vp.width, vp.height);
      await page.render({ canvasContext: cctx, viewport: vp }).promise;
      cctx.fillStyle = '#000';
      for (const b of boxes) {
        const x = b.x * RENDER_SCALE;
        const y = (pdfPageH - b.y - b.h) * RENDER_SCALE;
        cctx.fillRect(x, y, b.w * RENDER_SCALE, b.h * RENDER_SCALE);
      }
      const blob = await new Promise(res => c.toBlob(res, 'image/jpeg', 0.92));
      const jpgBytes = new Uint8Array(await blob.arrayBuffer());
      const img = await out.embedJpg(jpgBytes);
      const newPage = out.addPage([pdfPageW, pdfPageH]);
      newPage.drawImage(img, { x: 0, y: 0, width: pdfPageW, height: pdfPageH });
    }

    const bytes = await out.save();
    download(bytes, `${pdfName}-redacted.pdf`);
    const redactedCount = [...boxesByPage.values()].filter(b => b.length).length;
    flash(`✓ Redacted ${redactedCount} page${redactedCount === 1 ? '' : 's'}`, 'ok');
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
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 3000);
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
