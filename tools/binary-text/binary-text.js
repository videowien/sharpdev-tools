/**
 * Binary ↔ Text converter (UTF-8).
 */
const inEl = document.getElementById('in');
const outEl = document.getElementById('out');
const copyBtn = document.getElementById('copy-btn');
const errEl = document.getElementById('err');

function looksLikeBinary(s) {
  if (!s.trim()) return false;
  return /^[01\s]+$/.test(s.trim());
}

function textToBinary(s) {
  const bytes = new TextEncoder().encode(s);
  return Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
}

function binaryToText(s) {
  const clean = s.replace(/\s+/g, '');
  if (!/^[01]+$/.test(clean)) throw new Error('Binary must contain only 0 and 1.');
  const fullBytes = Math.floor(clean.length / 8);
  if (fullBytes === 0) throw new Error('Need at least 8 bits.');
  const bytes = new Uint8Array(fullBytes);
  for (let i = 0; i < fullBytes; i++) {
    bytes[i] = parseInt(clean.substr(i * 8, 8), 2);
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

function binGo() {
  const raw = inEl.value;
  errEl.textContent = '';
  if (!raw) { outEl.value = ''; return; }
  try {
    outEl.value = looksLikeBinary(raw) ? binaryToText(raw) : textToBinary(raw);
  } catch (e) {
    errEl.textContent = e.message;
    outEl.value = '';
  }
}

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(outEl.value);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

window.binGo = binGo;
