/**
 * PDF Page Numbering — adds page numbers via pdf-lib
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const statusMsg = document.getElementById('status-msg');

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

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; pdfName = ''; pageCount = 0;
  editorCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    flash('Please pick a PDF file.', 'error');
    return;
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

document.getElementById('apply-btn').addEventListener('click', applyNumbers);

async function applyNumbers() {
  if (!pdfBytes) return;
  flash('Adding page numbers…', '');
  const position = document.getElementById('position').value;
  const format = document.getElementById('format').value;
  const startNum = Math.max(1, parseInt(document.getElementById('start-num').value, 10) || 1);
  const skipNum = Math.max(0, parseInt(document.getElementById('skip-num').value, 10) || 0);
  const fontSize = Math.max(6, Math.min(36, parseInt(document.getElementById('font-size').value, 10) || 11));

  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
    const pages = doc.getPages();
    const total = pages.length;
    const numberedTotal = total - skipNum;
    const [vAlign, hAlign] = position.split('-');

    for (let i = skipNum; i < total; i++) {
      const p = pages[i];
      const { width, height } = p.getSize();
      const pageNum = startNum + (i - skipNum);
      const numberedIndex = (i - skipNum) + 1;
      let text;
      switch (format) {
        case 'n-of-total': text = `${pageNum} of ${startNum + numberedTotal - 1}`; break;
        case 'page-n':     text = `Page ${pageNum}`; break;
        case 'dash':       text = `— ${pageNum} —`; break;
        default:           text = String(pageNum);
      }
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      let x;
      if (hAlign === 'left')   x = 30;
      else if (hAlign === 'right') x = width - 30 - textWidth;
      else x = (width - textWidth) / 2;
      const y = vAlign === 'header' ? height - 30 - fontSize : 30;

      p.drawText(text, { x, y, size: fontSize, font, color: PDFLib.rgb(0, 0, 0) });
    }

    const out = await doc.save();
    download(out, `${pdfName}-numbered.pdf`);
    flash(`✓ Added numbers to ${numberedTotal} pages`, 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
}

function download(bytes, name) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
