/**
 * YouTube Title Counter — 100 char limit + truncation marks per surface
 */

const LIMIT = 100;
const titleEl = document.getElementById('title');
const counter = document.getElementById('counter');
const fill = document.getElementById('counter-fill');

const segmenter = (typeof Intl !== 'undefined' && Intl.Segmenter)
  ? new Intl.Segmenter('en', { granularity: 'grapheme' })
  : null;

function countGraphemes(str) {
  if (segmenter) {
    let n = 0;
    for (const _ of segmenter.segment(str)) n++;
    return n;
  }
  return [...str].length;
}

function truncate(str, max) {
  if (!segmenter) {
    const arr = [...str];
    if (arr.length <= max) return { visible: str, cut: '' };
    return { visible: arr.slice(0, max).join(''), cut: arr.slice(max).join('') };
  }
  let visible = '', cut = '', count = 0;
  for (const { segment } of segmenter.segment(str)) {
    if (count < max) visible += segment;
    else cut += segment;
    count++;
  }
  return { visible, cut };
}

function update() {
  const text = titleEl.value;
  const count = countGraphemes(text);
  counter.textContent = `${count} / ${LIMIT}`;
  counter.className = 'counter';
  fill.className = 'counter-fill';
  const pct = Math.min(100, (count / LIMIT) * 100);
  fill.style.width = pct + '%';
  if (count > LIMIT) { counter.classList.add('over'); fill.classList.add('over'); }
  else if (count > LIMIT * 0.9) { counter.classList.add('warn'); fill.classList.add('warn'); }

  // Previews
  setPreview('p-search', text, 70);
  setPreview('p-suggested', text, 45);
  setPreview('p-mobile', text, 55);
}

function setPreview(id, text, max) {
  const el = document.getElementById(id);
  if (!text) { el.innerHTML = '—'; return; }
  const { visible, cut } = truncate(text, max);
  el.innerHTML = visible + (cut ? '<span class="cut">' + escapeHtml(cut) + '</span>' : '');
}

function escapeHtml(s) {
  const d = document.createElement('div'); d.textContent = s; return d.innerHTML;
}

titleEl.addEventListener('input', update);
update();
