/**
 * LinkedIn Headline Counter — SharpDev Tools
 */

const LIMIT = 220;
const MOBILE_TRUNCATE = 90; // approx visible chars in search-result mobile view

const input = document.getElementById('headline-input');
const counterFill = document.getElementById('counter-fill');
const charCount = document.getElementById('char-count');
const remaining = document.getElementById('remaining');
const previewHeadline = document.getElementById('preview-headline');
const searchHeadline = document.getElementById('search-headline');

function truncate(s, n) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + '…';
}

function update() {
  const text = input.value;
  const len = text.length;
  charCount.textContent = len + ' / ' + LIMIT;
  const pct = Math.min(100, (len / LIMIT) * 100);
  counterFill.style.width = pct + '%';

  let cls = 'counter-fill';
  if (len > LIMIT) cls += ' over';
  else if (len > LIMIT * 0.9) cls += ' near';
  counterFill.className = cls;

  const left = LIMIT - len;
  if (left < 0) {
    remaining.textContent = `${-left} over limit — will be truncated`;
    remaining.className = 'remaining err';
  } else if (left < 20) {
    remaining.textContent = `${left} characters left`;
    remaining.className = 'remaining warn';
  } else {
    remaining.textContent = `${left} characters left`;
    remaining.className = 'remaining';
  }

  previewHeadline.textContent = text || 'Your headline will preview here';
  searchHeadline.textContent = truncate(text, MOBILE_TRUNCATE);
}

input.addEventListener('input', update);
update();
