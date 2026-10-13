/**
 * Box Shadow Generator — stackable shadows with inset/color/alpha.
 */
const layersEl = document.getElementById('sh-layers');
const addBtn = document.getElementById('add-btn');
const box = document.getElementById('sh-box');
const codeOut = document.getElementById('code-out');
const copyBtn = document.getElementById('copy-btn');

const DEFAULT = () => ({ x: 0, y: 10, blur: 30, spread: 0, color: '#000000', alpha: 25, inset: false });
const layers = [DEFAULT()];

const SLIDERS = [
  { key: 'x',      label: 'X',      min: -100, max: 100, unit: 'px' },
  { key: 'y',      label: 'Y',      min: -100, max: 100, unit: 'px' },
  { key: 'blur',   label: 'Blur',   min: 0,    max: 150, unit: 'px' },
  { key: 'spread', label: 'Spread', min: -50,  max: 100, unit: 'px' },
  { key: 'alpha',  label: 'Alpha',  min: 0,    max: 100, unit: '%'  },
];

function render() {
  layersEl.innerHTML = '';
  layers.forEach((layer, i) => {
    const el = document.createElement('div');
    el.className = 'sh-layer';

    const head = document.createElement('div');
    head.className = 'sh-layer-head';
    head.innerHTML = `<h3>Shadow ${i + 1}</h3>`;
    const actions = document.createElement('div');
    actions.className = 'sh-layer-actions';
    const insetBtn = document.createElement('button');
    insetBtn.type = 'button';
    insetBtn.className = 'inset' + (layer.inset ? ' active' : '');
    insetBtn.textContent = 'Inset';
    insetBtn.addEventListener('click', () => { layer.inset = !layer.inset; render(); update(); });
    actions.appendChild(insetBtn);
    if (layers.length > 1) {
      const rmBtn = document.createElement('button');
      rmBtn.type = 'button'; rmBtn.className = 'rm-btn'; rmBtn.textContent = 'Remove';
      rmBtn.addEventListener('click', () => { layers.splice(i, 1); render(); update(); });
      actions.appendChild(rmBtn);
    }
    head.appendChild(actions);
    el.appendChild(head);

    SLIDERS.forEach(s => {
      const row = document.createElement('div');
      row.className = 'sh-slider';
      row.innerHTML = `
        <label>${s.label}</label>
        <input type="range" min="${s.min}" max="${s.max}" value="${layer[s.key]}">
        <span class="val">${layer[s.key]}${s.unit}</span>`;
      const inp = row.querySelector('input');
      const val = row.querySelector('.val');
      inp.addEventListener('input', () => {
        layer[s.key] = parseInt(inp.value, 10);
        val.textContent = `${layer[s.key]}${s.unit}`;
        update();
      });
      el.appendChild(row);
    });

    // Color row
    const colorRow = document.createElement('div');
    colorRow.className = 'sh-color-row';
    colorRow.innerHTML = `
      <label>Color</label>
      <div class="color-picker">
        <input type="color" value="${layer.color}">
        <input type="text" value="${layer.color}" maxlength="7" spellcheck="false">
      </div>
      <span></span>`;
    const colorPick = colorRow.querySelector('input[type=color]');
    const colorHex = colorRow.querySelector('input[type=text]');
    colorPick.addEventListener('input', () => { layer.color = colorPick.value; colorHex.value = colorPick.value; update(); });
    colorHex.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(colorHex.value)) { layer.color = colorHex.value; colorPick.value = colorHex.value; update(); }
    });
    el.appendChild(colorRow);

    layersEl.appendChild(el);
  });
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
}

function buildCss() {
  return layers.map(l => {
    const color = hexToRgba(l.color, l.alpha);
    return `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${color}`;
  }).join(', ');
}

function update() {
  const css = buildCss();
  box.style.boxShadow = css;
  codeOut.textContent = `box-shadow: ${css};`;
}

addBtn.addEventListener('click', () => {
  layers.push(DEFAULT());
  render(); update();
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(codeOut.textContent);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

render();
update();
