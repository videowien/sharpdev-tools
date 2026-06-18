/**
 * Image Crop Tool — drag + resize crop box, aspect lock optional
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const stage = document.getElementById('crop-stage');
const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
const cropBox = document.getElementById('crop-box');
const aspectEl = document.getElementById('aspect');
const sizeLabel = document.getElementById('crop-size');
const statusMsg = document.getElementById('status-msg');

let img = null;
let imgName = '';
let displayW = 0, displayH = 0; // canvas size on screen
let scale = 1; // displayW / img.naturalWidth
let crop = { x: 0, y: 0, w: 0, h: 0 }; // in display coords

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.getElementById('new-file').addEventListener('click', () => {
  img = null; editorCard.style.display = 'none'; fileInput.value = '';
});

async function loadFile(file) {
  if (!file.type.startsWith('image/')) { alert('Please pick an image.'); return; }
  imgName = file.name.replace(/\.[^.]+$/, '');
  const dataUrl = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
  img = new Image();
  img.onload = () => {
    fitDisplay();
    resetCrop();
    editorCard.style.display = '';
    drawAndPosition();
  };
  img.src = dataUrl;
}

function fitDisplay() {
  const maxW = Math.min(680, stage.clientWidth || 680);
  const maxH = 500;
  let w = img.naturalWidth, h = img.naturalHeight;
  if (w > maxW) { h *= maxW / w; w = maxW; }
  if (h > maxH) { w *= maxH / h; h = maxH; }
  displayW = w; displayH = h;
  canvas.width = w; canvas.height = h;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  scale = w / img.naturalWidth;
}

function resetCrop() {
  // Default crop = middle 80%
  const w = displayW * 0.8;
  const h = displayH * 0.8;
  crop = { x: (displayW - w) / 2, y: (displayH - h) / 2, w, h };
  applyAspect();
}

function applyAspect() {
  const a = aspectEl.value;
  if (a === 'free') return;
  const [aw, ah] = a.split(':').map(Number);
  const ratio = aw / ah;
  let w = crop.w, h = crop.h;
  if (w / h > ratio) w = h * ratio;
  else h = w / ratio;
  // Keep centered
  const cx = crop.x + crop.w / 2;
  const cy = crop.y + crop.h / 2;
  crop.w = w; crop.h = h;
  crop.x = cx - w / 2;
  crop.y = cy - h / 2;
  clampCrop();
}

function clampCrop() {
  crop.w = Math.max(20, Math.min(displayW, crop.w));
  crop.h = Math.max(20, Math.min(displayH, crop.h));
  crop.x = Math.max(0, Math.min(displayW - crop.w, crop.x));
  crop.y = Math.max(0, Math.min(displayH - crop.h, crop.y));
}

function drawAndPosition() {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, displayW, displayH);
  if (img) ctx.drawImage(img, 0, 0, displayW, displayH);
  cropBox.style.left = crop.x + 'px';
  cropBox.style.top = crop.y + 'px';
  cropBox.style.width = crop.w + 'px';
  cropBox.style.height = crop.h + 'px';
  // Crop size in original-pixel coords
  const ow = Math.round(crop.w / scale);
  const oh = Math.round(crop.h / scale);
  sizeLabel.textContent = `${ow} × ${oh}`;
}

aspectEl.addEventListener('change', () => { applyAspect(); drawAndPosition(); });

// Drag the crop box
let dragMode = null; // 'move' | 'nw' | 'ne' | 'sw' | 'se'
let dragStart = null;

cropBox.addEventListener('mousedown', startDrag);
cropBox.addEventListener('touchstart', startDrag, { passive: false });

function startDrag(e) {
  e.preventDefault();
  const target = e.target;
  if (target.classList.contains('crop-handle')) dragMode = target.dataset.handle;
  else dragMode = 'move';
  const pt = pointer(e);
  dragStart = { ...crop, mx: pt.x, my: pt.y };
}

document.addEventListener('mousemove', onMove);
document.addEventListener('touchmove', onMove, { passive: false });
document.addEventListener('mouseup', () => { dragMode = null; });
document.addEventListener('touchend', () => { dragMode = null; });

function pointer(e) {
  if (e.touches && e.touches[0]) {
    const rect = stage.getBoundingClientRect();
    return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
  }
  const rect = stage.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function onMove(e) {
  if (!dragMode || !img) return;
  e.preventDefault();
  const pt = pointer(e);
  const dx = pt.x - dragStart.mx;
  const dy = pt.y - dragStart.my;
  if (dragMode === 'move') {
    crop.x = dragStart.x + dx;
    crop.y = dragStart.y + dy;
  } else {
    // Resize from one corner
    let nx = dragStart.x, ny = dragStart.y, nw = dragStart.w, nh = dragStart.h;
    if (dragMode.includes('w')) { nx = dragStart.x + dx; nw = dragStart.w - dx; }
    if (dragMode.includes('e')) { nw = dragStart.w + dx; }
    if (dragMode.includes('n')) { ny = dragStart.y + dy; nh = dragStart.h - dy; }
    if (dragMode.includes('s')) { nh = dragStart.h + dy; }
    crop = { x: nx, y: ny, w: nw, h: nh };
    if (aspectEl.value !== 'free') applyAspect();
  }
  clampCrop();
  drawAndPosition();
}

function exportAt(mime, ext, quality) {
  if (!img) return;
  const out = document.createElement('canvas');
  out.width = Math.round(crop.w / scale);
  out.height = Math.round(crop.h / scale);
  const octx = out.getContext('2d');
  if (mime === 'image/jpeg') { octx.fillStyle = '#fff'; octx.fillRect(0, 0, out.width, out.height); }
  octx.drawImage(img, crop.x / scale, crop.y / scale, crop.w / scale, crop.h / scale, 0, 0, out.width, out.height);
  out.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${imgName || 'image'}-cropped.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = `✓ Saved ${ext.toUpperCase()} (${out.width}×${out.height})`;
    statusMsg.className = 'status-msg ok';
    setTimeout(() => { statusMsg.textContent = ''; }, 1800);
  }, mime, quality);
}

document.getElementById('dl-png').addEventListener('click', () => exportAt('image/png', 'png'));
document.getElementById('dl-jpg').addEventListener('click', () => exportAt('image/jpeg', 'jpg', 0.92));
document.getElementById('reset-btn').addEventListener('click', () => {
  if (!img) return;
  resetCrop(); drawAndPosition();
});

window.addEventListener('resize', () => {
  if (!img) return;
  fitDisplay(); resetCrop(); drawAndPosition();
});
