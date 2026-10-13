/**
 * Aspect Ratio Calculator — SharpDev Tools
 */

const rw = document.getElementById('ratio-w');
const rh = document.getElementById('ratio-h');
const widthEl = document.getElementById('width');
const heightEl = document.getElementById('height');
const previewBox = document.getElementById('preview-box');
const previewText = document.getElementById('preview-text');
const previewInfo = document.getElementById('preview-info');
const simplified = document.getElementById('simplified');

function gcd(a, b) {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function currentRatio() {
  const w = parseFloat(rw.value) || 0;
  const h = parseFloat(rh.value) || 0;
  return (w > 0 && h > 0) ? (w / h) : 0;
}

function onRatioChange() {
  const ratio = currentRatio();
  if (!ratio) { updatePreview(); return; }
  // Keep width, recalc height
  const w = parseFloat(widthEl.value);
  if (w > 0) heightEl.value = Math.round(w / ratio);
  updatePreview();
}

function onWidthChange() {
  const ratio = currentRatio();
  const w = parseFloat(widthEl.value);
  if (!ratio || !(w > 0)) { updatePreview(); return; }
  heightEl.value = Math.round(w / ratio);
  updatePreview();
}

function onHeightChange() {
  const ratio = currentRatio();
  const h = parseFloat(heightEl.value);
  if (!ratio || !(h > 0)) { updatePreview(); return; }
  widthEl.value = Math.round(h * ratio);
  updatePreview();
}

function setPreset(w, h, pxW, pxH) {
  rw.value = w; rh.value = h;
  widthEl.value = pxW; heightEl.value = pxH;
  updatePreview();
}

function updatePreview() {
  const w = parseFloat(widthEl.value);
  const h = parseFloat(heightEl.value);
  const ratio = currentRatio();

  if (!(w > 0) || !(h > 0) || !ratio) {
    previewInfo.textContent = '—';
    return;
  }

  // Fit preview within the stage (max 380x240)
  const maxW = 380, maxH = 240;
  let boxW, boxH;
  if (ratio >= 1) {
    boxW = maxW;
    boxH = boxW / ratio;
    if (boxH > maxH) { boxH = maxH; boxW = boxH * ratio; }
  } else {
    boxH = maxH;
    boxW = boxH * ratio;
    if (boxW > maxW) { boxW = maxW; boxH = boxW / ratio; }
  }
  previewBox.style.width = boxW + 'px';
  previewBox.style.height = boxH + 'px';

  const rW = parseFloat(rw.value) || 0;
  const rH = parseFloat(rh.value) || 0;
  previewText.textContent = `${rW}:${rH}`;

  // Simplified ratio of actual dimensions
  const g = gcd(w, h);
  const sW = Math.round(w / g), sH = Math.round(h / g);
  simplified.innerHTML = `Simplified from dimensions: <strong style="color:#ccc">${sW}:${sH}</strong>`;

  const mp = ((w * h) / 1_000_000).toFixed(1);
  previewInfo.textContent = `${w} × ${h} px  •  ${mp} MP  •  ratio ${ratio.toFixed(3)}`;
}

updatePreview();
