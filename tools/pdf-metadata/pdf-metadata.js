/**
 * PDF Metadata Editor — view + edit via pdf-lib
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const statusMsg = document.getElementById('status-msg');

const fields = {
  title: document.getElementById('m-title'),
  author: document.getElementById('m-author'),
  subject: document.getElementById('m-subject'),
  keywords: document.getElementById('m-keywords'),
  creator: document.getElementById('m-creator'),
  producer: document.getElementById('m-producer'),
};

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
  pdfBytes = null;
  pdfName = '';
  editorCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    fields.title.value = doc.getTitle() || '';
    fields.author.value = doc.getAuthor() || '';
    fields.subject.value = doc.getSubject() || '';
    const kw = doc.getKeywords();
    fields.keywords.value = Array.isArray(kw) ? kw.join(', ') : (kw || '');
    fields.creator.value = doc.getCreator() || '';
    fields.producer.value = doc.getProducer() || '';

    const created = doc.getCreationDate();
    const modified = doc.getModificationDate();
    document.getElementById('r-pages').textContent = doc.getPageCount();
    document.getElementById('r-created').textContent = created ? created.toLocaleString() : '—';
    document.getElementById('r-modified').textContent = modified ? modified.toLocaleString() : '—';
    document.getElementById('r-size').textContent = (file.size / 1024).toFixed(1) + ' KB';

    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span>`;
    editorCard.style.display = '';
  } catch (err) {
    flash('Could not read PDF: ' + err.message, 'error');
  }
}

document.getElementById('save-btn').addEventListener('click', () => save(false));
document.getElementById('strip-btn').addEventListener('click', () => {
  if (!confirm('Strip all metadata? This clears Title, Author, Subject, Keywords, Creator, Producer.')) return;
  Object.values(fields).forEach(f => f.value = '');
  save(true);
});

async function save(stripped) {
  if (!pdfBytes) return;
  flash('Writing PDF…', 'busy');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    // Set/clear each field. Empty string clears.
    doc.setTitle(fields.title.value || '');
    doc.setAuthor(fields.author.value || '');
    doc.setSubject(fields.subject.value || '');
    const kw = fields.keywords.value.split(',').map(s => s.trim()).filter(Boolean);
    doc.setKeywords(kw);
    doc.setCreator(fields.creator.value || '');
    doc.setProducer(fields.producer.value || '');
    // Update modified date to now
    doc.setModificationDate(new Date());

    const out = await doc.save();
    download(out, `${pdfName}${stripped ? '-stripped' : '-metadata'}.pdf`);
    flash(stripped ? '✓ Stripped metadata + downloaded' : '✓ Metadata updated', 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
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
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2800);
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
