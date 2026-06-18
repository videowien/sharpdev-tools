/**
 * Mention & Hashtag Extractor
 */

const inputEl = document.getElementById('input');
const dedupEl = document.getElementById('dedup');
const sortEl = document.getElementById('sort');
const stripEl = document.getElementById('strip-prefix');
const statusMsg = document.getElementById('status-msg');

const RE = {
  mentions: /(?<=^|\s|^)@[A-Za-z0-9_.\-]+/g,
  hashtags: /(?<=^|\s|^)#[A-Za-z0-9_]+/g,
  urls: /https?:\/\/[^\s<>"]+[^\s<>".,)!?:;]/g,
};

let lastResults = { mentions: [], hashtags: [], urls: [] };

function extract() {
  const text = inputEl.value;
  for (const [kind, re] of Object.entries(RE)) {
    let items = text.match(re) || [];
    if (dedupEl.checked) items = Array.from(new Set(items));
    if (sortEl.checked && kind !== 'urls') items.sort((a, b) => a.localeCompare(b));
    lastResults[kind] = items;
    render(kind, items);
  }
}

function render(kind, items) {
  const el = document.getElementById('r-' + kind);
  const c = document.getElementById('c-' + kind);
  c.textContent = `(${items.length})`;
  if (items.length === 0) {
    el.innerHTML = '<span class="empty">none</span>';
    return;
  }
  el.innerHTML = items.map(i => `<span class="item">${escapeHtml(i)}</span>`).join('');
}

function escapeHtml(s) {
  const d = document.createElement('div'); d.textContent = s; return d.innerHTML;
}

document.querySelectorAll('.copy-mini').forEach(btn => {
  btn.addEventListener('click', async () => {
    const kind = btn.dataset.target;
    const items = lastResults[kind] || [];
    if (!items.length) return;
    const stripped = stripEl.checked
      ? items.map(i => (kind === 'urls') ? i : i.replace(/^[@#]/, ''))
      : items;
    await navigator.clipboard.writeText(stripped.join('\n'));
    btn.classList.add('copied');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'Copy'; }, 1200);
  });
});

[inputEl, dedupEl, sortEl].forEach(el => el.addEventListener('input', extract));
extract();
