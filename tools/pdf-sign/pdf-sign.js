/**
 * PDF Sign — drop a signature image onto a PDF page
 */

const editorCard = document.getElementById('editor-card');
const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('sig-overlay');
const pageEl = document.getElementById('page-num');
const pageHint = document.getElementById('page-hint');
const sigWidthEl = document.getElementById('sig-width');
const widthVal = document.getElementById('width-val');
const statusMsg = document.getElementById('status-msg');

let pdfBytes = null;
let pdfName = '';
let sigBytes = null;
let sigType = null;
let sigDataUrl = null;
let pdfPageCount = 0;
let displayScale = 1; // canvas pixel per PDF point
let pdfPageWidth = 0;
let pdfPageHeight = 0;

setupSlot('pdf');
setupSlot('sig');

function setupSlot(name) {
  const input = document.getElementById('file-' + name);
  const area = document.querySelector(`[data-target="${name}"]`);
  const info = document.getElementById('info-' + name);
  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', (e) => {
    e.preventDefault(); area.classList.remove('dragover');
    if (e.dataTransfer.files.length) handle(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files.length) handle(input.files[0]); });

  async function handle(file) {
    try {
      if (name === 'pdf') {
        pdfBytes = new Uint8Array(await file.arrayBuffer());
        pdfName = file.name.replace(/\.pdf$/i, '');
        const doc = await PDFLib.PDFDocument.load(pdfBytes);
        pdfPageCount = doc.getPageCount();
        info.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${pdfPageCount} pages`;
        area.classList.add('loaded');
        pageEl.max = pdfPageCount;
      } else {
        if (!file.type.startsWith('image/')) { flash('Signature must be an image.', 'error'); return; }
        sigType = file.type;
        sigBytes = new Uint8Array(await file.arrayBuffer());
        sigDataUrl = await new Promise(res => {
          const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file);
        });
        info.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${(file.size / 1024).toFixed(1)} KB`;
        area.classList.add('loaded');
      }
      if (pdfBytes && sigBytes) {
        editorCard.style.display = '';
        await renderPage();
      }
    } catch (err) {
      flash('Failed to load ' + name + ': ' + err.message, 'error');
    }
  }
}

pageEl.addEventListener('input', renderPage);
sigWidthEl.addEventListener('input', () => {
  widthVal.textContent = sigWidthEl.value + ' pt';
  // Resize overlay
  const ratio = parseInt(sigWidthEl.value, 10) * displayScale;
  overlay.style.width = ratio + 'px';
});

async function renderPage() {
  if (!pdfBytes) return;
  pageHint.textContent = `(of ${pdfPageCount})`;
  const pageNum = Math.max(1, Math.min(pdfPageCount, parseInt(pageEl.value, 10) || 1));
  const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
  const pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;
  const page = await pdf.getPage(pageNum);
  const vp = page.getViewport({ scale: 1 });
  // Fit canvas to max ~720px wide
  const targetWidth = Math.min(720, vp.width);
  const scale = targetWidth / vp.width;
  const v = page.getViewport({ scale });
  canvas.width = v.width; canvas.height = v.height;
  canvas.style.width = v.width + 'px'; canvas.style.height = v.height + 'px';
  await page.render({ canvasContext: ctx, viewport: v }).promise;

  displayScale = scale;
  pdfPageWidth = vp.width;
  pdfPageHeight = vp.height;

  if (sigDataUrl) {
    overlay.src = sigDataUrl;
    overlay.style.display = '';
    const sigWidthPt = parseInt(sigWidthEl.value, 10);
    overlay.style.width = (sigWidthPt * scale) + 'px';
    // Default position: bottom-right area
    const canvasRect = canvas.getBoundingClientRect();
    const wrapRect = canvas.parentElement.getBoundingClientRect();
    const offsetX = canvasRect.left - wrapRect.left;
    const offsetY = canvasRect.top - wrapRect.top;
    overlay.style.left = (offsetX + canvas.offsetWidth - (sigWidthPt * scale) - 40) + 'px';
    overlay.style.top = (offsetY + canvas.offsetHeight - 120) + 'px';
  }
}

// Drag the overlay
let dragStart = null;
overlay.addEventListener('mousedown', (e) => {
  dragStart = { x: e.clientX, y: e.clientY, left: overlay.offsetLeft, top: overlay.offsetTop };
  e.preventDefault();
});
window.addEventListener('mousemove', (e) => {
  if (!dragStart) return;
  overlay.style.left = (dragStart.left + e.clientX - dragStart.x) + 'px';
  overlay.style.top = (dragStart.top + e.clientY - dragStart.y) + 'px';
});
window.addEventListener('mouseup', () => { dragStart = null; });

document.getElementById('save-btn').addEventListener('click', async () => {
  if (!pdfBytes || !sigBytes) return;
  flash('Signing…', 'busy');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    let img;
    if (sigType.includes('png')) img = await doc.embedPng(sigBytes);
    else img = await doc.embedJpg(sigBytes);

    const pageNum = parseInt(pageEl.value, 10) || 1;
    const page = doc.getPage(pageNum - 1);
    const { width, height } = page.getSize();
    const sigWidthPt = parseInt(sigWidthEl.value, 10);
    const aspect = img.height / img.width;
    const sigHeightPt = sigWidthPt * aspect;

    // Map overlay screen pos to PDF coords
    const canvasRect = canvas.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    // Position relative to canvas top-left
    const xOnCanvas = overlayRect.left - canvasRect.left;
    const yOnCanvas = overlayRect.top - canvasRect.top;
    // Convert to PDF coords (PDF origin is bottom-left)
    const xPdf = xOnCanvas / displayScale;
    const yPdf = height - (yOnCanvas / displayScale) - sigHeightPt;

    page.drawImage(img, { x: xPdf, y: yPdf, width: sigWidthPt, height: sigHeightPt });

    const bytes = await doc.save();
    download(bytes, `${pdfName}-signed.pdf`);
    flash('✓ Signed page ' + pageNum, 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
});

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; sigBytes = null; sigType = null; sigDataUrl = null;
  document.getElementById('file-pdf').value = '';
  document.getElementById('file-sig').value = '';
  document.querySelectorAll('.upload-area').forEach(a => a.classList.remove('loaded'));
  document.getElementById('info-pdf').textContent = '';
  document.getElementById('info-sig').textContent = '';
  editorCard.style.display = 'none';
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
