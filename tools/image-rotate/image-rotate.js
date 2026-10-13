/**
 * Image Rotate & Flip — canvas-based, lossless at 90° multiples
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
const angleEl = document.getElementById('custom-angle');
const angleVal = document.getElementById('angle-val');
const statusMsg = document.getElementById('status-msg');

let img = null;
let imgName = '';
// State: rotation in degrees (multiples), flips, custom angle
let rotation = 0; // 0, 90, 180, 270
let flipH = false;
let flipV = false;
let customAngle = 0;

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

document.getElementById('reset-file-btn').addEventListener('click', () => {
  img = null;
  editorCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.type.startsWith('image/')) { alert('Please pick an image.'); return; }
  imgName = file.name.replace(/\.[^.]+$/, '');
  const dataUrl = await new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
  img = new Image();
  img.onload = () => {
    rotation = 0; flipH = false; flipV = false; customAngle = 0;
    angleEl.value = 0; angleVal.textContent = '0°';
    editorCard.style.display = '';
    render();
  };
  img.src = dataUrl;
}

document.querySelectorAll('.op-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const op = btn.dataset.op;
    if (op === 'rot-left') rotation = (rotation - 90 + 360) % 360;
    else if (op === 'rot-right') rotation = (rotation + 90) % 360;
    else if (op === 'rot-180') rotation = (rotation + 180) % 360;
    else if (op === 'flip-h') flipH = !flipH;
    else if (op === 'flip-v') flipV = !flipV;
    else if (op === 'reset') { rotation = 0; flipH = false; flipV = false; customAngle = 0; angleEl.value = 0; angleVal.textContent = '0°'; }
    render();
  });
});

angleEl.addEventListener('input', () => {
  customAngle = parseFloat(angleEl.value);
  angleVal.textContent = customAngle.toFixed(0) + '°';
  render();
});

function render() {
  if (!img) return;
  const totalAngle = ((rotation + customAngle) % 360) * Math.PI / 180;
  // Compute new bounding box from rotated original
  const w = img.naturalWidth, h = img.naturalHeight;
  const cos = Math.abs(Math.cos(totalAngle));
  const sin = Math.abs(Math.sin(totalAngle));
  const newW = Math.round(w * cos + h * sin);
  const newH = Math.round(w * sin + h * cos);
  canvas.width = newW;
  canvas.height = newH;
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, newW, newH);
  ctx.translate(newW / 2, newH / 2);
  ctx.rotate(totalAngle);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -w / 2, -h / 2);
  ctx.restore();
}

document.getElementById('dl-png').addEventListener('click', () => download('image/png', 'png'));
document.getElementById('dl-jpg').addEventListener('click', () => download('image/jpeg', 'jpg'));

function download(mime, ext) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${imgName || 'image'}-rotated.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = `✓ Saved ${ext.toUpperCase()}`;
    statusMsg.className = 'status-msg ok';
    setTimeout(() => { statusMsg.textContent = ''; }, 1800);
  }, mime, mime === 'image/jpeg' ? 0.95 : undefined);
}
