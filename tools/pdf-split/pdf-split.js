/**
 * Split PDF — SharpDev Tools
 * Uses pdf-lib to extract page ranges or split each page into its own PDF.
 * Result delivered as a single ZIP via /shared/zip.js when multiple files.
 */

const { PDFDocument } = window.PDFLib;

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const optionsCard = document.getElementById('options-card');
const fileInfo = document.getElementById('file-info');
const rangeGroup = document.getElementById('range-group');
const rangeInput = document.getElementById('range-input');
const splitBtn = document.getElementById('split-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');

let currentBytes = null;
let currentName = '';
let currentPageCount = 0;

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) loadPdf(fileInput.files[0]);
});
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadPdf(e.dataTransfer.files[0]);
});

document.querySelectorAll('input[name="mode"]').forEach((r) => {
  r.addEventListener('change', () => {
    rangeGroup.style.display = r.value === 'range' && r.checked ? '' : 'none';
    if (r.value === 'each' && r.checked) rangeGroup.style.display = 'none';
  });
});

async function loadPdf(file) {
  if (!file.type.includes('pdf') && !/\.pdf$/i.test(file.name)) {
    alert('Please pick a PDF file.');
    return;
  }
  try {
    currentName = file.name.replace(/\.pdf$/i, '');
    currentBytes = new Uint8Array(await file.arrayBuffer());
    const doc = await PDFDocument.load(currentBytes);
    currentPageCount = doc.getPageCount();
    fileInfo.textContent = `${file.name} — ${currentPageCount} page${currentPageCount === 1 ? '' : 's'}`;
    rangeInput.placeholder = `e.g. 1-${currentPageCount}, ${Math.min(3, currentPageCount)}`;
    rangeInput.value = `1-${currentPageCount}`;
    optionsCard.style.display = '';
    statusMsg.textContent = '';
  } catch (e) {
    alert('Could not open PDF: ' + (e.message || e));
  }
}

function parseRange(input, max) {
  const pages = new Set();
  for (const part of input.split(',')) {
    const seg = part.trim();
    if (!seg) continue;
    const m = seg.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      let a = parseInt(m[1], 10);
      let b = parseInt(m[2], 10);
      if (a > b) [a, b] = [b, a];
      for (let i = a; i <= b; i++) if (i >= 1 && i <= max) pages.add(i);
    } else if (/^\d+$/.test(seg)) {
      const n = parseInt(seg, 10);
      if (n >= 1 && n <= max) pages.add(n);
    } else {
      throw new Error(`Invalid range segment: "${seg}"`);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

splitBtn.addEventListener('click', async () => {
  if (!currentBytes) return;
  splitBtn.disabled = true;
  splitBtn.textContent = 'Splitting...';
  statusMsg.textContent = '';
  statusMsg.className = 'status-msg';
  try {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const src = await PDFDocument.load(currentBytes);

    if (mode === 'range') {
      const pages = parseRange(rangeInput.value, currentPageCount);
      if (!pages.length) throw new Error('No valid pages selected.');
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(
        new Blob([bytes], { type: 'application/pdf' }),
        `${currentName}-pages-${pages[0]}-${pages[pages.length - 1]}.pdf`
      );
      statusMsg.textContent = `✓ ${pages.length} page${pages.length === 1 ? '' : 's'} extracted`;
      statusMsg.className = 'status-msg ok';
    } else {
      // Each page → own PDF, bundled as ZIP
      const entries = [];
      for (let i = 0; i < currentPageCount; i++) {
        const single = await PDFDocument.create();
        const [p] = await single.copyPages(src, [i]);
        single.addPage(p);
        const bytes = await single.save();
        entries.push({
          name: `${currentName}-page-${String(i + 1).padStart(3, '0')}.pdf`,
          data: new Uint8Array(bytes),
        });
      }
      const zipBlob = SDZip.create(entries);
      downloadBlob(zipBlob, `${currentName}-pages.zip`);
      statusMsg.textContent = `✓ ${currentPageCount} single-page PDFs in ZIP`;
      statusMsg.className = 'status-msg ok';
    }
  } catch (e) {
    statusMsg.textContent = 'Error: ' + (e.message || e);
    statusMsg.className = 'status-msg err';
  } finally {
    splitBtn.disabled = false;
    splitBtn.textContent = 'Split PDF';
  }
});

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

resetBtn.addEventListener('click', () => {
  currentBytes = null;
  currentName = '';
  currentPageCount = 0;
  fileInput.value = '';
  optionsCard.style.display = 'none';
  statusMsg.textContent = '';
});
