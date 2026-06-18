/**
 * Placeholder Image Generator — solid-color PNG/JPG with dimension label
 */

const widthEl = document.getElementById('width');
const heightEl = document.getElementById('height');
const bgEl = document.getElementById('bg');
const fgEl = document.getElementById('fg');
const labelEl = document.getElementById('label');
const canvas = document.getElementById('placeholder-canvas');
const ctx = canvas.getContext('2d');
const statusMsg = document.getElementById('status-msg');

function render() {
  const w = clamp(parseInt(widthEl.value, 10) || 800, 16, 4096);
  const h = clamp(parseInt(heightEl.value, 10) || 450, 16, 4096);
  canvas.width = w;
  canvas.height = h;
  ctx.fillStyle = bgEl.value;
  ctx.fillRect(0, 0, w, h);
  const label = (labelEl.value && labelEl.value.trim()) || `${w} × ${h}`;
  // Font scales with the shorter dimension
  const fontSize = Math.max(16, Math.min(w, h) / 8);
  ctx.fillStyle = fgEl.value;
  ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, w / 2, h / 2);
}

function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

function downloadAt(mime, ext) {
  render();
  canvas.toBlob((blob) => {
    if (!blob) return;
    const w = canvas.width, h = canvas.height;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placeholder-${w}x${h}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = `✓ Saved ${w}×${h} ${ext.toUpperCase()}`;
    statusMsg.className = 'status-msg ok';
    setTimeout(() => { statusMsg.textContent = ''; }, 1800);
  }, mime, mime === 'image/jpeg' ? 0.95 : undefined);
}

[widthEl, heightEl, bgEl, fgEl, labelEl].forEach(el => el.addEventListener('input', render));
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    widthEl.value = btn.dataset.w;
    heightEl.value = btn.dataset.h;
    render();
  });
});
document.getElementById('dl-png').addEventListener('click', () => downloadAt('image/png', 'png'));
document.getElementById('dl-jpg').addEventListener('click', () => downloadAt('image/jpeg', 'jpg'));

render();
