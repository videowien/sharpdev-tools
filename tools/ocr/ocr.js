/**
 * OCR — Tesseract.js browser-side text extraction
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const resultCard = document.getElementById('result-card');
const previewImg = document.getElementById('preview-img');
const progressLabel = document.getElementById('progress-label');
const progressFill = document.getElementById('progress-fill');
const langEl = document.getElementById('lang');
const output = document.getElementById('output');
const statusMsg = document.getElementById('status-msg');

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  resultCard.style.display = 'none';
  output.value = '';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.type.startsWith('image/')) { flash('Please pick an image.', 'error'); return; }
  const dataUrl = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
  previewImg.src = dataUrl;
  resultCard.style.display = '';
  output.value = '';
  await runOCR(file);
}

async function runOCR(file) {
  progressLabel.textContent = 'Loading language data…';
  progressFill.style.width = '0%';
  try {
    if (typeof Tesseract === 'undefined') throw new Error('Tesseract.js not loaded');
    const lang = langEl.value;
    const result = await Tesseract.recognize(file, lang, {
      logger: (m) => {
        if (m.status) {
          progressLabel.textContent = capitalize(m.status) + (m.progress ? ` · ${Math.round(m.progress * 100)}%` : '');
        }
        if (typeof m.progress === 'number') {
          progressFill.style.width = (m.progress * 100).toFixed(0) + '%';
        }
      },
    });
    output.value = result.data.text.trim();
    progressLabel.textContent = `✓ Done — ${output.value.length.toLocaleString()} characters extracted`;
    progressFill.style.width = '100%';
    flash('', '');
  } catch (err) {
    progressLabel.textContent = 'Failed: ' + (err.message || err);
    flash('OCR failed: ' + (err.message || err), 'error');
  }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

document.getElementById('copy-btn').addEventListener('click', async () => {
  if (!output.value) return;
  await navigator.clipboard.writeText(output.value);
  flash('✓ Copied', 'ok');
});
document.getElementById('dl-btn').addEventListener('click', () => {
  if (!output.value) return;
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'ocr-text.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ Downloaded', 'ok');
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2500);
}
