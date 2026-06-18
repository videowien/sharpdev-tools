/**
 * Instagram Highlight Cover Maker — SharpDev Tools
 * Renders a 1080×1920 canvas with solid color + centered icon/emoji.
 */

const emojiEl = document.getElementById('emoji');
const bgColorEl = document.getElementById('bg-color');
const bgHexEl = document.getElementById('bg-hex');
const iconSizeEl = document.getElementById('icon-size');
const iconSizeValEl = document.getElementById('icon-size-val');
const roundPreviewEl = document.getElementById('round-preview');
const downloadBtn = document.getElementById('download-btn');
const statusMsg = document.getElementById('status-msg');
const canvas = document.getElementById('cover-canvas');
const circleOverlay = document.getElementById('circle-overlay');
const presetBtns = document.querySelectorAll('.preset-color');

const ctx = canvas.getContext('2d');

// Pick black or white text based on background luminance (WCAG-ish).
function readableTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Relative luminance (approximation, good enough here)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#222222' : '#ffffff';
}

function render() {
  const bg = bgHexEl.value.match(/^#[0-9a-fA-F]{6}$/) ? bgHexEl.value : '#1a1a1a';
  const icon = emojiEl.value || '📷';
  const iconPercent = parseInt(iconSizeEl.value, 10);
  iconSizeValEl.textContent = iconPercent;

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  // Icon centered
  const iconColor = readableTextColor(bg);
  const fontSize = Math.round(1080 * (iconPercent / 100));
  ctx.font = `bold ${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", -apple-system, sans-serif`;
  ctx.fillStyle = iconColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, 540, 960);

  circleOverlay.style.display = roundPreviewEl.checked ? '' : 'none';
}

emojiEl.addEventListener('input', render);
bgColorEl.addEventListener('input', () => {
  bgHexEl.value = bgColorEl.value;
  render();
});
bgHexEl.addEventListener('input', () => {
  if (bgHexEl.value.match(/^#[0-9a-fA-F]{6}$/)) {
    bgColorEl.value = bgHexEl.value;
    render();
  }
});
iconSizeEl.addEventListener('input', render);
roundPreviewEl.addEventListener('change', render);

presetBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    bgHexEl.value = btn.dataset.color;
    bgColorEl.value = btn.dataset.color;
    render();
  });
});

downloadBtn.addEventListener('click', () => {
  render();
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ig-highlight-cover-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMsg.textContent = '✓ Saved';
    statusMsg.className = 'status-msg ok';
    setTimeout(() => { statusMsg.textContent = ''; }, 1500);
  }, 'image/png');
});

render();
