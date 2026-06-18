/**
 * Instagram Profile Pic Cropper — SharpDev Tools
 */

const DISPLAY = 540; // square canvas for editing (1:1)

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
const zoomEl = document.getElementById('zoom');
const zoomVal = document.getElementById('zoom-val');
const dl1080 = document.getElementById('dl-1080');
const dl320 = document.getElementById('dl-320');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');

let img = null;
let zoom = 1;
let offset = { x: 0, y: 0 };
let dragStart = null;

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

async function loadFile(file) {
  if (!file.type.startsWith('image/')) { alert('Please pick an image file.'); return; }
  const dataUrl = await new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
  img = new Image();
  img.onload = () => {
    // Cover (fill the square completely)
    const fit = Math.max(DISPLAY / img.naturalWidth, DISPLAY / img.naturalHeight);
    zoom = fit;
    zoomEl.min = Math.round(fit * 100);
    zoomEl.max = Math.round(fit * 100 * 3);
    zoomEl.value = Math.round(fit * 100);
    centerImage();
    editorCard.style.display = '';
    render();
  };
  img.src = dataUrl;
}

function centerImage() {
  if (!img) return;
  const drawW = img.naturalWidth * zoom;
  const drawH = img.naturalHeight * zoom;
  offset.x = (DISPLAY - drawW) / 2;
  offset.y = (DISPLAY - drawH) / 2;
}

function render() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, DISPLAY, DISPLAY);
  if (img) {
    const drawW = img.naturalWidth * zoom;
    const drawH = img.naturalHeight * zoom;
    ctx.drawImage(img, offset.x, offset.y, drawW, drawH);
  }
  zoomVal.textContent = Math.round(zoom * 100) + '%';
}

canvas.addEventListener('mousedown', (e) => {
  dragStart = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  canvas.style.cursor = 'grabbing';
});
window.addEventListener('mousemove', (e) => {
  if (!dragStart || !img) return;
  offset.x = e.clientX - dragStart.x;
  offset.y = e.clientY - dragStart.y;
  render();
});
window.addEventListener('mouseup', () => { dragStart = null; canvas.style.cursor = 'grab'; });

canvas.addEventListener('touchstart', (e) => {
  if (!e.touches[0]) return;
  dragStart = { x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y };
}, { passive: true });
canvas.addEventListener('touchmove', (e) => {
  if (!dragStart || !img || !e.touches[0]) return;
  offset.x = e.touches[0].clientX - dragStart.x;
  offset.y = e.touches[0].clientY - dragStart.y;
  render();
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchend', () => { dragStart = null; });

zoomEl.addEventListener('input', () => {
  const newZoom = parseInt(zoomEl.value, 10) / 100;
  const cx = DISPLAY / 2;
  const cy = DISPLAY / 2;
  const factor = newZoom / zoom;
  offset.x = cx - (cx - offset.x) * factor;
  offset.y = cy - (cy - offset.y) * factor;
  zoom = newZoom;
  render();
});

function exportAt(size) {
  if (!img) return;
  const out = document.createElement('canvas');
  out.width = size;
  out.height = size;
  const octx = out.getContext('2d');
  const scale = size / DISPLAY;
  octx.drawImage(
    img,
    offset.x * scale, offset.y * scale,
    img.naturalWidth * zoom * scale,
    img.naturalHeight * zoom * scale
  );
  out.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ig-profile-${size}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = `✓ Saved ${size}×${size} PNG`;
    statusMsg.className = 'status-msg ok';
    setTimeout(() => { statusMsg.textContent = ''; }, 1800);
  }, 'image/png');
}

dl1080.addEventListener('click', () => exportAt(1080));
dl320.addEventListener('click', () => exportAt(320));
resetBtn.addEventListener('click', () => {
  if (!img) return;
  const fit = Math.max(DISPLAY / img.naturalWidth, DISPLAY / img.naturalHeight);
  zoom = fit;
  zoomEl.value = Math.round(fit * 100);
  centerImage();
  render();
});
