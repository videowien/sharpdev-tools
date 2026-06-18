/**
 * LinkedIn Carousel PDF Builder — SharpDev Tools
 * Combine slide images into a single PDF (one image per page).
 */

const { jsPDF } = window.jspdf;

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const optionsCard = document.getElementById('options-card');
const aspectSel = document.getElementById('aspect');
const imageList = document.getElementById('image-list');
const buildBtn = document.getElementById('build-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');

let images = [];
let dragSrcId = null;

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
  if (!imgs.length) { alert('Only image files are supported.'); return; }
  for (const file of imgs) {
    const dataUrl = await readAsDataUrl(file);
    const { width, height } = await loadImageSize(dataUrl);
    images.push({
      id: crypto.randomUUID(), file, dataUrl, width, height, mime: file.type,
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
        '<span class="img-card-idx">Slide ' + (idx + 1) + '</span>' +
        '<span class="img-card-dim">' + img.width + '×' + img.height + '</span>' +
      '</div>' +
      '<button class="img-card-remove" title="Remove">×</button>';
    card.querySelector('.img-card-remove').addEventListener('click', () => {
      images = images.filter((i) => i.id !== img.id);
      renderList();
    });
    card.addEventListener('dragstart', () => { dragSrcId = img.id; card.classList.add('dragging'); });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging'); dragSrcId = null;
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
      const src = images.findIndex((i) => i.id === dragSrcId);
      const dst = images.findIndex((i) => i.id === img.id);
      const [moved] = images.splice(src, 1);
      images.splice(dst, 0, moved);
      renderList();
    });
    imageList.appendChild(card);
  });
}

function mimeToFmt(mime) {
  if (mime.includes('png')) return 'PNG';
  if (mime.includes('webp')) return 'WEBP';
  if (mime.includes('gif')) return 'GIF';
  return 'JPEG';
}

buildBtn.addEventListener('click', async () => {
  if (!images.length) { alert('Add at least one slide image.'); return; }
  buildBtn.disabled = true;
  buildBtn.textContent = 'Building PDF...';
  statusMsg.textContent = '';
  try {
    const ratio = aspectSel.value;
    // Determine page size in pixels at 1080 base
    let pw, ph;
    if (ratio === 'auto') {
      pw = images[0].width;
      ph = images[0].height;
    } else if (ratio === '1:1') { pw = 1080; ph = 1080; }
    else if (ratio === '4:5') { pw = 1080; ph = 1350; }
    else if (ratio === '16:9') { pw = 1920; ph = 1080; }

    const pdf = new jsPDF({ unit: 'px', format: [pw, ph], orientation: pw >= ph ? 'l' : 'p', hotfixes: ['px_scaling'] });

    images.forEach((img, i) => {
      if (i > 0) pdf.addPage([pw, ph], pw >= ph ? 'l' : 'p');
      // Fit image to page preserving aspect
      const imgAspect = img.width / img.height;
      const pageAspect = pw / ph;
      let drawW, drawH;
      if (imgAspect > pageAspect) {
        drawW = pw;
        drawH = drawW / imgAspect;
      } else {
        drawH = ph;
        drawW = drawH * imgAspect;
      }
      const x = (pw - drawW) / 2;
      const y = (ph - drawH) / 2;
      // White background under image to avoid weird transparent edges
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pw, ph, 'F');
      pdf.addImage(img.dataUrl, mimeToFmt(img.mime), x, y, drawW, drawH, undefined, 'FAST');
    });

    pdf.save(`linkedin-carousel-${new Date().toISOString().slice(0, 10)}.pdf`);
    statusMsg.textContent = `✓ Saved (${images.length} slides)`;
    statusMsg.className = 'status-msg ok';
  } catch (e) {
    statusMsg.textContent = 'Error: ' + (e.message || e);
    statusMsg.className = 'status-msg err';
  } finally {
    buildBtn.disabled = false;
    buildBtn.textContent = 'Build PDF';
  }
});

resetBtn.addEventListener('click', () => {
  images = [];
  fileInput.value = '';
  statusMsg.textContent = '';
  renderList();
});
