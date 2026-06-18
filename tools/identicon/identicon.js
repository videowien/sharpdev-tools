/**
 * Identicon Generator — 5×5 mirrored grid, hue from SHA-256 of input
 */

const GRID = 5; // 5×5 cells, symmetric on the vertical axis (column 0 = column 4, col 1 = col 3)
const COLS_TO_FILL = 3; // 5 cells / 2 = 3 (we mirror)

const inputEl = document.getElementById('input');
const sizeEl = document.getElementById('size');
const bgEl = document.getElementById('bg');
const hueModeEl = document.getElementById('hue-mode');
const canvas = document.getElementById('identicon');
const ctx = canvas.getContext('2d');
const statusMsg = document.getElementById('status-msg');

async function sha256(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return new Uint8Array(buf);
}

function hueFrom(bytes) {
  const mode = hueModeEl.value;
  if (mode === 'brand') return { h: 0, s: 70, l: 55 };
  // Use first 3 bytes for color
  const hashHue = bytes[0] / 255 * 360;
  if (mode === 'cool') return { h: 180 + (hashHue % 120), s: 60, l: 50 };
  if (mode === 'warm') return { h: (hashHue % 60), s: 75, l: 55 };
  return { h: hashHue, s: 55, l: 50 };
}

async function render() {
  const seed = inputEl.value || ' ';
  const size = Math.max(64, Math.min(1024, parseInt(sizeEl.value, 10) || 256));
  canvas.width = size;
  canvas.height = size;

  const bytes = await sha256(seed);
  const { h, s, l } = hueFrom(bytes);
  const fg = `hsl(${h.toFixed(0)}, ${s}%, ${l}%)`;

  // Background
  ctx.fillStyle = bgEl.value;
  ctx.fillRect(0, 0, size, size);

  // 5×5 cells; we fill left half (cols 0..2) and mirror to cols 3..4
  const padding = size * 0.08;
  const cell = (size - padding * 2) / GRID;
  ctx.fillStyle = fg;
  let bitIdx = 0;
  for (let col = 0; col < COLS_TO_FILL; col++) {
    for (let row = 0; row < GRID; row++) {
      const byte = bytes[(bitIdx >> 3) + 3]; // skip first 3 bytes used for color
      const bit = (byte >> (bitIdx & 7)) & 1;
      bitIdx++;
      if (bit) {
        const x = padding + col * cell;
        const y = padding + row * cell;
        ctx.fillRect(x, y, cell + 0.5, cell + 0.5);
        // Mirror to col 4-col
        const mirrorCol = GRID - 1 - col;
        if (mirrorCol !== col) {
          ctx.fillRect(padding + mirrorCol * cell, y, cell + 0.5, cell + 0.5);
        }
      }
    }
  }
}

async function downloadPng() {
  await render();
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `identicon-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flash('✓ Saved PNG');
  }, 'image/png');
}

async function downloadSvg() {
  const seed = inputEl.value || ' ';
  const bytes = await sha256(seed);
  const { h, s, l } = hueFrom(bytes);
  const fg = `hsl(${h.toFixed(0)}, ${s}%, ${l}%)`;
  const SIZE = 100;
  const pad = SIZE * 0.08;
  const cell = (SIZE - pad * 2) / GRID;
  let rects = '';
  let bitIdx = 0;
  for (let col = 0; col < COLS_TO_FILL; col++) {
    for (let row = 0; row < GRID; row++) {
      const byte = bytes[(bitIdx >> 3) + 3];
      const bit = (byte >> (bitIdx & 7)) & 1;
      bitIdx++;
      if (bit) {
        const x = pad + col * cell;
        const y = pad + row * cell;
        rects += `<rect x="${x.toFixed(3)}" y="${y.toFixed(3)}" width="${cell.toFixed(3)}" height="${cell.toFixed(3)}"/>`;
        const mirrorCol = GRID - 1 - col;
        if (mirrorCol !== col) {
          rects += `<rect x="${(pad + mirrorCol * cell).toFixed(3)}" y="${y.toFixed(3)}" width="${cell.toFixed(3)}" height="${cell.toFixed(3)}"/>`;
        }
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="${bgEl.value}"/><g fill="${fg}">${rects}</g></svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `identicon-${Date.now()}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ Saved SVG');
}

function flash(msg) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
}

[inputEl, sizeEl, bgEl, hueModeEl].forEach(el => el.addEventListener('input', render));
document.getElementById('dl-png').addEventListener('click', downloadPng);
document.getElementById('dl-svg').addEventListener('click', downloadSvg);
document.getElementById('reroll-btn').addEventListener('click', () => {
  inputEl.value = Math.random().toString(36).slice(2);
  render();
});

render();
