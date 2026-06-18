/**
 * Word to PDF — mammoth.js (.docx → HTML) + html2pdf (HTML → PDF)
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const preview = document.getElementById('preview');
const statusMsg = document.getElementById('status-msg');

const sizeEl = document.getElementById('page-size');
const orientEl = document.getElementById('orientation');
const marginEl = document.getElementById('margin');

let docName = '';
let html = '';

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  editorCard.style.display = 'none';
  preview.innerHTML = '';
  html = '';
  docName = '';
  fileInput.value = '';
});

async function loadFile(file) {
  const ok = file.name.toLowerCase().endsWith('.docx');
  if (!ok) {
    flash('Please pick a .docx file. (Old .doc format isn\'t supported — save as .docx in Word first.)', 'error');
    return;
  }
  docName = file.name.replace(/\.docx$/i, '');
  flash('Reading document…', 'busy');

  try {
    const arrayBuffer = await file.arrayBuffer();
    // Convert via mammoth.js
    const result = await mammoth.convertToHtml({ arrayBuffer }, {
      // Inline images as data URIs
      convertImage: mammoth.images.imgElement(function (image) {
        return image.read('base64').then(function (b64) {
          return { src: 'data:' + image.contentType + ';base64,' + b64 };
        });
      })
    });
    html = result.value;
    if (!html.trim()) {
      flash('Document is empty or could not be parsed.', 'error');
      return;
    }
    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${(file.size / 1024).toFixed(1)} KB`
      + (result.messages.length ? ` · <span style="color:#888">${result.messages.length} parse warning(s)</span>` : '');
    preview.innerHTML = html;
    editorCard.style.display = '';
    flash('✓ Ready — click Download PDF', 'ok');
  } catch (err) {
    flash('Could not parse: ' + err.message, 'error');
  }
}

document.getElementById('dl-btn').addEventListener('click', async () => {
  if (!html) return;
  flash('Building PDF…', 'busy');

  const margin = parseFloat(marginEl.value) || 1;
  const options = {
    margin: [margin, margin, margin, margin],
    filename: `${docName || 'document'}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: {
      unit: 'in',
      format: sizeEl.value,
      orientation: orientEl.value,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  // Build a cloned element with the same styles for accurate rendering
  const wrap = document.createElement('div');
  wrap.style.cssText = 'background:#fff;color:#000;font-family:Georgia,serif;font-size:12pt;line-height:1.5;width:7.5in;padding:0;';
  wrap.innerHTML = html;
  // Force heading + table styling for PDF output
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    h1,h2,h3,h4,h5,h6 { font-family: Calibri, sans-serif; color: #1f3864; margin: 0.6em 0 0.3em; }
    h1 { font-size: 20pt; } h2 { font-size: 16pt; } h3 { font-size: 13pt; }
    p { margin: 0 0 8pt; }
    table { border-collapse: collapse; margin: 8pt 0; width: 100%; }
    td, th { border: 1px solid #bbb; padding: 5pt 8pt; font-size: 11pt; }
    ul, ol { padding-left: 22pt; margin: 6pt 0; }
    a { color: #0563c1; }
    img { max-width: 100%; }
    blockquote { border-left: 3pt solid #ccc; padding-left: 10pt; color: #444; }
  `;
  wrap.prepend(styleTag);

  try {
    await html2pdf().set(options).from(wrap).save();
    flash('✓ PDF downloaded', 'ok');
  } catch (err) {
    flash('Failed to build PDF: ' + err.message, 'error');
  }
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 3000);
}

function escapeHtml(s) {
  const d = document.createElement('div'); d.textContent = s; return d.innerHTML;
}
