/**
 * Color Palette Extractor — SharpDev Tools
 * 100% browser-side. Uses k-means clustering on image pixel data.
 * No external libraries needed.
 */

const API_BASE = '/api';

const uploadArea = document.getElementById('upload-area');
const uploadContent = document.getElementById('upload-content');
const uploadPreview = document.getElementById('upload-preview');
const fileInput = document.getElementById('file-input');
const urlInput = document.getElementById('url-input');
const paletteArea = document.getElementById('palette-area');
const colorCards = document.getElementById('color-cards');
const pickedColorEl = document.getElementById('picked-color');
const pickedSwatch = document.getElementById('picked-swatch');
const pickedValues = document.getElementById('picked-values');

let imageCanvas = null; // hidden canvas with image data for eyedropper
let imageCtx = null;
let currentColors = [];

// ---- File upload / drag-drop ----

uploadArea.addEventListener('click', (e) => {
  if (!uploadArea.classList.contains('has-image')) {
    fileInput.click();
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) loadFile(fileInput.files[0]);
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

// Enter key on URL input
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loadFromUrl();
});

function loadFile(file) {
  if (!file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (e) => processImage(e.target.result);
  reader.readAsDataURL(file);
}

async function loadFromUrl() {
  const rawUrl = urlInput.value.trim();
  if (!rawUrl) return;
  let url = rawUrl;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  document.getElementById('url-btn').disabled = true;
  try {
    const resp = await fetch(`${API_BASE}/fetch?url=${encodeURIComponent(url)}`);
    if (!resp.ok) throw new Error('Failed to load image');
    const blob = await resp.blob();
    if (!blob.type.startsWith('image/')) throw new Error('URL is not an image');
    const objectUrl = URL.createObjectURL(blob);
    processImage(objectUrl);
  } catch (e) {
    alert(e.message || 'Failed to load image from URL');
  } finally {
    document.getElementById('url-btn').disabled = false;
  }
}

function processImage(src) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    // Show preview, hide URL row, show reset
    uploadPreview.src = src;
    uploadPreview.style.display = 'block';
    uploadContent.style.display = 'none';
    uploadArea.classList.add('has-image');
    document.getElementById('url-row').style.display = 'none';
    document.getElementById('reset-row').style.display = 'block';

    // Create hidden canvas for pixel sampling
    imageCanvas = document.createElement('canvas');
    imageCtx = imageCanvas.getContext('2d', { willReadFrequently: true });

    // Scale down for faster processing (max 200px wide)
    const scale = Math.min(1, 200 / img.naturalWidth);
    imageCanvas.width = Math.floor(img.naturalWidth * scale);
    imageCanvas.height = Math.floor(img.naturalHeight * scale);
    imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);

    // Also create full-res canvas for eyedropper
    window._fullCanvas = document.createElement('canvas');
    const fullCtx = window._fullCanvas.getContext('2d', { willReadFrequently: true });
    // Cap at 800px for eyedropper (good enough precision, saves memory)
    const fullScale = Math.min(1, 800 / img.naturalWidth);
    window._fullCanvas.width = Math.floor(img.naturalWidth * fullScale);
    window._fullCanvas.height = Math.floor(img.naturalHeight * fullScale);
    fullCtx.drawImage(img, 0, 0, window._fullCanvas.width, window._fullCanvas.height);

    extractPalette();
  };
  img.src = src;
}

// ---- Eyedropper (click on image) ----

uploadArea.addEventListener('click', (e) => {
  if (!uploadArea.classList.contains('has-image') || !window._fullCanvas) return;

  const rect = uploadPreview.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Map click position to canvas coordinates
  const scaleX = window._fullCanvas.width / rect.width;
  const scaleY = window._fullCanvas.height / rect.height;
  const canvasX = Math.floor(x * scaleX);
  const canvasY = Math.floor(y * scaleY);

  const ctx = window._fullCanvas.getContext('2d', { willReadFrequently: true });
  const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
  const r = pixel[0], g = pixel[1], b = pixel[2];

  showPickedColor(r, g, b);
});

function showPickedColor(r, g, b) {
  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);

  pickedSwatch.style.background = hex;
  pickedValues.innerHTML =
    `<div><span class="val-label">HEX </span><span class="val-data" onclick="copyVal(this)">${hex}</span></div>` +
    `<div><span class="val-label">RGB </span><span class="val-data" onclick="copyVal(this)">rgb(${r}, ${g}, ${b})</span></div>` +
    `<div><span class="val-label">HSL </span><span class="val-data" onclick="copyVal(this)">${hsl}</span></div>`;
  pickedColorEl.style.display = 'flex';
}

