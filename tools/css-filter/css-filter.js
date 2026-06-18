/**
 * CSS Filter Playground — live filter stacking on user-provided image.
 */
const SAMPLE = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff6b8a"/>
      <stop offset="55%" stop-color="#ffa04a"/>
      <stop offset="100%" stop-color="#ffd36b"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#sky)"/>
  <circle cx="500" cy="120" r="50" fill="#fff5c3" opacity="0.9"/>
  <polygon points="0,280 120,180 220,240 340,150 460,230 640,130 640,360 0,360" fill="#4a2d5a"/>
  <polygon points="0,320 180,240 320,290 480,220 640,280 640,360 0,360" fill="#2d1e3a"/>
  <text x="320" y="340" font-family="-apple-system, sans-serif" font-size="14" font-weight="500" fill="#fff" text-anchor="middle" opacity="0.7">Sample image — drop your own to replace</text>
</svg>`);

const FILTERS = [
  { key: 'blur',        label: 'Blur',        unit: 'px',  min: 0,    max: 40,   def: 0,   fmt: v => `blur(${v}px)` },
  { key: 'brightness',  label: 'Brightness',  unit: '%',   min: 0,    max: 300,  def: 100, fmt: v => `brightness(${v}%)` },
  { key: 'contrast',    label: 'Contrast',    unit: '%',   min: 0,    max: 300,  def: 100, fmt: v => `contrast(${v}%)` },
  { key: 'grayscale',   label: 'Grayscale',   unit: '%',   min: 0,    max: 100,  def: 0,   fmt: v => `grayscale(${v}%)` },
  { key: 'hue-rotate',  label: 'Hue rotate',  unit: 'deg', min: 0,    max: 360,  def: 0,   fmt: v => `hue-rotate(${v}deg)` },
  { key: 'invert',      label: 'Invert',      unit: '%',   min: 0,    max: 100,  def: 0,   fmt: v => `invert(${v}%)` },
  { key: 'saturate',    label: 'Saturate',    unit: '%',   min: 0,    max: 300,  def: 100, fmt: v => `saturate(${v}%)` },
  { key: 'sepia',       label: 'Sepia',       unit: '%',   min: 0,    max: 100,  def: 0,   fmt: v => `sepia(${v}%)` },
];

const dz = document.getElementById('cf-dropzone');
const fileEl = document.getElementById('cf-file');
const imgEl = document.getElementById('cf-image');
const ctrl = document.getElementById('cf-controls');
const resetBtn = document.getElementById('reset-btn');
const codeOut = document.getElementById('code-out');
const copyBtn = document.getElementById('copy-btn');

const state = {};
FILTERS.forEach(f => state[f.key] = f.def);

imgEl.src = SAMPLE;

function renderControls() {
  ctrl.innerHTML = '';
  FILTERS.forEach(f => {
    const row = document.createElement('div');
    row.className = 'cf-slider';
    row.innerHTML = `
      <label>${f.label}</label>
      <input type="range" min="${f.min}" max="${f.max}" value="${state[f.key]}">
      <span class="val">${state[f.key]}${f.unit}</span>`;
    const inp = row.querySelector('input');
    const val = row.querySelector('.val');
    inp.addEventListener('input', () => {
      state[f.key] = parseInt(inp.value, 10);
      val.textContent = `${state[f.key]}${f.unit}`;
      update();
    });
    ctrl.appendChild(row);
  });
}

function buildFilter() {
  // Only include filters that differ from default (keeps rule compact)
  const parts = FILTERS
    .filter(f => state[f.key] !== f.def)
    .map(f => f.fmt(state[f.key]));
  return parts.length ? parts.join(' ') : 'none';
}

function update() {
  const filter = buildFilter();
  imgEl.style.filter = filter === 'none' ? '' : filter;
  codeOut.textContent = `filter: ${filter};`;
}

function onFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const url = URL.createObjectURL(file);
  imgEl.src = url;
}

dz.addEventListener('click', () => fileEl.click());
fileEl.addEventListener('change', e => { if (e.target.files[0]) onFile(e.target.files[0]); });
['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('dragging'); }));
['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('dragging'); }));
dz.addEventListener('drop', e => { if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); });

resetBtn.addEventListener('click', () => {
  FILTERS.forEach(f => state[f.key] = f.def);
  renderControls(); update();
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(codeOut.textContent);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

renderControls();
update();
