/** Bio Builder — Unicode styling + emoji inserts + per-platform counter */
const input = document.getElementById('bio-in');
const preview = document.getElementById('bio-preview');
const platforms = document.getElementById('bio-platforms');
const copyBtn = document.getElementById('copy-btn');

// Unicode style maps. The Mathematical Alphanumeric block has
// reserved holes where the real glyph lives in the BMP; EXCEPTIONS
// maps those back. Without them, italic 'h' or script 'B' render
// as missing-glyph tofu.
const EXCEPTIONS = {
  'italic:h': '\u210E',
  'script:B': '\u212C', 'script:E': '\u2130', 'script:F': '\u2131',
  'script:H': '\u210B', 'script:I': '\u2110', 'script:L': '\u2112',
  'script:M': '\u2133', 'script:R': '\u211B',
  'script:e': '\u212F', 'script:g': '\u210A', 'script:o': '\u2134',
};
function mapChar(c, style) {
  const key = style + ':' + c;
  if (EXCEPTIONS[key]) return EXCEPTIONS[key];
  const a = 'a'.charCodeAt(0), A = 'A'.charCodeAt(0), zero = '0'.charCodeAt(0);
  const isLower = c.charCodeAt(0) >= a && c.charCodeAt(0) <= a + 25;
  const isUpper = c.charCodeAt(0) >= A && c.charCodeAt(0) <= A + 25;
  const isDigit = c.charCodeAt(0) >= zero && c.charCodeAt(0) <= zero + 9;
  const iLow = isLower ? c.charCodeAt(0) - a : -1;
  const iUp = isUpper ? c.charCodeAt(0) - A : -1;
  const iDig = isDigit ? c.charCodeAt(0) - zero : -1;
  const cp = (baseLow, baseUp, baseDig) => {
    if (isLower && baseLow != null) return String.fromCodePoint(baseLow + iLow);
    if (isUpper && baseUp != null) return String.fromCodePoint(baseUp + iUp);
    if (isDigit && baseDig != null) return String.fromCodePoint(baseDig + iDig);
    return c;
  };
  switch (style) {
    case 'bold':       return cp(0x1D41A, 0x1D400, 0x1D7CE);
    case 'italic':     return cp(0x1D44E, 0x1D434);
    case 'boldItalic': return cp(0x1D482, 0x1D468);
    case 'script':     return cp(0x1D4EA, 0x1D4D0);
    case 'monospace':  return cp(0x1D68A, 0x1D670, 0x1D7F6);
    case 'strike':     return c + '\u0336';
  }
  return c;
}

function transform(text, style) {
  return [...text].map(c => mapChar(c, style)).join('');
}

document.querySelectorAll('.tb-btn[data-style]').forEach(btn => {
  btn.addEventListener('click', () => {
    const style = btn.dataset.style;
    const start = input.selectionStart, end = input.selectionEnd;
    if (start === end) return;
    const before = input.value.slice(0, start);
    const sel = input.value.slice(start, end);
    const after = input.value.slice(end);
    const styled = transform(sel, style);
    input.value = before + styled + after;
    input.focus();
    input.setSelectionRange(before.length, before.length + [...styled].length);
    update();
  });
});

const INSERTS = {
  bullet: '• ',
  arrow: '→ ',
  divider: '\n─────────\n',
  sparkle: '✨ ',
  star: '⭐ ',
  heart: '❤️ ',
};
document.querySelectorAll('.tb-btn[data-insert]').forEach(btn => {
  btn.addEventListener('click', () => {
    const token = INSERTS[btn.dataset.insert];
    const start = input.selectionStart;
    const before = input.value.slice(0, start);
    const after = input.value.slice(start);
    input.value = before + token + after;
    input.focus();
    input.setSelectionRange(before.length + token.length, before.length + token.length);
    update();
  });
});

const PLATFORMS = [
  { name: 'Instagram', max: 150 },
  { name: 'Twitter/X', max: 160 },
  { name: 'TikTok', max: 80 },
  { name: 'LinkedIn', max: 220 },
];

function renderPlatforms(len) {
  platforms.innerHTML = '';
  PLATFORMS.forEach(p => {
    const el = document.createElement('div');
    el.className = 'bio-platform' + (len > p.max ? ' over' : '');
    el.innerHTML = `<div class="pname">${p.name}</div><div class="pcount">${len}/${p.max}</div>`;
    platforms.appendChild(el);
  });
}

function update() {
  const v = input.value;
  const len = [...v].length;
  renderPlatforms(len);
  if (!v) { preview.textContent = 'Preview appears here…'; preview.classList.add('empty'); return; }
  preview.classList.remove('empty');
  preview.textContent = v;
}

input.addEventListener('input', update);
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(input.value);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});
update();
