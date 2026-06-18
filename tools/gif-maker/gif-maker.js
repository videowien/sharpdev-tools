/**
 * GIF Maker — combine images via gif.js
 */

const MAX = 30;
const WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js';

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const thumbsEl = document.getElementById('thumbs');
const delayEl = document.getElementById('delay');
const sizeEl = document.getElementById('size');
const qualityEl = document.getElementById('quality');
const statusMsg = document.getElementById('status-msg');
const outputRow = document.getElementById('output-row');
const outputGif = document.getElementById('output-gif');

let images = []; // {img, dataUrl}
let dragSrc = null;
let lastBlob = null;

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) addFiles(Array.from(fileInput.files)); fileInput.value = ''; });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) addFiles(Array.from(e.dataTransfer.files));
});

document.getElementById('clear-btn').addEventListener('click', () => {
  images = []; thumbsEl.innerHTML = '';
  editorCard.style.display = 'none';
  outputRow.style.display = 'none';
});

async function addFiles(files) {
  const avail = MAX - images.length;
  const valid = files.filter(f => f.type.startsWith('image/')).slice(0, avail);
  for (const f of valid) {
    const dataUrl = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); });
    const img = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = dataUrl; });
    images.push({ img, dataUrl });
  }
  if (images.length) editorCard.style.display = '';
  renderThumbs();
}

function renderThumbs() {
  thumbsEl.innerHTML = '';
  images.forEach((it, i) => {
    const t = document.createElement('div');
    t.className = 'thumb'; t.draggable = true;
    t.innerHTML = `<img src="${it.dataUrl}" alt="frame ${i + 1}"/><span class="num">${i + 1}</span><button class="x" type="button">×</button>`;
    t.addEventListener('dragstart', () => { dragSrc = i; t.classList.add('dragging'); });
    t.addEventListener('dragend', () => t.classList.remove('dragging'));
    t.addEventListener('dragover', (e) => e.preventDefault());
    t.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragSrc === null || dragSrc === i) return;
      const moved = images.splice(dragSrc, 1)[0];
      images.splice(i, 0, moved);
      dragSrc = null; renderThumbs();
    });
    t.querySelector('.x').addEventListener('click', () => { images.splice(i, 1); renderThumbs(); });
    thumbsEl.appendChild(t);
  });
}

document.getElementById('make-btn').addEventListener('click', () => {
  if (images.length < 2) { flash('Need at least 2 images.', 'error'); return; }
  if (typeof GIF === 'undefined') { flash('GIF library not loaded.', 'error'); return; }
  flash('Encoding GIF — this may take a moment…', 'busy');
  outputRow.style.display = 'none';

  const maxDim = parseInt(sizeEl.value, 10);
  const delay = parseInt(delayEl.value, 10);
  const quality = parseInt(qualityEl.value, 10);

  // Determine output dims from first image (aspect-preserved fit into maxDim)
  const first = images[0].img;
  const ratio = Math.min(maxDim / first.naturalWidth, maxDim / first.naturalHeight, 1);
  const W = Math.floor(first.naturalWidth * ratio);
  const H = Math.floor(first.naturalHeight * ratio);

  const gif = new GIF({
    workers: 2,
    quality,
    width: W,
    height: H,
    workerScript: WORKER_URL,
  });

  for (const it of images) {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    // Cover-fit each image
    const iw = it.img.naturalWidth, ih = it.img.naturalHeight;
    const sourceRatio = iw / ih;
    const targetRatio = W / H;
    let sx, sy, sw, sh;
    if (sourceRatio > targetRatio) { sh = ih; sw = ih * targetRatio; sx = (iw - sw) / 2; sy = 0; }
    else { sw = iw; sh = iw / targetRatio; sx = 0; sy = (ih - sh) / 2; }
    ctx.drawImage(it.img, sx, sy, sw, sh, 0, 0, W, H);
    gif.addFrame(c, { delay });
  }

  gif.on('progress', p => {
    flash(`Encoding… ${Math.round(p * 100)}%`, 'busy');
  });
  gif.on('finished', blob => {
    lastBlob = blob;
    outputGif.src = URL.createObjectURL(blob);
    outputRow.style.display = '';
    flash(`✓ Done — ${(blob.size / 1024).toFixed(1)} KB`, 'ok');
  });
  gif.render();
});

document.getElementById('dl-btn').addEventListener('click', () => {
  if (!lastBlob) return;
  const url = URL.createObjectURL(lastBlob);
  const a = document.createElement('a');
  a.href = url; a.download = `animation-${Date.now()}.gif`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg ' + cls;
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 3000);
}
