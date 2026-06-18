/**
 * PDF Resize — rebuild each page at target size, embed original as overlay
 */

const SIZES_MM = {
  'A4': [210, 297],
  'Letter': [216, 279],
  'Legal': [216, 356],
  'A3': [297, 420],
  'A5': [148, 210],
  'Tabloid': [279, 432],
  'Executive': [184, 267],
};
const MM_TO_PT = 2.83465;

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const presetEl = document.getElementById('preset');
const customGroup = document.getElementById('custom-group');
const customGroupH = document.getElementById('custom-group-h');
const customWEl = document.getElementById('custom-w');
const customHEl = document.getElementById('custom-h');
const statusMsg = document.getElementById('status-msg');

let pdfBytes = null;
let pdfName = '';
let orientation = 'portrait';
let fitMode = 'contain';

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

presetEl.addEventListener('change', () => {
  const isCustom = presetEl.value === 'custom';
  customGroup.style.display = isCustom ? '' : 'none';
  customGroupH.style.display = isCustom ? '' : 'none';
});

document.querySelectorAll('[data-orient]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-orient]').forEach(x => x.classList.remove('active'));
  b.classList.add('active'); orientation = b.dataset.orient;
}));
document.querySelectorAll('[data-fit]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-fit]').forEach(x => x.classList.remove('active'));
  b.classList.add('active'); fitMode = b.dataset.fit;
}));

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; pdfName = '';
  editorCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${doc.getPageCount()} pages · ${(file.size / 1024).toFixed(1)} KB`;
    editorCard.style.display = '';
  } catch (err) { flash('Could not read PDF: ' + err.message, 'error'); }
}

function targetSizePt() {
  let mm;
  if (presetEl.value === 'custom') {
    mm = [parseFloat(customWEl.value) || 210, parseFloat(customHEl.value) || 297];
  } else {
    mm = SIZES_MM[presetEl.value];
  }
  if (orientation === 'landscape' && mm[0] < mm[1]) mm = [mm[1], mm[0]];
  if (orientation === 'portrait' && mm[0] > mm[1]) mm = [mm[1], mm[0]];
  return [mm[0] * MM_TO_PT, mm[1] * MM_TO_PT];
}

document.getElementById('resize-btn').addEventListener('click', async () => {
  if (!pdfBytes) return;
  flash('Resizing…', 'busy');
  try {
    const src = await PDFLib.PDFDocument.load(pdfBytes);
    const out = await PDFLib.PDFDocument.create();
    const [TW, TH] = targetSizePt();

    const pageIndices = Array.from({ length: src.getPageCount() }, (_, i) => i);
    const embedded = await out.embedPdf(src, pageIndices);

    for (const ePage of embedded) {
      const newPage = out.addPage([TW, TH]);
      const srcW = ePage.width, srcH = ePage.height;
      let drawW, drawH, x, y;
      if (fitMode === 'stretch') {
        drawW = TW; drawH = TH; x = 0; y = 0;
      } else {
        const scale = Math.min(TW / srcW, TH / srcH);
        drawW = srcW * scale; drawH = srcH * scale;
        x = (TW - drawW) / 2; y = (TH - drawH) / 2;
      }
      newPage.drawPage(ePage, { x, y, width: drawW, height: drawH });
    }

    const bytes = await out.save();
    download(bytes, `${pdfName}-resized.pdf`);
    flash('✓ Resized + downloaded', 'ok');
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
