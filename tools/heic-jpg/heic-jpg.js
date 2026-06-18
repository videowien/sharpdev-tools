/**
 * HEIC to JPG / PNG — heic2any-based browser conversion
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const resultsCard = document.getElementById('results-card');
const resultsEl = document.getElementById('results');
const qualityEl = document.getElementById('quality');
const qualityVal = document.getElementById('quality-val');
const statusMsg = document.getElementById('status-msg');

let format = 'image/jpeg';
let converted = []; // { name, blob }

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) processFiles(Array.from(fileInput.files)); fileInput.value = ''; });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) processFiles(Array.from(e.dataTransfer.files));
});

document.querySelectorAll('[data-format]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-format]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    format = btn.dataset.format;
  });
});
qualityEl.addEventListener('input', () => { qualityVal.textContent = parseFloat(qualityEl.value).toFixed(2); });

document.getElementById('clear-btn').addEventListener('click', () => {
  converted = []; resultsEl.innerHTML = '';
  resultsCard.style.display = 'none';
});

async function processFiles(files) {
  const ext = format === 'image/jpeg' ? 'jpg' : 'png';
  const quality = parseFloat(qualityEl.value);
  resultsCard.style.display = '';
  for (const file of files) {
    const name = file.name.replace(/\.(heic|heif)$/i, '');
    const row = document.createElement('div');
    row.className = 'result busy';
    row.innerHTML = `
      <span class="result-name">${escapeHtml(file.name)}</span>
      <span class="result-status">Converting…</span>
    `;
    resultsEl.appendChild(row);
    try {
      const blob = await heic2any({
        blob: file,
        toType: format,
        quality,
      });
      const finalBlob = Array.isArray(blob) ? blob[0] : blob;
      converted.push({ name: `${name}.${ext}`, blob: finalBlob });
      const url = URL.createObjectURL(finalBlob);
      row.className = 'result done';
      row.innerHTML = `
        <span class="result-name">${escapeHtml(name)}.${ext}</span>
        <span class="result-status">${(finalBlob.size / 1024).toFixed(1)} KB</span>
        <a class="dl" href="${url}" download="${escapeAttr(name)}.${ext}">Download</a>
      `;
    } catch (err) {
      row.className = 'result error';
      row.innerHTML = `
        <span class="result-name">${escapeHtml(file.name)}</span>
        <span class="result-status">Failed: ${escapeHtml(err.message || 'invalid HEIC')}</span>
      `;
    }
  }
}

document.getElementById('dl-zip').addEventListener('click', async () => {
  if (!converted.length) return;
  if (typeof JSZip === 'undefined') { flash('ZIP library not loaded.', 'error'); return; }
  flash('Building ZIP…', 'busy');
  const zip = new JSZip();
  for (const item of converted) zip.file(item.name, item.blob);
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `heic-converted-${Date.now()}.zip`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ ZIP downloaded', 'ok');
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2500);
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function escapeAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }
