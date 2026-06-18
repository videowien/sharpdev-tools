/**
 * Diceware Passphrase Generator
 * Uses EFF short wordlist (1296 words → log2(1296) ≈ 10.34 bits / word)
 * Note: The EFF short list 1 has 1296 words = 6^4 from 4-die-roll.
 * Per-word entropy = log2(1296) ≈ 10.34 bits.
 */

const WORDS = window.EFF_SHORT_WORDLIST;
const PER_WORD_BITS = Math.log2(WORDS.length);

const wordCountEl = document.getElementById('word-count');
const wordCountVal = document.getElementById('word-count-val');
const separatorEl = document.getElementById('separator');
const capitalizeEl = document.getElementById('capitalize');
const appendDigitsEl = document.getElementById('append-digits');
const phraseText = document.getElementById('passphrase-text');
const entropyEl = document.getElementById('entropy');
const strengthEl = document.getElementById('strength');
const statusMsg = document.getElementById('status-msg');

wordCountEl.addEventListener('input', () => {
  wordCountVal.textContent = wordCountEl.value;
  gen();
});
[separatorEl, capitalizeEl, appendDigitsEl].forEach(el => el.addEventListener('change', gen));
document.getElementById('gen-btn').addEventListener('click', gen);

function pickWord() {
  // Uniform sample from WORDS using crypto.getRandomValues
  // Use rejection sampling to avoid modulo bias.
  const N = WORDS.length;
  const max = Math.floor(0x100000000 / N) * N;
  const arr = new Uint32Array(1);
  while (true) {
    crypto.getRandomValues(arr);
    if (arr[0] < max) return WORDS[arr[0] % N];
  }
}

function gen() {
  const count = parseInt(wordCountEl.value, 10);
  const sep = separatorEl.value;
  const words = [];
  for (let i = 0; i < count; i++) {
    let w = pickWord();
    if (capitalizeEl.checked) w = w.charAt(0).toUpperCase() + w.slice(1);
    words.push(w);
  }
  let passphrase = words.join(sep);
  let bits = count * PER_WORD_BITS;
  if (appendDigitsEl.checked) {
    const arr = new Uint8Array(2);
    crypto.getRandomValues(arr);
    const d = String(arr[0] % 10) + String(arr[1] % 10);
    passphrase += (sep || '') + d;
    bits += Math.log2(100);
  }
  phraseText.textContent = passphrase;
  const bitsRounded = bits.toFixed(1);
  entropyEl.textContent = `${bitsRounded} bits entropy`;
  // Strength classes by entropy
  let cls, label;
  if (bits < 50)         { cls = 'weak';       label = 'Weak'; }
  else if (bits < 65)    { cls = 'fair';       label = 'Fair'; }
  else if (bits < 90)    { cls = 'strong';     label = 'Strong'; }
  else                   { cls = 'veryStrong'; label = 'Very strong'; }
  strengthEl.className = 'strength ' + cls;
  strengthEl.textContent = label;
}

document.getElementById('copy-btn').addEventListener('click', async () => {
  if (!phraseText.textContent || phraseText.textContent === '—') return;
  await navigator.clipboard.writeText(phraseText.textContent);
  statusMsg.textContent = '✓ Copied';
  statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
});

gen();
