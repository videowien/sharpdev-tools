/**
 * WCAG 2.1 Contrast Checker.
 * Computes the contrast ratio between two colors using the relative luminance
 * formula defined in https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
const fgColor = document.getElementById('fg-color');
const bgColor = document.getElementById('bg-color');
const fgHex = document.getElementById('fg-hex');
const bgHex = document.getElementById('bg-hex');
const swapBtn = document.getElementById('swap-btn');
const ratioCard = document.getElementById('ratio-card');
const ratioValue = document.getElementById('ratio-value');
const preview = document.getElementById('preview');

const checks = {
  'aa-normal':  { el: document.getElementById('aa-normal'),  min: 4.5 },
  'aa-large':   { el: document.getElementById('aa-large'),   min: 3.0 },
  'aaa-normal': { el: document.getElementById('aaa-normal'), min: 7.0 },
  'aaa-large':  { el: document.getElementById('aaa-large'),  min: 4.5 },
};

function hexToRgb(hex) {
  hex = hex.replace('#', '').trim();
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}
function rgbToHex(r, g, b) {
  const h = n => n.toString(16).padStart(2, '0');
  return '#' + h(r) + h(g) + h(b);
}
function srgbToLinear(c) {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function luminance([r, g, b]) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}
function contrast(rgb1, rgb2) {
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function formatHex(v) {
  const rgb = hexToRgb(v);
  return rgb ? rgbToHex(...rgb) : null;
}

function update() {
  const fgRgb = hexToRgb(fgHex.value) || hexToRgb(fgColor.value);
  const bgRgb = hexToRgb(bgHex.value) || hexToRgb(bgColor.value);
  if (!fgRgb || !bgRgb) return;
  const ratio = contrast(fgRgb, bgRgb);
  ratioValue.textContent = ratio.toFixed(2);

  // Overall card colour
  ratioCard.classList.remove('good', 'ok', 'bad');
  if (ratio >= 7) ratioCard.classList.add('good');
  else if (ratio >= 4.5) ratioCard.classList.add('ok');
  else ratioCard.classList.add('bad');

  // Each WCAG check
  Object.values(checks).forEach(c => {
    const pass = ratio >= c.min;
    c.el.classList.toggle('pass', pass);
    c.el.classList.toggle('fail', !pass);
    c.el.querySelector('.wcag-verdict').textContent = pass ? '\u2713 Pass' : '\u2717 Fail';
  });

  // Preview
  const fgHexNow = rgbToHex(...fgRgb);
  const bgHexNow = rgbToHex(...bgRgb);
  preview.style.background = bgHexNow;
  preview.style.color = fgHexNow;
}

function syncFromPicker(picker, hexField) {
  hexField.value = picker.value.toUpperCase();
  update();
}
function syncFromHex(hexField, picker) {
  const v = formatHex(hexField.value);
  if (v) { picker.value = v; update(); }
}

fgColor.addEventListener('input', () => syncFromPicker(fgColor, fgHex));
bgColor.addEventListener('input', () => syncFromPicker(bgColor, bgHex));
fgHex.addEventListener('input', () => syncFromHex(fgHex, fgColor));
bgHex.addEventListener('input', () => syncFromHex(bgHex, bgColor));

swapBtn.addEventListener('click', () => {
  const t = fgHex.value; fgHex.value = bgHex.value; bgHex.value = t;
  const t2 = fgColor.value; fgColor.value = bgColor.value; bgColor.value = t2;
  update();
});

update();
