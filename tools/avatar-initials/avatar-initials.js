/**
 * Initials Avatar Generator — letter on color circle, PNG + SVG
 */

const nameEl = document.getElementById('name');
const initialsEl = document.getElementById('initials');
const bgEl = document.getElementById('bg');
const fgEl = document.getElementById('fg');
const shapeEl = document.getElementById('shape');
const sizeEl = document.getElementById('size');
const boldEl = document.getElementById('bold');
const canvas = document.getElementById('avatar');
const ctx = canvas.getContext('2d');
const statusMsg = document.getElementById('status-msg');

function autoInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

let manualOverride = false;
nameEl.addEventListener('input', () => {
  if (!manualOverride) initialsEl.placeholder = autoInitials(nameEl.value);
  render();
});
initialsEl.addEventListener('input', () => {
  manualOverride = initialsEl.value.length > 0;
  render();
});
[bgEl, fgEl, shapeEl, sizeEl, boldEl].forEach(el => el.addEventListener('input', render));

document.getElementById('random-color').addEventListener('click', () => {
  const palette = ['#ff4444','#ff7043','#ffa726','#ffca28','#9ccc65','#26a69a','#42a5f5','#5c6bc0','#7e57c2','#ab47bc','#ec407a','#26c6da'];
  bgEl.value = palette[Math.floor(Math.random() * palette.length)];
  render();
});

function render() {
  const size = Math.max(64, Math.min(1024, parseInt(sizeEl.value, 10) || 256));
  canvas.width = size; canvas.height = size;
  const initials = (initialsEl.value || autoInitials(nameEl.value) || '?').toUpperCase().slice(0, 3);

  ctx.clearRect(0, 0, size, size);

  // Shape
  ctx.fillStyle = bgEl.value;
  if (shapeEl.value === 'circle') {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shapeEl.value === 'rounded') {
    const r = size * 0.18;
    roundRect(ctx, 0, 0, size, size, r);
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, size, size);
  }

  // Initials
  ctx.fillStyle = fgEl.value;
  const fontSize = initials.length === 1 ? size * 0.55 : initials.length === 2 ? size * 0.42 : size * 0.34;
  const weight = boldEl.checked ? '700' : '500';
  ctx.font = `${weight} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size / 2, size / 2 + fontSize * 0.02);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

document.getElementById('dl-png').addEventListener('click', () => {
  render();
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `avatar-${(initialsEl.value || autoInitials(nameEl.value) || 'avatar')}.png`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flash('✓ Saved PNG');
  }, 'image/png');
});

document.getElementById('dl-svg').addEventListener('click', () => {
  const initials = (initialsEl.value || autoInitials(nameEl.value) || '?').toUpperCase().slice(0, 3);
  const SIZE = 200;
  const fontSize = initials.length === 1 ? SIZE * 0.55 : initials.length === 2 ? SIZE * 0.42 : SIZE * 0.34;
  let shape;
  if (shapeEl.value === 'circle') shape = `<circle cx="${SIZE/2}" cy="${SIZE/2}" r="${SIZE/2}" fill="${bgEl.value}"/>`;
  else if (shapeEl.value === 'rounded') shape = `<rect width="${SIZE}" height="${SIZE}" rx="${SIZE*0.18}" fill="${bgEl.value}"/>`;
  else shape = `<rect width="${SIZE}" height="${SIZE}" fill="${bgEl.value}"/>`;
  const weight = boldEl.checked ? '700' : '500';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">${shape}<text x="${SIZE/2}" y="${SIZE/2}" text-anchor="middle" dominant-baseline="central" fill="${fgEl.value}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-weight="${weight}" font-size="${fontSize}">${escapeXml(initials)}</text></svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `avatar-${initials}.svg`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ Saved SVG');
});

function escapeXml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function flash(msg) { statusMsg.textContent = msg; statusMsg.className = 'status-msg ok'; setTimeout(() => { statusMsg.textContent = ''; }, 1500); }

initialsEl.placeholder = autoInitials(nameEl.value);
render();
