/**
 * PDF Crop — shrink MediaBox to trim margins
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const statusMsg = document.getElementById('status-msg');
const cropRegion = document.getElementById('crop-region');

const trims = {
  top: document.getElementById('trim-top'),
  bottom: document.getElementById('trim-bottom'),
  left: document.getElementById('trim-left'),
  right: document.getElementById('trim-right'),
};
const unitLabels = document.querySelectorAll('.unit-label');

let pdfBytes = null;
let pdfName = '';
let unit = 'mm';

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.querySelectorAll('[data-unit]').forEach(btn => {
  btn.addEventListener('click', () => {
    const newUnit = btn.dataset.unit;
    if (newUnit === unit) return;
    document.querySelectorAll('[data-unit]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Convert values: assume A4 (210x297) for the conversion
    Object.values(trims).forEach(t => {
      const v = parseFloat(t.value) || 0;
      if (newUnit === 'pct') t.value = (v / 210 * 100).toFixed(1); // rough estimate
      else t.value = (v / 100 * 210).toFixed(1);
    });
    unit = newUnit;
    unitLabels.forEach(l => l.textContent = unit === 'pct' ? '%' : 'mm');
    updateVis();
  });
});

Object.values(trims).forEach(t => t.addEventListener('input', updateVis));

function updateVis() {
  // Use 5% baseline scale: convert mm trim into approximate percent for visualization (A4 reference)
  function toPct(v, dim) {
    if (unit === 'pct') return Math.max(0, Math.min(40, v));
    return Math.max(0, Math.min(40, (v / dim) * 100));
  }
  const t = toPct(parseFloat(trims.top.value) || 0, 297);
  const b = toPct(parseFloat(trims.bottom.value) || 0, 297);
  const l = toPct(parseFloat(trims.left.value) || 0, 210);
  const r = toPct(parseFloat(trims.right.value) || 0, 210);
  cropRegion.style.top = t + '%';
  cropRegion.style.bottom = b + '%';
  cropRegion.style.left = l + '%';
  cropRegion.style.right = r + '%';
}

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
    updateVis();
  } catch (err) {
    flash('Could not read PDF: ' + err.message, 'error');
  }
}

document.getElementById('crop-btn').addEventListener('click', async () => {
  if (!pdfBytes) return;
  flash('Cropping…', 'busy');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    const pages = doc.getPages();
    pages.forEach(page => {
      const { width, height } = page.getSize();
      const t = parseFloat(trims.top.value) || 0;
      const b = parseFloat(trims.bottom.value) || 0;
      const l = parseFloat(trims.left.value) || 0;
      const r = parseFloat(trims.right.value) || 0;
      let tt, bb, ll, rr;
      if (unit === 'mm') {
        const mmToPt = 2.83465;
        tt = t * mmToPt; bb = b * mmToPt; ll = l * mmToPt; rr = r * mmToPt;
      } else {
        tt = (t / 100) * height; bb = (b / 100) * height;
        ll = (l / 100) * width; rr = (r / 100) * width;
      }
      const newX = ll;
      const newY = bb;
      const newW = Math.max(20, width - ll - rr);
      const newH = Math.max(20, height - tt - bb);
      page.setMediaBox(newX, newY, newW, newH);
      page.setCropBox(newX, newY, newW, newH);
    });
    const out = await doc.save();
    download(out, `${pdfName}-cropped.pdf`);
    flash(`✓ Cropped ${pages.length} pages`, 'ok');
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

updateVis();