// ---- K-Means Color Extraction ----

function extractPalette() {
  const count = parseInt(document.getElementById('color-count').value);
  const imageData = imageCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
  const pixels = imageData.data;

  // Sample pixels (skip transparent, sample every Nth pixel for speed)
  const samples = [];
  const step = Math.max(1, Math.floor(pixels.length / 4 / 5000)); // ~5000 samples max
  for (let i = 0; i < pixels.length; i += 4 * step) {
    const a = pixels[i + 3];
    if (a < 128) continue; // skip transparent
    samples.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
  }

  if (samples.length < count) {
    paletteArea.style.display = 'none';
    return;
  }

  // K-means clustering
  currentColors = kMeans(samples, count, 20);

  // Sort by luminance (dark to light)
  currentColors.sort((a, b) => luminance(a) - luminance(b));

  renderPalette();
  paletteArea.style.display = 'block';
}

function reExtract() {
  if (!imageCanvas) return;
  extractPalette();
}

function kMeans(pixels, k, maxIter) {
  // Initialize centroids with k-means++ for better results
  const centroids = [pixels[Math.floor(Math.random() * pixels.length)].slice()];

  for (let i = 1; i < k; i++) {
    const distances = pixels.map(p => {
      const minDist = Math.min(...centroids.map(c => colorDist(p, c)));
      return minDist;
    });
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalDist;
    for (let j = 0; j < distances.length; j++) {
      r -= distances[j];
      if (r <= 0) { centroids.push(pixels[j].slice()); break; }
    }
    if (centroids.length <= i) centroids.push(pixels[Math.floor(Math.random() * pixels.length)].slice());
  }

  // Iterate
  let assignments = new Array(pixels.length);

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;

    // Assign pixels to nearest centroid
    for (let i = 0; i < pixels.length; i++) {
      let minDist = Infinity, minIdx = 0;
      for (let j = 0; j < k; j++) {
        const d = colorDist(pixels[i], centroids[j]);
        if (d < minDist) { minDist = d; minIdx = j; }
      }
      if (assignments[i] !== minIdx) { assignments[i] = minIdx; changed = true; }
    }

    if (!changed) break;

    // Recalculate centroids
    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = new Array(k).fill(0);

    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      sums[c][0] += pixels[i][0];
      sums[c][1] += pixels[i][1];
      sums[c][2] += pixels[i][2];
      counts[c]++;
    }

    for (let j = 0; j < k; j++) {
      if (counts[j] > 0) {
        centroids[j] = [
          Math.round(sums[j][0] / counts[j]),
          Math.round(sums[j][1] / counts[j]),
          Math.round(sums[j][2] / counts[j]),
        ];
      }
    }
  }

  return centroids;
}

function colorDist(a, b) {
  const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function luminance(rgb) {
  return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
}

// ---- Rendering ----

function renderPalette() {
  colorCards.innerHTML = '';
  for (const color of currentColors) {
    const [r, g, b] = color;
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);

    const card = document.createElement('div');
    card.className = 'color-card';
    card.innerHTML = `
      <div class="color-swatch" style="background:${hex}"></div>
      <div class="color-info">
        <div class="color-hex">${hex}</div>
        <div class="color-rgb">rgb(${r}, ${g}, ${b})</div>
        <div class="color-hsl">${hsl}</div>
        <div class="color-copied">Copied!</div>
      </div>`;
    card.onclick = () => {
      copyToClipboard(hex);
      const copied = card.querySelector('.color-copied');
      copied.style.display = 'block';
      setTimeout(() => { copied.style.display = 'none'; }, 1500);
    };
    colorCards.appendChild(card);
  }
}

// ---- Color conversion helpers ----

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

// ---- Clipboard ----

function copyToClipboard(text, el) {
  navigator.clipboard.writeText(text).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

function resetTool() {
  uploadPreview.style.display = 'none';
  uploadPreview.src = '';
  uploadContent.style.display = 'block';
  uploadArea.classList.remove('has-image');
  document.getElementById('url-row').style.display = 'block';
  document.getElementById('reset-row').style.display = 'none';
  paletteArea.style.display = 'none';
  pickedColorEl.style.display = 'none';
  colorCards.innerHTML = '';
  imageCanvas = null;
  imageCtx = null;
  window._fullCanvas = null;
  currentColors = [];
  fileInput.value = '';
  urlInput.value = '';
}

function copyVal(el) {
  copyToClipboard(el.textContent);
  const original = el.textContent;
  el.textContent = 'Copied!';
  el.style.color = '#4caf50';
  setTimeout(() => { el.textContent = original; el.style.color = ''; }, 1200);
}
