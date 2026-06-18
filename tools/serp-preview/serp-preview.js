/**
 * SERP Preview — Google snippet with desktop + mobile truncation
 */

const T_DESKTOP = 60;
const T_MOBILE = 50;
const D_DESKTOP = 155;
const D_MOBILE = 120;

const titleEl = document.getElementById('title');
const urlEl = document.getElementById('url');
const descEl = document.getElementById('desc');

function truncate(s, max) {
  if (!s) return { visible: '', cut: '' };
  if (s.length <= max) return { visible: s, cut: '' };
  // Try to cut at a word boundary
  const slice = s.slice(0, max);
  const space = slice.lastIndexOf(' ');
  if (space > max - 20) return { visible: slice.slice(0, space) + '…', cut: s.slice(space) };
  return { visible: slice + '…', cut: s.slice(max) };
}

function render() {
  const title = titleEl.value;
  const url = urlEl.value || 'https://example.com';
  const desc = descEl.value;

  // Counters
  setCounter('t-counter', title.length, T_DESKTOP);
  setCounter('d-counter', desc.length, D_DESKTOP);

  // URL — Google shows breadcrumb-style with arrows, but we'll do hostname > path
  let displayUrl = url.replace(/^https?:\/\//, '');
  // Mobile shows just hostname mostly
  const host = displayUrl.split('/')[0];

  // Desktop
  document.getElementById('d-url').textContent = displayUrl;
  setTruncated('d-title', title || 'Title appears here', T_DESKTOP);
  setTruncated('d-desc', desc || 'Meta description appears here…', D_DESKTOP);

  // Mobile
  document.getElementById('m-url').textContent = host;
  setTruncated('m-title', title || 'Title appears here', T_MOBILE);
  setTruncated('m-desc', desc || 'Meta description appears here…', D_MOBILE);
}

function setCounter(id, n, max) {
  const el = document.getElementById(id);
  el.textContent = `${n} / ${max}`;
  el.className = 'counter' + (n > max ? ' over' : n > max * 0.9 ? ' warn' : '');
}

function setTruncated(id, text, max) {
  const { visible, cut } = truncate(text, max);
  const el = document.getElementById(id);
  el.innerHTML = '';
  el.appendChild(document.createTextNode(visible));
  if (cut) {
    const span = document.createElement('span');
    span.className = 'cut';
    span.textContent = ' ' + cut;
    el.appendChild(span);
  }
}

[titleEl, urlEl, descEl].forEach(el => el.addEventListener('input', render));
render();
