/**
 * ROT13 / Caesar cipher with live shift slider.
 * Letters get shifted within A-Z / a-z; everything else passes through.
 */
const inEl = document.getElementById('in');
const outEl = document.getElementById('out');
const shift = document.getElementById('shift');
const shiftVal = document.getElementById('shift-val');
const rot13Btn = document.getElementById('rot13-btn');
const swapBtn = document.getElementById('swap-btn');
const copyBtn = document.getElementById('copy-btn');

function caesar(str, n) {
  n = ((n % 26) + 26) % 26;
  let out = '';
  for (const ch of str) {
    const c = ch.charCodeAt(0);
    if (c >= 65 && c <= 90) {
      out += String.fromCharCode(((c - 65 + n) % 26) + 65);
    } else if (c >= 97 && c <= 122) {
      out += String.fromCharCode(((c - 97 + n) % 26) + 97);
    } else {
      out += ch;
    }
  }
  return out;
}

function updateShiftLabel() {
  const n = parseInt(shift.value, 10);
  shiftVal.textContent = n === 13 ? '13 (ROT13)' : `${n}`;
}

function rotGo() {
  const n = parseInt(shift.value, 10);
  outEl.value = caesar(inEl.value, n);
}

shift.addEventListener('input', () => { updateShiftLabel(); rotGo(); });
rot13Btn.addEventListener('click', () => { shift.value = 13; updateShiftLabel(); rotGo(); });
swapBtn.addEventListener('click', () => {
  inEl.value = outEl.value;
  rotGo();
});
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(outEl.value);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

updateShiftLabel();
window.rotGo = rotGo;
