/**
 * Password Generator — SharpDev Tools
 * Uses crypto.getRandomValues for cryptographically secure randomness.
 */

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  nums: '0123456789',
  syms: '!@#$%^&*()-_=+[]{}<>?',
};
const AMBIGUOUS = new Set(['0', 'O', 'o', '1', 'l', 'I', '|']);

function generate() {
  const length = parseInt(document.getElementById('length').value);
  const useUpper = document.getElementById('opt-upper').checked;
  const useLower = document.getElementById('opt-lower').checked;
  const useNums = document.getElementById('opt-nums').checked;
  const useSyms = document.getElementById('opt-syms').checked;
  const excludeAmbig = document.getElementById('opt-ambig').checked;

  let pool = '';
  const required = [];
  if (useUpper) { pool += CHARS.upper; required.push(CHARS.upper); }
  if (useLower) { pool += CHARS.lower; required.push(CHARS.lower); }
  if (useNums)  { pool += CHARS.nums;  required.push(CHARS.nums); }
  if (useSyms)  { pool += CHARS.syms;  required.push(CHARS.syms); }

  if (excludeAmbig) {
    pool = [...pool].filter(c => !AMBIGUOUS.has(c)).join('');
    for (let i = 0; i < required.length; i++) {
      required[i] = [...required[i]].filter(c => !AMBIGUOUS.has(c)).join('');
    }
  }

  if (!pool) {
    document.getElementById('password-out').value = '(select at least one character type)';
    updateStrength(0, 0);
    return;
  }

  const chars = [];
  // Ensure at least one of each required category
  for (const r of required) {
    if (r.length) chars.push(pickRandom(r));
  }
  // Fill the rest from the full pool
  while (chars.length < length) chars.push(pickRandom(pool));
  // Shuffle so required chars aren't all at the start
  const pw = secureShuffle(chars).slice(0, length).join('');

  document.getElementById('password-out').value = pw;
  updateStrength(pw.length, pool.length);
}

function secureRandomInt(max) {
  // Returns integer in [0, max) with no modulo bias (rejection sampling).
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  let r;
  do { crypto.getRandomValues(arr); r = arr[0]; } while (r >= limit);
  return r % max;
}

function pickRandom(str) {
  return str[secureRandomInt(str.length)];
}

function secureShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateStrength(length, poolSize) {
  const fill = document.getElementById('strength-fill');
  const label = document.getElementById('strength-label');
  if (!length || !poolSize) {
    fill.style.width = '0%';
    fill.className = 'strength-fill';
    label.textContent = '—';
    return;
  }
  // Entropy in bits
  const entropy = length * Math.log2(poolSize);
  let level, text, pct;
  if (entropy < 40)      { level = 'weak';   text = 'Weak'; pct = 25; }
  else if (entropy < 60) { level = 'fair';   text = 'Fair'; pct = 50; }
  else if (entropy < 90) { level = 'good';   text = 'Good'; pct = 75; }
  else                   { level = 'strong'; text = 'Strong'; pct = 100; }
  fill.style.width = pct + '%';
  fill.className = 'strength-fill ' + level;
  label.textContent = `${text} — ${Math.round(entropy)} bits of entropy`;
}

function copyPassword() {
  const out = document.getElementById('password-out');
  if (!out.value || out.value.startsWith('(')) return;
  navigator.clipboard.writeText(out.value).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1000);
  });
}

function setPreset(n) {
  const slider = document.getElementById('length');
  slider.value = n;
  document.getElementById('length-val').textContent = n;
  generate();
}

// Generate one on load
generate();
