/**
 * Glassmorphism Generator — live preview with tunable backdrop-filter card.
 */
const stage = document.getElementById('gl-stage');
const card = document.getElementById('gl-card');
const controls = document.getElementById('gl-controls');
const bgButtons = document.querySelectorAll('.gl-bg-btn[data-bg]');
const uploadBtn = document.getElementById('upload-bg');
const fileInp = document.getElementById('gl-file');
const codeOut = document.getElementById('code-out');
const copyBtn = document.getElementById('copy-btn');

const state = {
  blur: 14,
  tintAlpha: 20,
  tint: '#ffffff',
  borderAlpha: 30,
  borderColor: '#ffffff',
  borderWidth: 1,
  radius: 18,
  shadow: 15,
};

const SLIDERS = [
  { key: 'blur',         label: 'Blur',         min: 0, max: 40,  unit: 'px' },
  { key: 'tintAlpha',    label: 'Tint alpha',   min: 0, max: 100, unit: '%' },
  { key: 'borderAlpha',  label: 'Border alpha', min: 0, max: 100, unit: '%' },
  { key: 'borderWidth',  label: 'Border width', min: 0, max: 4,   unit: 'px' },
  { key: 'radius',       label: 'Radius',       min: 0, max: 60,  unit: 'px' },
  { key: 'shadow',       label: 'Shadow',       min: 0, max: 60,  unit: 'px' },
];

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
}

function renderControls() {
  controls.innerHTML = '';
  SLIDERS.forEach(s => {
    const row = document.createElement('div');
    row.className = 'gl-slider';
    row.innerHTML = `
      <label>${s.label}</label>
      <input type="range" min="${s.min}" max="${s.max}" value="${state[s.key]}">
      <span class="val">${state[s.key]}${s.unit}</span>`;
    const inp = row.querySelector('input');
    const val = row.querySelector('.val');
    inp.addEventListener('input', () => {
      state[s.key] = parseInt(inp.value, 10);
      val.textContent = `${state[s.key]}${s.unit}`;
      update();
    });
    controls.appendChild(row);
  });

  // Color rows
  addColorRow('Tint color', 'tint');
  addColorRow('Border color', 'borderColor');
}

function addColorRow(label, key) {
  const row = document.createElement('div');
  row.className = 'gl-color-row';
  row.innerHTML = `
    <label>${label}</label>
    <input type="color" value="${state[key]}">
    <input type="text" value="${state[key]}" maxlength="7" spellcheck="false">`;
  const [, pick, hex] = row.children;
  pick.addEventListener('input', () => { state[key] = pick.value; hex.value = pick.value; update(); });
  hex.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/.test(hex.value)) { state[key] = hex.value; pick.value = hex.value; update(); }
  });
  controls.appendChild(row);
}

function update() {
  const tintColor = hexToRgba(state.tint, state.tintAlpha);
  const borderColor = hexToRgba(state.borderColor, state.borderAlpha);
  card.style.background = tintColor;
  card.style.backdropFilter = `blur(${state.blur}px)`;
  card.style.webkitBackdropFilter = `blur(${state.blur}px)`;
  card.style.border = `${state.borderWidth}px solid ${borderColor}`;
  card.style.borderRadius = `${state.radius}px`;
  card.style.boxShadow = `0 ${Math.round(state.shadow / 2)}px ${state.shadow * 2}px rgba(0,0,0,0.25)`;

  const css = `background: ${tintColor};
backdrop-filter: blur(${state.blur}px);
-webkit-backdrop-filter: blur(${state.blur}px);
border: ${state.borderWidth}px solid ${borderColor};
border-radius: ${state.radius}px;
box-shadow: 0 ${Math.round(state.shadow / 2)}px ${state.shadow * 2}px rgba(0, 0, 0, 0.25);`;
  codeOut.textContent = css;
}

bgButtons.forEach(b => b.addEventListener('click', () => {
  stage.className = 'gl-stage ' + b.dataset.bg;
  stage.style.backgroundImage = '';
  bgButtons.forEach(x => x.classList.remove('active'));
  uploadBtn.classList.remove('active');
  b.classList.add('active');
}));

uploadBtn.addEventListener('click', () => fileInp.click());
fileInp.addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  stage.className = 'gl-stage custom';
  stage.style.backgroundImage = `url("${url}")`;
  bgButtons.forEach(x => x.classList.remove('active'));
  uploadBtn.classList.add('active');
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
