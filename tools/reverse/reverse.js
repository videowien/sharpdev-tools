/**
 * Text Reverser — characters, words, or lines.
 * Uses Intl.Segmenter when available for proper grapheme splitting
 * (keeps emojis, flags, combining accents intact).
 */
const inEl = document.getElementById('in');
const outEl = document.getElementById('out');
const copyBtn = document.getElementById('copy-btn');
const tabs = document.querySelectorAll('.mode-tab');
let mode = 'chars';

let graphemeSeg = null;
try {
  graphemeSeg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
} catch {}

function splitGraphemes(str) {
  if (graphemeSeg) return [...graphemeSeg.segment(str)].map(s => s.segment);
  return [...str]; // code-point fallback
}

function reverseChars(str) {
  return splitGraphemes(str).reverse().join('');
}

function reverseWords(str) {
  // Preserve internal whitespace runs by using regex capture
  const tokens = str.split(/(\s+)/);
  // Reverse only non-whitespace tokens; keep delimiters in place
  const nonWs = tokens.filter((_, i) => i % 2 === 0).reverse();
  const result = [];
  let wi = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (i % 2 === 0) { result.push(nonWs[wi++]); }
    else { result.push(tokens[i]); }
  }
  return result.join('');
}

function reverseLines(str) {
  const lines = str.split(/\r?\n/);
  return lines.reverse().join('\n');
}

function go() {
  const text = inEl.value;
  let out;
  switch (mode) {
    case 'words': out = reverseWords(text); break;
    case 'lines': out = reverseLines(text); break;
    default:      out = reverseChars(text); break;
  }
  outEl.value = out;
}

tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  mode = t.dataset.mode;
  go();
}));

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(outEl.value);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

window.go = go;
