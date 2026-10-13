/**
 * Image Color Picker — SharpDev Tools
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const pickerGrid = document.getElementById('picker-grid');
const canvas = document.getElementById('canvas');
const hoverInfo = document.getElementById('hover-info');
const currentSwatch = document.getElementById('current-swatch');
const cvHex = document.getElementById('cv-hex');
const cvRgb = document.getElementById('cv-rgb');
const cvHsl = document.getElementById('cv-hsl');
const palette = document.getElementById('palette');
const clearPaletteBtn = document.getElementById('clear-palette');

const ctx = canvas.getContext('2d', { willReadFrequently: true });
let paletteColors = [];

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
  const img = new Image();
  img.onload = () => {
    // Fit canvas to image but cap at reasonable display size (max 1000 wide)
    const maxW = 1000;
    const scale = Math.min(1, maxW / img.naturalWidth);
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    pickerGrid.style.display = 'grid';
  };
  img.src = dataUrl;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function pixelAt(x, y) {
  const data = ctx.getImageData(x, y, 1, 1).data;
  return { r: data[0], g: data[1], b: data[2], a: data[3] };
}

function showColor(r, g, b) {
  const hex = rgbToHex(r, g, b);
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const [hh, ss, ll] = rgbToHsl(r, g, b);
  const hsl = `hsl(${hh}, ${ss}%, ${ll}%)`;
  currentSwatch.style.background = hex;
  cvHex.textContent = hex;
  cvRgb.textContent = rgb;
  cvHsl.textContent = hsl;
  return hex;
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
  const { r, g, b } = pixelAt(x, y);
  showColor(r, g, b);
  hoverInfo.textContent = `Click to add to palette · pixel (${x}, ${y})`;
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
  const { r, g, b } = pixelAt(x, y);
  const hex = showColor(r, g, b);
  if (!paletteColors.includes(hex)) {
    paletteColors.push(hex);
    renderPalette();
  }
});

function renderPalette() {
  palette.innerHTML = '';
  paletteColors.forEach((hex) => {
    const sw = document.createElement('div');
    sw.className = 'pal-swatch';
    sw.style.background = hex;
    sw.title = hex;
    sw.addEventListener('click', async () => {
      await navigator.clipboard.writeText(hex);
      sw.classList.add('copied');
      setTimeout(() => sw.classList.remove('copied'), 800);
    });
    palette.appendChild(sw);
  });
}

clearPaletteBtn.addEventListener('click', () => {
  paletteColors = [];
  renderPalette();
});

document.querySelectorAll('.cv-copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target || target.textContent === '—') return;
    await navigator.clipboard.writeText(target.textContent);
    btn.textContent = '✓';
    setTimeout(() => { btn.textContent = '⧉'; }, 800);
  });
});
