/**
 * PDF Form Flatten — pdf-lib form.flatten()
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const statusMsg = document.getElementById('status-msg');

let pdfBytes = null;
let pdfName = '';

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

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
    const form = doc.getForm();
    const fields = form.getFields();
    const types = {};
    for (const f of fields) {
      const type = f.constructor.name.replace('PDF', '');
      types[type] = (types[type] || 0) + 1;
    }
    let fieldSummary = fields.length === 0
      ? '<span style="color:#ffa726">⚠ No form fields detected — flattening will still process the file but nothing changes.</span>'
      : Object.entries(types).map(([t, n]) => `${n} × ${t}`).join(', ');
    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${doc.getPageCount()} pages · ${(file.size / 1024).toFixed(1)} KB<div class="field-list">Form fields: ${fieldSummary}</div>`;
    editorCard.style.display = '';
  } catch (err) {
    flash('Could not read PDF: ' + err.message, 'error');
  }
}

document.getElementById('flatten-btn').addEventListener('click', async () => {
  if (!pdfBytes) return;
  flash('Flattening…', 'busy');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = doc.getForm();
    form.flatten();
    const out = await doc.save();
    download(out, `${pdfName}-flattened.pdf`);
    flash('✓ Flattened + downloaded', 'ok');
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
