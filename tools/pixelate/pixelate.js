/**
 * Pixelate / Blur Image — draw redaction boxes
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const canvasWrap = document.getElementById('canvas-wrap');
const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
const strengthEl = document.getElementById('strength');
const strengthVal = document.getElementById('strength-val');
const boxCountEl = document.getElementById('box-count');
const statusMsg = document.getElementById('status-msg');

let img = null;
let imgName = '';
let effect = 'pixelate';
let boxes = []; // {x, y, w, h, effect, strength}
let displayScale = 1;
let drawing = null;

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.querySelectorAll('[data-effect]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-effect]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    effect = btn.dataset.effect;
  });
});
strengthEl.addEventListener('input', () => { strengthVal.textContent = strengthEl.value + ' px'; });
document.getElementById('clear-boxes').addEventListener('click', () => { boxes = []; redraw(); });

document.getElementById('reset-btn').addEventListener('click', () => {
  img = null; boxes = [];
  editorCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.type.startsWith('image/')) { flash('Please pick an image.', 'error'); return; }
  imgName = file.name.replace(/\.[^.]+$/, '');
  const dataUrl = await new Promise(res => {
    const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file);
  });
  img = new Image();
  img.onload = () => {
    const maxW = 720, maxH = 500;
    displayScale = Math.min(1, Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight));
    canvas.width = img.naturalWidth * displayScale;
    canvas.height = img.naturalHeight * displayScale;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    boxes = [];
    editorCard.style.display = '';
    redraw();
  };
  img.src = dataUrl;
}

function redraw() {
  if (!img) return;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  for (const box of boxes) {
    applyEffect(box);
  }
  if (drawing) {
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(drawing.x, drawing.y, drawing.w, drawing.h);
    ctx.setLineDash([]);
  }
  boxCountEl.textContent = boxes.length;
}

function applyEffect(box) {
  const { x, y, w, h, effect: e, strength: s } = box;
  if (w <= 0 || h <= 0) return;
  if (e === 'black') {
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, w, h);
    return;
  }
  // Snapshot region
  const sx = Math.max(0, Math.floor(x));
  const sy = Math.max(0, Math.floor(y));
  const sw = Math.min(canvas.width - sx, Math.floor(w));
  const sh = Math.min(canvas.height - sy, Math.floor(h));
  if (sw <= 0 || sh <= 0) return;
  if (e === 'pixelate') {
    const block = Math.max(2, s);
    // Read the region as low-res, then upscale
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = Math.max(1, Math.floor(sw / block));
    tempCanvas.height = Math.max(1, Math.floor(sh / block));
    const tctx = tempCanvas.getContext('2d');
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, tempCanvas.width, tempCanvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, sx, sy, sw, sh);
    ctx.imageSmoothingEnabled = true;
  } else if (e === 'blur') {
    // CSS-style filter blur applied by drawing through an offscreen canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sw; tempCanvas.height = sh;
    const tctx = tempCanvas.getContext('2d');
    tctx.filter = `blur(${s}px)`;
    tctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
    ctx.drawImage(tempCanvas, sx, sy);
  }
}

// Box drawing + click-to-delete
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  // Click inside existing box → remove it
  const idx = boxes.findIndex(b => px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h);
  if (idx >= 0) { boxes.splice(idx, 1); redraw(); return; }
  drawing = { x: px, y: py, w: 0, h: 0 };
});
canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  drawing.w = (e.clientX - rect.left) - drawing.x;
  drawing.h = (e.clientY - rect.top) - drawing.y;
  redraw();
});
canvas.addEventListener('mouseup', () => {
  if (!drawing) return;
  let { x, y, w, h } = drawing;
  if (w < 0) { x += w; w = -w; }
  if (h < 0) { y += h; h = -h; }
  if (w >= 6 && h >= 6) {
    boxes.push({ x, y, w, h, effect, strength: parseInt(strengthEl.value, 10) });
  }
  drawing = null;
  redraw();
});

document.getElementById('dl-png').addEventListener('click', () => download('image/png', 'png'));
document.getElementById('dl-jpg').addEventListener('click', () => download('image/jpeg', 'jpg', 0.95));

function download(mime, ext, quality) {
  if (!img) return;
  // Render at full original resolution
  const out = document.createElement('canvas');
  out.width = img.naturalWidth; out.height = img.naturalHeight;
  const octx = out.getContext('2d');
  octx.drawImage(img, 0, 0);
  for (const box of boxes) {
    const scale = 1 / displayScale;
    applyToOut(octx, out, {
      x: box.x * scale, y: box.y * scale, w: box.w * scale, h: box.h * scale,
      effect: box.effect, strength: box.strength * scale
    });
  }
  out.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${imgName || 'image'}-redacted.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flash(`✓ Saved ${ext.toUpperCase()}`, 'ok');
  }, mime, quality);
}

function applyToOut(octx, outCanvas, box) {
  const { x, y, w, h, effect: e, strength: s } = box;
  if (e === 'black') { octx.fillStyle = '#000'; octx.fillRect(x, y, w, h); return; }
  if (e === 'pixelate') {
    const block = Math.max(2, s);
    const tmp = document.createElement('canvas');
    tmp.width = Math.max(1, Math.floor(w / block));
    tmp.height = Math.max(1, Math.floor(h / block));
    const tctx = tmp.getContext('2d');
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(outCanvas, x, y, w, h, 0, 0, tmp.width, tmp.height);
    octx.imageSmoothingEnabled = false;
    octx.drawImage(tmp, 0, 0, tmp.width, tmp.height, x, y, w, h);
    octx.imageSmoothingEnabled = true;
  } else if (e === 'blur') {
    const tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    const tctx = tmp.getContext('2d');
    tctx.filter = `blur(${s}px)`;
    tctx.drawImage(outCanvas, x, y, w, h, 0, 0, w, h);
    octx.drawImage(tmp, x, y);
  }
}

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls) setTimeout(() => { statusMsg.textContent = ''; }, 2000);
}
