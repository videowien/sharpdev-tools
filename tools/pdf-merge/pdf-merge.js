/**
 * Merge PDF — SharpDev Tools
 * Combines multiple PDFs into one using pdf-lib (cdnjs).
 * Entirely client-side; nothing leaves the browser.
 */

const { PDFDocument } = window.PDFLib;

// ---- DOM refs ----
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const pdfsCard = document.getElementById('pdfs-card');
const pdfsList = document.getElementById('pdfs-list');
const mergeSummary = document.getElementById('merge-summary');
const mergeBtn = document.getElementById('merge-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');

// ---- State ----
let pdfs = []; // [{ id, file, bytes, pageCount }]
let dragSrcId = null;

// ---- Upload ----
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  addFiles(Array.from(fileInput.files));
  fileInput.value = '';
});
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  addFiles(Array.from(e.dataTransfer.files));
});

async function addFiles(files) {
  const pdfFiles = files.filter(
    (f) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name)
  );
  if (!pdfFiles.length) {
    alert('Please drop PDF files.');
    return;
  }
  for (const file of pdfFiles) {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
      pdfs.push({
        id: crypto.randomUUID(),
        file,
        bytes,
        pageCount: doc.getPageCount(),
      });
    } catch (e) {
      const msg = (e && e.message) || String(e);
      if (/encrypted/i.test(msg)) {
        alert(`"${file.name}" is encrypted/password-protected and can't be merged.`);
      } else {
        alert(`Could not open "${file.name}": ${msg}`);
      }
    }
  }
  pdfsCard.style.display = '';
  renderList();
}

// ---- Render list ----
function renderList() {
  pdfsList.innerHTML = '';
  if (pdfs.length === 0) {
    pdfsCard.style.display = 'none';
    mergeSummary.textContent = '';
    return;
  }
  pdfs.forEach((p, idx) => {
    const sizeKb = Math.round(p.file.size / 1024);
    const card = document.createElement('div');
    card.className = 'pdf-card';
    card.draggable = true;
    card.dataset.id = p.id;
    card.innerHTML =
      '<div class="pdf-card-idx">' + (idx + 1) + '</div>' +
      '<div class="pdf-card-icon">' +
        '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
      '</div>' +
      '<div class="pdf-card-meta">' +
        '<span class="pdf-card-name">' + escHtml(p.file.name) + '</span>' +
        '<span class="pdf-card-stat">' + p.pageCount + ' page' + (p.pageCount === 1 ? '' : 's') +
          ' · ' + sizeKb + ' KB</span>' +
      '</div>' +
      '<button class="pdf-card-remove" title="Remove">×</button>';
    card.querySelector('.pdf-card-remove').addEventListener('click', () => {
      pdfs = pdfs.filter((x) => x.id !== p.id);
      renderList();
    });
    // Drag-reorder
    card.addEventListener('dragstart', (e) => {
      dragSrcId = p.id;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      dragSrcId = null;
      pdfsList.querySelectorAll('.pdf-card').forEach((c) => c.classList.remove('drag-over'));
    });
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (dragSrcId && dragSrcId !== p.id) card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      if (!dragSrcId || dragSrcId === p.id) return;
      const srcIdx = pdfs.findIndex((x) => x.id === dragSrcId);
      const dstIdx = pdfs.findIndex((x) => x.id === p.id);
      const [moved] = pdfs.splice(srcIdx, 1);
      pdfs.splice(dstIdx, 0, moved);
      renderList();
    });
    pdfsList.appendChild(card);
  });
  const totalPages = pdfs.reduce((s, p) => s + p.pageCount, 0);
  mergeSummary.textContent =
    `${pdfs.length} PDFs · ${totalPages} pages total`;
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ---- Merge ----
mergeBtn.addEventListener('click', async () => {
  if (pdfs.length < 2) {
    alert('Please add at least 2 PDFs to merge.');
    return;
  }
  mergeBtn.disabled = true;
  mergeBtn.textContent = 'Merging...';
  statusMsg.textContent = '';
  try {
    const out = await PDFDocument.create();
    for (const p of pdfs) {
      const src = await PDFDocument.load(p.bytes, { ignoreEncryption: false });
      const copied = await out.copyPages(src, src.getPageIndices());
      copied.forEach((page) => out.addPage(page));
    }
    const mergedBytes = await out.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged-' + new Date().toISOString().slice(0, 10) + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = '✓ Merged PDF saved';
    statusMsg.className = 'status-msg ok';
  } catch (e) {
    statusMsg.textContent = 'Error: ' + (e.message || e);
    statusMsg.className = 'status-msg err';
  } finally {
    mergeBtn.disabled = false;
    mergeBtn.textContent = 'Merge into one PDF';
  }
});

// ---- Reset ----
resetBtn.addEventListener('click', () => {
  pdfs = [];
  fileInput.value = '';
  statusMsg.textContent = '';
  renderList();
});
