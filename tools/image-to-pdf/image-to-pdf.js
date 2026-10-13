/**
 * Image to PDF — SharpDev Tools
 * Builds a PDF from one or more images using jsPDF (cdnjs).
 * Supports JPG, PNG, WebP, GIF (first frame). All processing local.
 */

const { jsPDF } = window.jspdf;

// ---- DOM refs ----
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const optionsCard = document.getElementById('options-card');
const imageList = document.getElementById('image-list');
const createBtn = document.getElementById('create-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');
const pageSize = document.getElementById('page-size');

// ---- State ----
let images = []; // [{ id, file, dataUrl, width, height, mime }]
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
  const imgs = files.filter((f) => f.type.startsWith('image/'));
  if (!imgs.length) {
    alert('Only image files are supported.');
    return;
  }
  for (const file of imgs) {
    const dataUrl = await readAsDataUrl(file);
    const { width, height } = await loadImageSize(dataUrl);
    images.push({
      id: crypto.randomUUID(),
      file,
      dataUrl,
      width,
      height,
      mime: file.type,
    });
  }
  optionsCard.style.display = '';
  renderList();
}

function readAsDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function loadImageSize(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = rej;
    img.src = src;
  });
}

// ---- Render list ----
function renderList() {
  imageList.innerHTML = '';
  if (images.length === 0) {
    optionsCard.style.display = 'none';
    return;
  }
  images.forEach((img, idx) => {
    const card = document.createElement('div');
    card.className = 'img-card';
    card.draggable = true;
    card.dataset.id = img.id;
    card.innerHTML =
      '<div class="img-card-thumb"><img alt="" src="' + img.dataUrl + '"/></div>' +
      '<div class="img-card-meta">' +
        '<span class="img-card-idx">' + (idx + 1) + '</span>' +
        '<span class="img-card-name">' + escHtml(img.file.name) + '</span>' +
        '<span class="img-card-dim">' + img.width + '×' + img.height + '</span>' +
      '</div>' +
      '<button class="img-card-remove" title="Remove">×</button>';
    card.querySelector('.img-card-remove').addEventListener('click', () => {
      images = images.filter((i) => i.id !== img.id);
      renderList();
    });
    // Drag-reorder
    card.addEventListener('dragstart', (e) => {
      dragSrcId = img.id;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      dragSrcId = null;
      imageList.querySelectorAll('.img-card').forEach((c) => c.classList.remove('drag-over'));
    });
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (dragSrcId && dragSrcId !== img.id) card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      if (!dragSrcId || dragSrcId === img.id) return;
      const srcIdx = images.findIndex((i) => i.id === dragSrcId);
      const dstIdx = images.findIndex((i) => i.id === img.id);
      const [moved] = images.splice(srcIdx, 1);
      images.splice(dstIdx, 0, moved);
      renderList();
    });
    imageList.appendChild(card);
  });
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ---- Create PDF ----
createBtn.addEventListener('click', async () => {
  if (!images.length) {
    alert('Add at least one image first.');
    return;
  }
  createBtn.disabled = true;
  createBtn.textContent = 'Building PDF...';
  statusMsg.textContent = '';

  try {
    const orient = document.querySelector('input[name="orient"]:checked').value;
    const marginMm = parseInt(document.querySelector('input[name="margin"]:checked').value, 10);
    const size = pageSize.value;

    let pdf = null;
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const pageOrient =
        orient === 'auto'
          ? img.width >= img.height
            ? 'landscape'
            : 'portrait'
          : orient;

      let pageFormat;
      if (size === 'auto') {
        // Convert image px to mm at 96 DPI (CSS reference)
        const wMm = (img.width / 96) * 25.4;
        const hMm = (img.height / 96) * 25.4;
        pageFormat = [wMm, hMm];
      } else {
        pageFormat = size;
      }

      if (i === 0) {
        pdf = new jsPDF({ orientation: pageOrient, unit: 'mm', format: pageFormat });
      } else {
        pdf.addPage(pageFormat, pageOrient);
      }

      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const availW = pw - 2 * marginMm;
      const availH = ph - 2 * marginMm;
      const imgAspect = img.width / img.height;
      const availAspect = availW / availH;
      let drawW, drawH;
      if (imgAspect > availAspect) {
        drawW = availW;
        drawH = drawW / imgAspect;
      } else {
        drawH = availH;
        drawW = drawH * imgAspect;
      }
      const x = (pw - drawW) / 2;
      const y = (ph - drawH) / 2;
      const fmt = mimeToJsPdfFormat(img.mime);
      pdf.addImage(img.dataUrl, fmt, x, y, drawW, drawH, undefined, 'FAST');
    }

    const filename = images.length === 1
      ? images[0].file.name.replace(/\.[^.]+$/, '') + '.pdf'
      : 'images-' + new Date().toISOString().slice(0, 10) + '.pdf';
    pdf.save(filename);
    statusMsg.textContent = '✓ PDF saved';
    statusMsg.className = 'status-msg ok';
  } catch (e) {
    statusMsg.textContent = 'Error: ' + (e.message || e);
    statusMsg.className = 'status-msg err';
  } finally {
    createBtn.disabled = false;
    createBtn.textContent = 'Create PDF';
  }
});

function mimeToJsPdfFormat(mime) {
  if (mime.includes('png')) return 'PNG';
  if (mime.includes('webp')) return 'WEBP';
  if (mime.includes('gif')) return 'GIF';
  return 'JPEG';
}

// ---- Reset ----
resetBtn.addEventListener('click', () => {
  images = [];
  fileInput.value = '';
  statusMsg.textContent = '';
  renderList();
});
