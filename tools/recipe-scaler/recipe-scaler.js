/**
 * Recipe Scaler — parse number+unit, multiply by factor
 */

const origEl = document.getElementById('orig');
const targetEl = document.getElementById('target');
const scaleVal = document.getElementById('scale-val');
const inputEl = document.getElementById('input');
const output = document.getElementById('output');
const statusMsg = document.getElementById('status-msg');
let toFractions = false;

const FRACTIONS = [
  { d: 1, s: '' },
  { d: 1/4, s: '¼' }, { d: 1/3, s: '⅓' }, { d: 1/2, s: '½' }, { d: 2/3, s: '⅔' }, { d: 3/4, s: '¾' },
  { d: 1/8, s: '⅛' }, { d: 3/8, s: '⅜' }, { d: 5/8, s: '⅝' }, { d: 7/8, s: '⅞' },
];

function parseQuantity(str) {
  // Returns { value: number, length: chars consumed } or null
  const trimmed = str.trimStart();
  const leadingSpace = str.length - trimmed.length;

  // Mixed: 2 1/2
  let m = trimmed.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (m) return { value: parseInt(m[1], 10) + parseInt(m[2], 10) / parseInt(m[3], 10), length: leadingSpace + m[0].length };
  // Fraction: 1/2
  m = trimmed.match(/^(\d+)\s*\/\s*(\d+)/);
  if (m) return { value: parseInt(m[1], 10) / parseInt(m[2], 10), length: leadingSpace + m[0].length };
  // Unicode fraction: ½ or 1½
  m = trimmed.match(/^(\d+)?([¼½¾⅓⅔⅛⅜⅝⅞])/);
  if (m) {
    const ucMap = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1/3, '⅔': 2/3, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 };
    const whole = m[1] ? parseInt(m[1], 10) : 0;
    return { value: whole + ucMap[m[2]], length: leadingSpace + m[0].length };
  }
  // Decimal: 1.5
  m = trimmed.match(/^\d+\.\d+/);
  if (m) return { value: parseFloat(m[0]), length: leadingSpace + m[0].length };
  // Whole number: 2
  m = trimmed.match(/^\d+/);
  if (m) return { value: parseInt(m[0], 10), length: leadingSpace + m[0].length };
  return null;
}

function formatQuantity(v) {
  if (toFractions) {
    const whole = Math.floor(v);
    const frac = v - whole;
    // Find closest fraction within tolerance
    let best = null;
    for (const f of FRACTIONS) {
      const diff = Math.abs(f.d - frac);
      if (diff < 0.05 && (!best || diff < best.diff)) best = { ...f, diff };
    }
    if (best) {
      if (whole === 0) return best.s || '0';
      return whole + (best.s ? (' ' + best.s) : '');
    }
  }
  // Default to clean decimal
  if (Math.abs(v - Math.round(v)) < 0.01) return String(Math.round(v));
  return v.toFixed(2).replace(/\.?0+$/, '');
}

function scale() {
  const orig = Math.max(1, parseFloat(origEl.value) || 1);
  const target = Math.max(0.1, parseFloat(targetEl.value) || 1);
  const factor = target / orig;
  scaleVal.textContent = factor.toFixed(2) + '×';

  const lines = inputEl.value.split('\n');
  const out = lines.map(line => {
    if (!line.trim()) return line;
    const q = parseQuantity(line);
    if (!q) return line; // No number → pass through
    const newQty = q.value * factor;
    return formatQuantity(newQty) + line.slice(q.length);
  });
  output.value = out.join('\n');
}

[origEl, targetEl, inputEl].forEach(el => el.addEventListener('input', scale));

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.value);
  statusMsg.textContent = '✓ Copied'; statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
});
document.getElementById('format-btn').addEventListener('click', () => {
  toFractions = !toFractions;
  document.getElementById('format-btn').textContent = toFractions ? 'Use decimals' : 'Round to clean fractions';
  scale();
});

scale();
