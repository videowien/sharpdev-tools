/**
 * PDF Watermark — adds diagonal text watermark via pdf-lib
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const statusMsg = document.getElementById('status-msg');
const opacityEl = document.getElementById('opacity');
const opacityVal = document.getElementById('opacity-val');
const rotationEl = document.getElementById('rotation');
const rotationVal = document.getElementById('rotation-val');

let pdfBytes = null;
let pdfName = '';
let pageCount = 0;

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) loadFile(fileInput.files[0]);
});
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

opacityEl.addEventListener('input', () => { opacityVal.textContent = opacityEl.value + '%'; });
rotationEl.addEventListener('input', () => { rotationVal.textContent = rotationEl.value + '°'; });

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; pdfName = ''; pageCount = 0;
  editorCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    flash('Please pick a PDF file.', 'error'); return;
  }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    pageCount = doc.getPageCount();
  } catch (err) {
    flash('Could not read this PDF: ' + err.message, 'error');
    return;
  }
  fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${pageCount} pages · ${(file.size / 1024).toFixed(1)} KB`;
  editorCard.style.display = '';
}

document.getElementById('apply-btn').addEventListener('click', applyWatermark);

async function applyWatermark() {
  if (!pdfBytes) return;
  const text = (document.getElementById('wm-text').value || '').trim();
  if (!text) { flash('Enter watermark text.', 'error'); return; }
  const colorHex = document.getElementById('color').value;
  const opacity = Math.max(0.05, Math.min(1, parseInt(opacityEl.value, 10) / 100));
  const fontSize = Math.max(10, Math.min(200, parseInt(document.getElementById('font-size').value, 10) || 80));
  const rotation = parseInt(rotationEl.value, 10) || 0;

  flash('Applying watermark…', '');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    const font = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
    const pages = doc.getPages();
    const rgbColor = hexToRgb(colorHex);

    for (const p of pages) {
      const { width, height } = p.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      // Center on page; pdf-lib rotates around the (x,y) origin so we offset.
      // Strategy: draw at the geometric center; pdf-lib's drawText accepts a rotate object.
      p.drawText(text, {
        x: width / 2 - textWidth / 2 * Math.cos(rotation * Math.PI / 180) - fontSize / 2 * Math.sin(rotation * Math.PI / 180),
        y: height / 2 - textWidth / 2 * Math.sin(rotation * Math.PI / 180) + fontSize / 4 * Math.cos(rotation * Math.PI / 180),
        size: fontSize,
        font,
        color: PDFLib.rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity,
        rotate: PDFLib.degrees(rotation),
      });
    }

    const out = await doc.save();
    download(out, `${pdfName}-watermarked.pdf`);
    flash(`✓ Watermarked ${pages.length} pages`, 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return { r: 1, g: 0, b: 0 };
  return { r: parseInt(m[1], 16) / 255, g: parseInt(m[2], 16) / 255, b: parseInt(m[3], 16) / 255 };
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
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2500);
}

function escapeHtml(s) {
  const d = document.createElement('div'); d.textContent = s; return d.innerHTML;
}
