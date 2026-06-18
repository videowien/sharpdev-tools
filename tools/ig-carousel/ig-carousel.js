/**
 * Instagram Carousel Image Splitter — SharpDev Tools
 * Slices a wide image into N square or 4:5 slides.
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const optionsCard = document.getElementById('options-card');
const fileInfo = document.getElementById('file-info');
const slidesEl = document.getElementById('slides');
const splitBtn = document.getElementById('split-btn');
const resultArea = document.getElementById('result-area');
const resultLabel = document.getElementById('result-label');
const slidesGrid = document.getElementById('slides-grid');
const zipBtn = document.getElementById('zip-btn');
const resetBtn = document.getElementById('reset-btn');

let sourceImg = null;
let sourceName = '';
let renderedSlides = []; // [{ blob, dataUrl, ext }]

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) loadImage(fileInput.files[0]);
});
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadImage(e.dataTransfer.files[0]);
});

async function loadImage(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please drop an image file.');
    return;
  }
  sourceName = file.name.replace(/\.[^.]+$/, '');
  const dataUrl = await readAsDataUrl(file);
  sourceImg = await loadImageElement(dataUrl);
  fileInfo.textContent = `${file.name} — ${sourceImg.naturalWidth} × ${sourceImg.naturalHeight}`;
  optionsCard.style.display = '';
  resultArea.style.display = 'none';
}

function readAsDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function loadImageElement(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

splitBtn.addEventListener('click', async () => {
  if (!sourceImg) return;
  splitBtn.disabled = true;
  splitBtn.textContent = 'Slicing...';
  try {
    const n = Math.max(2, Math.min(10, parseInt(slidesEl.value, 10) || 5));
    const ratio = document.querySelector('input[name="ratio"]:checked').value;
    const fmt = document.querySelector('input[name="fmt"]:checked').value;
    const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
    const ext = fmt === 'png' ? 'png' : 'jpg';
    // Target dimensions per slide
    const targetW = 1080;
    const targetH = ratio === '4:5' ? 1350 : 1080;

    const srcW = sourceImg.naturalWidth;
    const srcH = sourceImg.naturalHeight;
    const sliceW = srcW / n;

    renderedSlides = [];
    for (let i = 0; i < n; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (fmt === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }
      // Draw the i-th slice of the source into the target canvas
      ctx.drawImage(
        sourceImg,
        i * sliceW, 0, sliceW, srcH,  // source rect
        0, 0, targetW, targetH         // destination rect
      );
      const blob = await new Promise((res) =>
        canvas.toBlob(res, mime, fmt === 'jpg' ? 0.92 : undefined)
      );
      const dataUrl = canvas.toDataURL(mime, fmt === 'jpg' ? 0.92 : undefined);
      renderedSlides.push({ blob, dataUrl, ext, mime });
    }

    optionsCard.style.display = 'none';
    resultLabel.textContent = `${n} slides — ${targetW}×${targetH} ${fmt.toUpperCase()}`;
    slidesGrid.innerHTML = '';
    renderedSlides.forEach((slide, i) => {
      const card = document.createElement('div');
      card.className = 'slide-card';
      const sizeKb = Math.round(slide.blob.size / 1024);
      card.innerHTML =
        '<div class="slide-num">' + (i + 1) + '</div>' +
        '<img alt="Slide ' + (i + 1) + '" loading="lazy"/>' +
        '<div class="slide-info">' + sizeKb + ' KB</div>' +
        '<button class="btn btn-secondary btn-sm slide-dl" type="button">Download</button>';
      card.querySelector('img').src = slide.dataUrl;
      card.querySelector('.slide-dl').addEventListener('click', () => downloadOne(slide, i + 1));
      slidesGrid.appendChild(card);
    });
    resultArea.style.display = '';
  } finally {
    splitBtn.disabled = false;
    splitBtn.textContent = 'Split into slides';
  }
});

function downloadOne(slide, idx) {
  const url = URL.createObjectURL(slide.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sourceName}-slide-${String(idx).padStart(2, '0')}.${slide.ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

zipBtn.addEventListener('click', async () => {
  if (!renderedSlides.length) return;
  zipBtn.disabled = true;
  zipBtn.textContent = 'Packing ZIP...';
  try {
    const entries = await Promise.all(
      renderedSlides.map(async (slide, i) => ({
        name: `${sourceName}-slide-${String(i + 1).padStart(2, '0')}.${slide.ext}`,
        data: new Uint8Array(await slide.blob.arrayBuffer()),
      }))
    );
    const blob = SDZip.create(entries);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sourceName}-carousel.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } finally {
    zipBtn.disabled = false;
    zipBtn.textContent = 'Download all as ZIP';
  }
});

resetBtn.addEventListener('click', () => {
  sourceImg = null;
  sourceName = '';
  renderedSlides = [];
  fileInput.value = '';
  optionsCard.style.display = 'none';
  resultArea.style.display = 'none';
});
