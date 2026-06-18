/**
 * UUID Generator — SharpDev Tools
 * v4 via crypto.randomUUID when available, otherwise crypto.getRandomValues.
 */

const outputEl = document.getElementById('output');
const statsOut = document.getElementById('stats-out');
const subtitleEl = document.getElementById('subtitle');

let lastUuids = [];

function randomUuidV4() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Per RFC 4122 v4
  bytes[6] = (bytes[6] & 0x0f) | 0x40;  // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80;  // variant 10xx
  const h = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function generate() {
  const countInput = document.getElementById('count');
  let count = parseInt(countInput.value) || 1;
  if (count < 1) count = 1;
  if (count > 1000) count = 1000;
  countInput.value = count;

  lastUuids = [];
  for (let i = 0; i < count; i++) lastUuids.push(randomUuidV4());
  render();
}

function formatOne(u) {
  let s = u;
  if (!document.getElementById('opt-hyphens').checked) s = s.replace(/-/g, '');
  if (document.getElementById('opt-upper').checked) s = s.toUpperCase();
  if (document.getElementById('opt-braces').checked) s = '{' + s + '}';
  if (document.getElementById('opt-quotes').checked) s = '"' + s + '"';
  return s;
}

function render() {
  const formatted = lastUuids.map(formatOne);
  outputEl.value = formatted.join('\n');
  statsOut.textContent = `${lastUuids.length} UUID${lastUuids.length !== 1 ? 's' : ''}`;
  const bits = lastUuids.length * 122;
  subtitleEl.textContent = `Cryptographically random UUIDs (v4). ${lastUuids.length ? `${lastUuids.length} generated · ${bits.toLocaleString()} bits of entropy.` : 'Batch up to 1000 at a time.'}`;
}

function onOptionsChanged() {
  if (lastUuids.length) render();
}

function copyOutput() {
  if (!outputEl.value) return;
  navigator.clipboard.writeText(outputEl.value);
  const btns = document.querySelectorAll('.small-btn');
  const btn = btns[0];
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 900);
}

function downloadTxt() {
  if (!outputEl.value) return;
  const blob = new Blob([outputEl.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `uuids-${lastUuids.length}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Keyboard: Enter in count field triggers generate
document.getElementById('count').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); generate(); }
});

// Initial
generate();
