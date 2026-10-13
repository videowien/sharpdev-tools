/**
 * Find & Replace — live match count + replace preview.
 * Supports regex (with $1 backrefs), case sensitivity, whole-word.
 */
const textIn = document.getElementById('text-in');
const findEl = document.getElementById('find');
const replaceEl = document.getElementById('replace');
const optRegex = document.getElementById('opt-regex');
const optCase = document.getElementById('opt-case');
const optWord = document.getElementById('opt-word');
const matchCount = document.getElementById('match-count');
const errEl = document.getElementById('err');
const outEl = document.getElementById('out');
const copyBtn = document.getElementById('copy-btn');

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRegex() {
  const raw = findEl.value;
  if (!raw) return null;
  let pattern = optRegex.checked ? raw : escapeRegex(raw);
  if (optWord.checked) pattern = '\\b' + pattern + '\\b';
  let flags = 'g';
  if (!optCase.checked) flags += 'i';
  return new RegExp(pattern, flags);
}

function frGo() {
  errEl.textContent = '';
  const src = textIn.value;
  if (!findEl.value) {
    outEl.value = src;
    matchCount.textContent = '0 matches';
    matchCount.classList.remove('hit');
    return;
  }
  let re;
  try { re = buildRegex(); }
  catch (e) {
    errEl.textContent = 'Invalid regex: ' + e.message;
    outEl.value = src;
    matchCount.textContent = '—';
    matchCount.classList.remove('hit');
    return;
  }
  if (!re) { outEl.value = src; matchCount.textContent = '0 matches'; return; }
  const matches = src.match(re);
  const n = matches ? matches.length : 0;
  matchCount.textContent = `${n} match${n === 1 ? '' : 'es'}`;
  matchCount.classList.toggle('hit', n > 0);
  outEl.value = src.replace(re, replaceEl.value);
}

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(outEl.value);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

window.frGo = frGo;
