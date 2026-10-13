/**
 * Twitter Banner Sizer — crop to 1500×500 with drag-to-position
 */

const TARGET_W = 1500;
const TARGET_H = 500;
const DISPLAY_W = 750;
const DISPLAY_H = 250;

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
const zoomEl = document.getElementById('zoom');
const zoomVal = document.getElementById('zoom-val');
const showSafe = document.getElementById('show-safe');
const zonePP = document.getElementById('zone-pp');
const zoneMobile = document.getElementById('zone-mobile');
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
  if (!file.type.startsWith('image/')) { alert('Please pick an image.'); return; }
  const dataUrl = await new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
  img = new Image();
  img.onload = () => {
    const fit = Math.max(DISPLAY_W / img.naturalWidth, DISPLAY_H / img.naturalHeight);
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
  const w = img.naturalWidth * zoom;
  const h = img.naturalHeight * zoom;
  offset.x = (DISPLAY_W - w) / 2;
  offset.y = (DISPLAY_H - h) / 2;
}

function render() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, DISPLAY_W, DISPLAY_H);
  if (img) {
    const w = img.naturalWidth * zoom;
    const h = img.naturalHeight * zoom;
    ctx.drawImage(img, offset.x, offset.y, w, h);
  }
  zoneMobile.style.display = showSafe.checked ? '' : 'none';
  zonePP.style.display = showSafe.checked ? '' : 'none';
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
  const cx = DISPLAY_W / 2;
  const cy = DISPLAY_H / 2;
  const factor = newZoom / zoom;
  offset.x = cx - (cx - offset.x) * factor;
  offset.y = cy - (cy - offset.y) * factor;
  zoom = newZoom;
  render();
});
showSafe.addEventListener('change', render);

function exportAt(mime, ext, quality) {
  if (!img) return;
  const out = document.createElement('canvas');
  out.width = TARGET_W; out.height = TARGET_H;
  const octx = out.getContext('2d');
  if (mime === 'image/jpeg') { octx.fillStyle = '#fff'; octx.fillRect(0, 0, TARGET_W, TARGET_H); }
  const scale = TARGET_W / DISPLAY_W;
  octx.drawImage(img, offset.x * scale, offset.y * scale, img.naturalWidth * zoom * scale, img.naturalHeight * zoom * scale);
  out.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `twitter-banner-${Date.now()}.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = `✓ Saved ${ext.toUpperCase()}`;
    statusMsg.className = 'status-msg ok';
    setTimeout(() => { statusMsg.textContent = ''; }, 1500);
  }, mime, quality);
}

document.getElementById('dl-png').addEventListener('click', () => exportAt('image/png', 'png'));
document.getElementById('dl-jpg').addEventListener('click', () => exportAt('image/jpeg', 'jpg', 0.92));
document.getElementById('reset-btn').addEventListener('click', () => {
  if (!img) return;
  const fit = Math.max(DISPLAY_W / img.naturalWidth, DISPLAY_H / img.naturalHeight);
  zoom = fit;
  zoomEl.value = Math.round(fit * 100);
  centerImage();
  render();
});
