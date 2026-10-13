/**
 * Number to Words — English (American short scale).
 * Supports integers up to 15 digits (≈ 999 quadrillion).
 */
const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

const numIn = document.getElementById('num-in');
const outEl = document.getElementById('out');
const errEl = document.getElementById('err');
const copyBtn = document.getElementById('copy-btn');
const variants = document.getElementById('variants');

function threeDigits(n) {
  if (n === 0) return '';
  const parts = [];
  if (n >= 100) { parts.push(ONES[Math.floor(n / 100)] + ' hundred'); n %= 100; }
  if (n >= 20) {
    let t = TENS[Math.floor(n / 10)];
    if (n % 10 > 0) t += '-' + ONES[n % 10];
    parts.push(t);
  } else if (n >= 10) parts.push(TEENS[n - 10]);
  else if (n > 0) parts.push(ONES[n]);
  return parts.join(' ');
}

function numToWords(nStr) {
  // Accept a normalized decimal string
  if (nStr === '0') return 'zero';
  let neg = false;
  if (nStr.startsWith('-')) { neg = true; nStr = nStr.slice(1); }
  // chunk into groups of 3 from right
  const chunks = [];
  for (let i = nStr.length; i > 0; i -= 3) {
    chunks.push(parseInt(nStr.slice(Math.max(0, i - 3), i), 10));
  }
  const parts = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    const c = chunks[i];
    if (c === 0) continue;
    parts.push(threeDigits(c) + (SCALES[i] ? ' ' + SCALES[i] : ''));
  }
  return (neg ? 'negative ' : '') + parts.join(' ');
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function titleCase(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

function renderVariants(words) {
  variants.innerHTML = '';
  const chequeForm = capitalize(words) + ' only';
  const rows = [
    { label: 'Lowercase', value: words },
    { label: 'Title Case', value: titleCase(words) },
    { label: 'Cheque form', value: chequeForm },
  ];
  rows.forEach(r => {
    const row = document.createElement('div');
    row.className = 'variant';
    row.innerHTML = `
      <span class="variant-label">${r.label}</span>
      <span class="variant-val"></span>
      <button class="variant-copy" type="button">Copy</button>
    `;
    row.querySelector('.variant-val').textContent = r.value;
    const btn = row.querySelector('.variant-copy');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(r.value);
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1200);
      } catch { btn.textContent = 'Failed'; }
    });
    variants.appendChild(row);
  });
}

function nwGo() {
  errEl.textContent = '';
  numIn.classList.remove('invalid');
  const raw = numIn.value.trim().replace(/[,\s]/g, '');
  if (!raw) {
    outEl.textContent = '—';
    outEl.classList.add('empty');
    variants.innerHTML = '';
    return;
  }
  if (!/^-?\d+$/.test(raw)) {
    errEl.textContent = 'Enter a whole number (integers only, no decimals).';
    numIn.classList.add('invalid');
    outEl.textContent = '—'; outEl.classList.add('empty');
    variants.innerHTML = ''; return;
  }
  const digitsOnly = raw.replace('-', '');
  if (digitsOnly.length > 18) {
    errEl.textContent = 'Too large — max 18 digits (up to 999 quadrillion).';
    numIn.classList.add('invalid');
    outEl.textContent = '—'; outEl.classList.add('empty');
    variants.innerHTML = ''; return;
  }
  // Normalize: strip leading zeros
  const normalized = (raw.startsWith('-') ? '-' : '') + digitsOnly.replace(/^0+(?=\d)/, '');
  const words = numToWords(normalized === '' || normalized === '-' ? '0' : normalized);
  outEl.textContent = capitalize(words) + '.';
  outEl.classList.remove('empty');
  renderVariants(words);
}

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(outEl.textContent);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

window.nwGo = nwGo;
