/**
 * Roman Numerals Converter
 * Supports 1 to 3,999,999. Values above 3,999 use extended overline
 * notation (e.g., V̄ = 5000) via the Unicode combining overline U+0305.
 */
const OV = '\u0305'; // combining overline — placed AFTER the letter it decorates

// Order matters — largest first. Each entry: [roman, value]
const PAIRS = [
  ['M' + OV,                    1000000],
  ['C' + OV + 'M' + OV,          900000],
  ['D' + OV,                     500000],
  ['C' + OV + 'D' + OV,          400000],
  ['C' + OV,                     100000],
  ['X' + OV + 'C' + OV,           90000],
  ['L' + OV,                      50000],
  ['X' + OV + 'L' + OV,           40000],
  ['X' + OV,                      10000],
  ['I' + OV + 'X' + OV,            9000],
  ['V' + OV,                       5000],
  ['I' + OV + 'V' + OV,            4000],
  ['M',                            1000],
  ['CM',                            900],
  ['D',                             500],
  ['CD',                            400],
  ['C',                             100],
  ['XC',                             90],
  ['L',                              50],
  ['XL',                             40],
  ['X',                              10],
  ['IX',                              9],
  ['V',                               5],
  ['IV',                              4],
  ['I',                               1],
];

const SINGLE_VALUES = {
  'I':     1, 'V':     5, 'X':    10, 'L':    50,
  'C':   100, 'D':   500, 'M':  1000,
  ['I' + OV]:    1000, ['V' + OV]:    5000,
  ['X' + OV]:   10000, ['L' + OV]:   50000,
  ['C' + OV]:  100000, ['D' + OV]:  500000, ['M' + OV]: 1000000,
};

function numToRoman(n) {
  if (!Number.isInteger(n) || n < 1 || n > 3999999) return null;
  let out = '';
  for (const [r, v] of PAIRS) {
    while (n >= v) {
      out += r;
      n -= v;
    }
  }
  return out;
}

function romanToNum(s) {
  if (!s) return null;
  s = s.trim().toUpperCase().replace(/\s+/g, '');
  // Tokenize: a letter optionally followed by a combining overline counts as one token.
  const tokens = [];
  const arr = [...s];
  for (let i = 0; i < arr.length; i++) {
    const ch = arr[i];
    if (!/[IVXLCDM]/.test(ch)) return null;
    let tok = ch;
    if (i + 1 < arr.length && arr[i + 1] === OV) {
      tok += OV;
      i++;
    }
    if (!(tok in SINGLE_VALUES)) return null;
    tokens.push({ tok, val: SINGLE_VALUES[tok] });
  }
  // Standard subtractive parsing
  let total = 0;
  for (let i = 0; i < tokens.length; i++) {
    const v = tokens[i].val;
    const next = i + 1 < tokens.length ? tokens[i + 1].val : 0;
    if (v < next) total -= v;
    else total += v;
  }
  if (total < 1 || total > 3999999) return null;
  // Canonical roundtrip check rejects non-standard forms (IIII, VX, etc.)
  const canonical = numToRoman(total);
  // Canonical always produces the overline-only variant; input may use either,
  // so re-normalize input by joining tokens and compare.
  const normalized = tokens.map(t => t.tok).join('');
  if (canonical !== normalized) return null;
  return total;
}

// ---- UI wiring ----
const numIn = document.getElementById('num-in');
const romIn = document.getElementById('rom-in');
const numErr = document.getElementById('num-err');
const romErr = document.getElementById('rom-err');
const resultBox = document.getElementById('result-box');
const resultValue = document.getElementById('result-value');
const copyBtn = document.getElementById('copy-btn');

function showResult(text) {
  resultBox.style.display = 'flex';
  resultValue.textContent = text;
}
function hideResult() {
  resultBox.style.display = 'none';
}

function fromNumber() {
  romErr.textContent = '';
  romIn.classList.remove('invalid');
  const raw = numIn.value.trim().replace(/[,\s]/g, '');
  if (!raw) { numErr.textContent = ''; numIn.classList.remove('invalid'); hideResult(); romIn.value = ''; return; }
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    numErr.textContent = 'Enter a whole number.';
    numIn.classList.add('invalid'); hideResult(); return;
  }
  if (n < 1 || n > 3999999) {
    numErr.textContent = 'Out of range. Must be between 1 and 3,999,999.';
    numIn.classList.add('invalid'); hideResult(); return;
  }
  numErr.textContent = '';
  numIn.classList.remove('invalid');
  const r = numToRoman(n);
  romIn.value = r;
  showResult(r);
}

function fromRoman() {
  numErr.textContent = '';
  numIn.classList.remove('invalid');
  const raw = romIn.value;
  if (!raw.trim()) { romErr.textContent = ''; romIn.classList.remove('invalid'); hideResult(); numIn.value = ''; return; }
  const n = romanToNum(raw);
  if (n === null) {
    romErr.textContent = 'Not a valid Roman numeral.';
    romIn.classList.add('invalid'); hideResult(); return;
  }
  romErr.textContent = '';
  romIn.classList.remove('invalid');
  numIn.value = n.toLocaleString('en-US');
  showResult(n.toLocaleString('en-US'));
}

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultValue.textContent);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('copied');
    }, 1400);
  } catch {
    copyBtn.textContent = 'Failed';
  }
});

window.fromNumber = fromNumber;
window.fromRoman = fromRoman;
