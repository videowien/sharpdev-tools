/**
 * Color Shades — Tailwind-style 50-900 palette from a base color
 */

const STEPS = [
  { name: 50,  light: 0.95 },
  { name: 100, light: 0.90 },
  { name: 200, light: 0.80 },
  { name: 300, light: 0.70 },
  { name: 400, light: 0.60 },
  { name: 500, light: null }, // base color
  { name: 600, light: 0.42 },
  { name: 700, light: 0.34 },
  { name: 800, light: 0.26 },
  { name: 900, light: 0.18 },
  { name: 950, light: 0.10 },
];

const pickerEl = document.getElementById('color-picker');
const hexEl = document.getElementById('hex-input');
const nameEl = document.getElementById('name');
const paletteEl = document.getElementById('palette');
const statusMsg = document.getElementById('status-msg');
let format = 'hex';
let baseHex = '#ff4444';
let lastPalette = [];

pickerEl.addEventListener('input', () => {
  baseHex = pickerEl.value;
  hexEl.value = baseHex.toUpperCase();
  render();
});
hexEl.addEventListener('input', () => {
  const v = hexEl.value.trim();
  if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
    baseHex = v.startsWith('#') ? v : '#' + v;
    pickerEl.value = baseHex;
    render();
  }
});
nameEl.addEventListener('input', () => {/* re-render not strictly needed; just used for copy */});

document.querySelectorAll('[data-fmt]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-fmt]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    format = btn.dataset.fmt;
    render();
  });
});

function hexToRgb(h) {
  const m = h.replace('#', '').match(/^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
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
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
}
function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;
  return {
    r: hue2rgb(p, q, hk + 1/3) * 255,
    g: hue2rgb(p, q, hk) * 255,
    b: hue2rgb(p, q, hk - 1/3) * 255,
  };
}

function formatColor(rgb) {
  if (format === 'hex') return rgbToHex(rgb.r, rgb.g, rgb.b);
  if (format === 'rgb') return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return `hsl(${Math.round(hsl.h)}, ${(hsl.s * 100).toFixed(0)}%, ${(hsl.l * 100).toFixed(0)}%)`;
}

function render() {
  const baseRgb = hexToRgb(baseHex);
  const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
  lastPalette = STEPS.map(step => {
    if (step.light === null) {
      return { step: step.name, rgb: baseRgb };
    }
    const rgb = hslToRgb(baseHsl.h, baseHsl.s, step.light);
    return { step: step.name, rgb };
  });
  paletteEl.innerHTML = '';
  for (const item of lastPalette) {
    const isBase = item.step === 500;
    const colorStr = formatColor(item.rgb);
    const luminance = (0.299 * item.rgb.r + 0.587 * item.rgb.g + 0.114 * item.rgb.b);
    const textColor = luminance > 140 ? '#111' : '#fff';
    const div = document.createElement('div');
    div.className = 'swatch' + (isBase ? ' base' : '');
    div.style.background = rgbToHex(item.rgb.r, item.rgb.g, item.rgb.b);
    div.style.color = textColor;
    div.innerHTML = `<span class="swatch-step">${item.step}</span><span class="swatch-val">${colorStr}</span>`;
    div.addEventListener('click', async () => {
      await navigator.clipboard.writeText(colorStr);
      div.classList.add('copied');
      setTimeout(() => div.classList.remove('copied'), 1000);
    });
    paletteEl.appendChild(div);
  }
}

document.getElementById('copy-css').addEventListener('click', async () => {
  const n = (nameEl.value || 'brand').toLowerCase().replace(/\s+/g, '-');
  const lines = lastPalette.map(p => `  --${n}-${p.step}: ${formatColor(p.rgb)};`).join('\n');
  await navigator.clipboard.writeText(`:root {\n${lines}\n}`);
  flash('✓ CSS variables copied');
});

document.getElementById('copy-tailwind').addEventListener('click', async () => {
  const n = (nameEl.value || 'brand').toLowerCase().replace(/\s+/g, '');
  const lines = lastPalette.map(p => `        ${p.step}: '${rgbToHex(p.rgb.r, p.rgb.g, p.rgb.b)}',`).join('\n');
  await navigator.clipboard.writeText(`// tailwind.config.js\ntheme: { extend: { colors: { ${n}: {\n${lines}\n} } } }`);
  flash('✓ Tailwind config copied');
});

document.getElementById('copy-json').addEventListener('click', async () => {
  const obj = {};
  lastPalette.forEach(p => obj[p.step] = rgbToHex(p.rgb.r, p.rgb.g, p.rgb.b));
  await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
  flash('✓ JSON copied');
});

function flash(msg) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
}

render();
