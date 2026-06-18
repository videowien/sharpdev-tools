/**
 * CSS Grid Generator
 */

const PRESETS = {
  '3col': { cols: '1fr 1fr 1fr', rows: 'auto', items: 6 },
  '2col': { cols: '1fr 1fr', rows: 'auto', items: 4 },
  'sidebar': { cols: '240px 1fr', rows: 'auto', items: 4 },
  'cards': { cols: 'repeat(auto-fit, minmax(160px, 1fr))', rows: 'auto', items: 8 },
  'dashboard': { cols: 'repeat(3, 1fr)', rows: 'repeat(2, 120px)', items: 6 },
  'holy': { cols: '200px 1fr 200px', rows: 'auto 1fr auto', items: 5 },
};

const presetEl = document.getElementById('preset');
const colsEl = document.getElementById('cols');
const rowsEl = document.getElementById('rows');
const gapEl = document.getElementById('gap');
const justifyEl = document.getElementById('justify');
const alignEl = document.getElementById('align');
const itemsEl = document.getElementById('items');
const gapVal = document.getElementById('gap-val');
const itemsVal = document.getElementById('items-val');
const preview = document.getElementById('preview');
const output = document.getElementById('output');

presetEl.addEventListener('change', () => {
  if (presetEl.value === 'custom') return;
  const p = PRESETS[presetEl.value];
  if (!p) return;
  colsEl.value = p.cols;
  rowsEl.value = p.rows;
  itemsEl.value = p.items;
  render();
});

[colsEl, rowsEl, gapEl, justifyEl, alignEl, itemsEl].forEach(el => {
  el.addEventListener('input', () => {
    if (el === colsEl || el === rowsEl || el === itemsEl) presetEl.value = 'custom';
    render();
  });
  if (el.tagName === 'SELECT') el.addEventListener('change', render);
});

function render() {
  const cols = colsEl.value || '1fr';
  const rows = rowsEl.value || 'auto';
  const gap = parseInt(gapEl.value, 10);
  const justify = justifyEl.value;
  const align = alignEl.value;
  const itemCount = parseInt(itemsEl.value, 10);
  gapVal.textContent = gap + ' px';
  itemsVal.textContent = itemCount;

  preview.style.gridTemplateColumns = cols;
  preview.style.gridTemplateRows = rows;
  preview.style.gap = gap + 'px';
  preview.style.justifyItems = justify;
  preview.style.alignItems = align;

  preview.innerHTML = '';
  for (let i = 1; i <= itemCount; i++) {
    const d = document.createElement('div');
    d.className = 'item';
    d.textContent = String(i);
    preview.appendChild(d);
  }

  output.textContent = `.container {
  display: grid;
  grid-template-columns: ${cols};
  grid-template-rows: ${rows};
  gap: ${gap}px;
  justify-items: ${justify};
  align-items: ${align};
}`;
}

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent);
  const s = document.getElementById('status-msg');
  s.textContent = '✓ Copied';
  s.className = 'status-msg ok';
  setTimeout(() => { s.textContent = ''; }, 1500);
});

render();
