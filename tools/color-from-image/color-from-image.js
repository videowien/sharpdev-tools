/**
 * Color Palette from Image — median-cut quantization
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const resultCard = document.getElementById('result-card');
const preview = document.getElementById('preview');
const countEl = document.getElementById('count');
const palette = document.getElementById('palette');
const statusMsg = document.getElementById('status-msg');

let img = null;
let format = 'hex';
let lastColors = [];

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.querySelectorAll('[data-fmt]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-fmt]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    format = btn.dataset.fmt;
    renderPalette();
  });
});
countEl.addEventListener('change', () => { if (img) extract(); });

document.getElementById('reset-btn').addEventListener('click', () => {
  img = null; lastColors = [];
  resultCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.type.startsWith('image/')) { flash('Please pick an image.', 'busy'); return; }
  const dataUrl = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
  img = new Image();
  img.onload = () => {
    preview.src = dataUrl;
    resultCard.style.display = '';
    extract();
  };
  img.src = dataUrl;
}

function extract() {
  flash('Analysing colors…', 'busy');
  // Sample image into canvas at reduced size
  const maxDim = 200;
  const ratio = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(20, Math.floor(img.naturalWidth * ratio));
  const h = Math.max(20, Math.floor(img.naturalHeight * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pixels = [];
  // Sample every 2nd pixel to keep array small for large images
  for (let i = 0; i < data.length; i += 8) {
    const a = data[i + 3];
    if (a < 128) continue;
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }
  const n = parseInt(countEl.value, 10);
  const buckets = medianCut(pixels, n);
  lastColors = buckets.map(bucket => {
    const avg = avgColor(bucket);
    return { rgb: avg, count: bucket.length };
  });
  // Sort by frequency (largest bucket first)
  lastColors.sort((a, b) => b.count - a.count);
  renderPalette();
  flash('', '');
}

function avgColor(pixels) {
  let r = 0, g = 0, b = 0;
  for (const p of pixels) { r += p[0]; g += p[1]; b += p[2]; }
  const n = pixels.length || 1;
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

function medianCut(pixels, targetBuckets) {
  let buckets = [pixels];
  while (buckets.length < targetBuckets) {
    // Find bucket with largest range
    let maxRange = -1, maxIdx = -1, splitChannel = 0;
    for (let i = 0; i < buckets.length; i++) {
      const b = buckets[i];
      if (b.length < 2) continue;
      const ranges = [0, 1, 2].map(ch => {
        let lo = 255, hi = 0;
        for (const p of b) { lo = Math.min(lo, p[ch]); hi = Math.max(hi, p[ch]); }
        return hi - lo;
      });
      const localMax = Math.max(...ranges);
      if (localMax > maxRange) {
        maxRange = localMax;
        maxIdx = i;
        splitChannel = ranges.indexOf(localMax);
      }
    }
    if (maxIdx < 0) break;
    const bucket = buckets[maxIdx];
    bucket.sort((a, b) => a[splitChannel] - b[splitChannel]);
    const mid = Math.floor(bucket.length / 2);
    buckets.splice(maxIdx, 1, bucket.slice(0, mid), bucket.slice(mid));
  }
  return buckets;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function formatColor(rgb) {
  if (format === 'hex') return rgbToHex(...rgb);
  if (format === 'rgb') return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const hsl = rgbToHsl(...rgb);
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
}

function renderPalette() {
  palette.innerHTML = '';
  const total = lastColors.reduce((s, c) => s + c.count, 0);
  for (const c of lastColors) {
    const hex = rgbToHex(...c.rgb);
    const val = formatColor(c.rgb);
    const pct = total ? (c.count / total * 100).toFixed(0) : '0';
    const luminance = 0.299 * c.rgb[0] + 0.587 * c.rgb[1] + 0.114 * c.rgb[2];
    const textColor = luminance > 140 ? '#111' : '#fff';
    const div = document.createElement('div');
    div.className = 'sw';
    div.style.background = hex;
    div.style.color = textColor;
    div.innerHTML = `<span class="sw-val">${val}</span><span class="sw-pct">${pct}%</span>`;
    div.addEventListener('click', async () => {
      await navigator.clipboard.writeText(val);
      div.classList.add('copied');
      setTimeout(() => div.classList.remove('copied'), 1000);
    });
    palette.appendChild(div);
  }
}

document.getElementById('copy-css').addEventListener('click', async () => {
  const lines = lastColors.map((c, i) => `  --color-${i + 1}: ${formatColor(c.rgb)};`).join('\n');
  await navigator.clipboard.writeText(`:root {\n${lines}\n}`);
  flash('✓ CSS variables copied', 'ok');
});
document.getElementById('copy-list').addEventListener('click', async () => {
  const lines = lastColors.map(c => formatColor(c.rgb)).join('\n');
  await navigator.clipboard.writeText(lines);
  flash('✓ List copied', 'ok');
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg ' + (cls || '');
  if (cls === 'ok') setTimeout(() => { statusMsg.textContent = ''; }, 1800);
}
