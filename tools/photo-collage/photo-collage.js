/**
 * Photo Collage Maker — 2-9 images into a grid
 */

const MAX = 9;
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const thumbsEl = document.getElementById('thumbs');
const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
const layoutEl = document.getElementById('layout');
const sizeEl = document.getElementById('size');
const gapEl = document.getElementById('gap');
const gapVal = document.getElementById('gap-val');
const bgEl = document.getElementById('bg');
const statusMsg = document.getElementById('status-msg');

let images = []; // { img, dataUrl, id }
let dragSrc = null;

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) addFiles(Array.from(fileInput.files)); fileInput.value = ''; });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) addFiles(Array.from(e.dataTransfer.files));
});

document.getElementById('reset-btn').addEventListener('click', () => {
  images = [];
  editorCard.style.display = 'none';
  fileInput.value = '';
});

async function addFiles(files) {
  const avail = MAX - images.length;
  const valid = files.filter(f => f.type.startsWith('image/')).slice(0, avail);
  for (const f of valid) {
    const dataUrl = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); });
    const img = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = dataUrl; });
    images.push({ img, dataUrl, id: Math.random().toString(36).slice(2) });
  }
  if (images.length > 0) editorCard.style.display = '';
  renderThumbs();
  render();
}

function renderThumbs() {
  thumbsEl.innerHTML = '';
  images.forEach((it, i) => {
    const t = document.createElement('div');
    t.className = 'thumb';
    t.draggable = true;
    t.innerHTML = `<img src="${it.dataUrl}" alt="thumb ${i + 1}"/><button class="x" type="button">×</button>`;
    t.addEventListener('dragstart', () => { dragSrc = i; t.classList.add('dragging'); });
    t.addEventListener('dragend', () => t.classList.remove('dragging'));
    t.addEventListener('dragover', (e) => e.preventDefault());
    t.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragSrc === null || dragSrc === i) return;
      const moved = images.splice(dragSrc, 1)[0];
      images.splice(i, 0, moved);
      dragSrc = null;
      renderThumbs(); render();
    });
    t.querySelector('.x').addEventListener('click', () => { images.splice(i, 1); renderThumbs(); render(); });
    thumbsEl.appendChild(t);
  });
}

function gridFor(n, mode) {
  if (mode === '1xN') return { cols: n, rows: 1 };
  if (mode === 'Nx1') return { cols: 1, rows: n };
  if (mode === '2col') return { cols: 2, rows: Math.ceil(n / 2) };
  // auto
  if (n === 1) return { cols: 1, rows: 1 };
  if (n === 2) return { cols: 2, rows: 1 };
  if (n <= 4) return { cols: 2, rows: 2 };
  if (n <= 6) return { cols: 3, rows: 2 };
  return { cols: 3, rows: 3 };
}

function targetSize() {
  const v = sizeEl.value;
  if (v.includes('x')) { const [w, h] = v.split('x').map(Number); return { w, h }; }
  const s = parseInt(v, 10); return { w: s, h: s };
}

function render() {
  if (images.length === 0) return;
  const { w: TW, h: TH } = targetSize();
  const gap = parseInt(gapEl.value, 10);
  gapVal.textContent = gap + ' px';
  const { cols, rows } = gridFor(images.length, layoutEl.value);

  canvas.width = TW; canvas.height = TH;
  ctx.fillStyle = bgEl.value;
  ctx.fillRect(0, 0, TW, TH);

  const cellW = (TW - gap * (cols + 1)) / cols;
  const cellH = (TH - gap * (rows + 1)) / rows;

  images.forEach((item, idx) => {
    if (idx >= cols * rows) return;
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    const x = gap + c * (cellW + gap);
    const y = gap + r * (cellH + gap);
    drawCover(item.img, x, y, cellW, cellH);
  });
}

// Draw image scaled+cropped to fill (x,y,w,h)
function drawCover(img, x, y, w, h) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const targetRatio = w / h;
  const imgRatio = iw / ih;
  let sx, sy, sw, sh;
  if (imgRatio > targetRatio) {
    // Image wider — crop sides
    sh = ih; sw = ih * targetRatio;
    sx = (iw - sw) / 2; sy = 0;
  } else {
    sw = iw; sh = iw / targetRatio;
    sx = 0; sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

[layoutEl, sizeEl, gapEl, bgEl].forEach(el => {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
});

document.getElementById('dl-png').addEventListener('click', () => download('image/png', 'png'));
document.getElementById('dl-jpg').addEventListener('click', () => download('image/jpeg', 'jpg', 0.95));

function download(mime, ext, quality) {
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `collage-${Date.now()}.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = `✓ Saved ${ext.toUpperCase()}`;
    statusMsg.className = 'status-msg ok';
    setTimeout(() => { statusMsg.textContent = ''; }, 1800);
  }, mime, quality);
}
