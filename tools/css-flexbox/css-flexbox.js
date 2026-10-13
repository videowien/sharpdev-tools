/**
 * CSS Flexbox Generator
 */

const ids = ['direction', 'justify', 'align', 'wrap', 'gap', 'items'];
const els = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const preview = document.getElementById('preview');
const output = document.getElementById('output');
const gapVal = document.getElementById('gap-val');
const itemsVal = document.getElementById('items-val');

function render() {
  const dir = els.direction.value;
  const justify = els.justify.value;
  const align = els.align.value;
  const wrap = els.wrap.value;
  const gap = parseInt(els.gap.value, 10);
  const itemCount = parseInt(els.items.value, 10);
  gapVal.textContent = gap + ' px';
  itemsVal.textContent = itemCount;

  preview.style.flexDirection = dir;
  preview.style.justifyContent = justify;
  preview.style.alignItems = align;
  preview.style.flexWrap = wrap;
  preview.style.gap = gap + 'px';

  preview.innerHTML = '';
  for (let i = 1; i <= itemCount; i++) {
    const d = document.createElement('div');
    d.className = 'item';
    d.textContent = String(i);
    // Vary widths slightly so wrap is visible
    if (i % 3 === 0) d.style.minWidth = '120px';
    preview.appendChild(d);
  }

  const css = `.container {
  display: flex;
  flex-direction: ${dir};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}`;
  output.textContent = css;
}

ids.forEach(id => {
  els[id].addEventListener('input', render);
  els[id].addEventListener('change', render);
});

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent);
  const s = document.getElementById('status-msg');
  s.textContent = '✓ Copied';
  s.className = 'status-msg ok';
  setTimeout(() => { s.textContent = ''; }, 1500);
});

render();
