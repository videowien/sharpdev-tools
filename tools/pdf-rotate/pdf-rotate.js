/**
 * Rotate PDF — SharpDev Tools
 * pdf.js renders thumbnails; pdf-lib applies rotation metadata on save.
 */

const pdfjsLib = await import(
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs'
);
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const { PDFDocument, degrees } = window.PDFLib;

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const progressArea = document.getElementById('progress-area');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const thumbsGrid = document.getElementById('thumbs-grid');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');

let currentBytes = null;
let currentName = '';
let rotations = []; // index → 0/90/180/270 (extra rotation to add)

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

async function loadPdf(file) {
  if (!file.type.includes('pdf') && !/\.pdf$/i.test(file.name)) {
    alert('Please pick a PDF file.');
    return;
  }
  currentName = file.name.replace(/\.pdf$/i, '');
  try {
    currentBytes = new Uint8Array(await file.arrayBuffer());
    progressArea.style.display = '';
    editorCard.style.display = 'none';
    const pdf = await pdfjsLib.getDocument({ data: currentBytes.slice() }).promise;
    const total = pdf.numPages;
    rotations = Array(total).fill(0);
    fileInfo.textContent = `${file.name} — ${total} page${total === 1 ? '' : 's'}`;
    thumbsGrid.innerHTML = '';

    for (let i = 1; i <= total; i++) {
      progressBar.style.width = (((i - 1) / total) * 100) + '%';
      progressText.textContent = `Rendering page ${i} of ${total}...`;
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      page.cleanup();
      addThumbCard(i, canvas.toDataURL('image/jpeg', 0.7));
    }
    progressArea.style.display = 'none';
    editorCard.style.display = '';
  } catch (e) {
    progressArea.style.display = 'none';
    alert('Could not open PDF: ' + (e.message || e));
  }
}

function addThumbCard(pageNum, dataUrl) {
  const card = document.createElement('div');
  card.className = 'thumb-card';
  card.dataset.page = pageNum;
  card.innerHTML =
    '<div class="thumb-img-wrap"><img alt="Page ' + pageNum + '" class="thumb-img"/></div>' +
    '<div class="thumb-label">Page ' + pageNum + '</div>';
  const img = card.querySelector('img');
  img.src = dataUrl;
  card.addEventListener('click', () => {
    const idx = pageNum - 1;
    rotations[idx] = (rotations[idx] + 90) % 360;
    applyRotationVisually(card, rotations[idx]);
  });
  thumbsGrid.appendChild(card);
}

function applyRotationVisually(card, deg) {
  const img = card.querySelector('img');
  img.style.transform = `rotate(${deg}deg)`;
  card.classList.toggle('rotated', deg !== 0);
}

document.querySelectorAll('.btn-rotate').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = parseInt(btn.dataset.rot, 10);
    for (let i = 0; i < rotations.length; i++) {
      rotations[i] = target;
      const card = thumbsGrid.querySelector(`.thumb-card[data-page="${i + 1}"]`);
      if (card) applyRotationVisually(card, target);
    }
  });
});

saveBtn.addEventListener('click', async () => {
  if (!currentBytes) return;
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';
  statusMsg.textContent = '';
  try {
    const doc = await PDFDocument.load(currentBytes);
    const pages = doc.getPages();
    pages.forEach((p, i) => {
      if (rotations[i] !== 0) {
        const current = p.getRotation().angle || 0;
        p.setRotation(degrees((current + rotations[i]) % 360));
      }
    });
    const bytes = await doc.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentName}-rotated.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = '✓ Rotated PDF saved';
    statusMsg.className = 'status-msg ok';
  } catch (e) {
    statusMsg.textContent = 'Error: ' + (e.message || e);
    statusMsg.className = 'status-msg err';
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Rotated PDF';
  }
});

resetBtn.addEventListener('click', () => {
  currentBytes = null;
  currentName = '';
  rotations = [];
  fileInput.value = '';
  editorCard.style.display = 'none';
  thumbsGrid.innerHTML = '';
  statusMsg.textContent = '';
});
