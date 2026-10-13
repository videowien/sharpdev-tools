/**
 * Gradient Generator — linear or radial with arbitrary color stops.
 */
const preview = document.getElementById('gr-preview');
const stopsEl = document.getElementById('gr-stops');
const addStop = document.getElementById('add-stop');
const angleEl = document.getElementById('angle');
const angleVal = document.getElementById('angle-val');
const shapeEl = document.getElementById('shape');
const positionEl = document.getElementById('position');
const linearOpts = document.getElementById('linear-opts');
const radialOpts = document.getElementById('radial-opts');
const tabs = document.querySelectorAll('.tab-btn');
const codeOut = document.getElementById('code-out');
const copyBtn = document.getElementById('copy-btn');

let type = 'linear';
let stops = [
  { color: '#ff4444', pos: 0 },
  { color: '#ffce3a', pos: 100 },
];
const MAX_STOPS = 10;

function renderStops() {
  stopsEl.innerHTML = '';
  stops.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'gr-stop';
    row.innerHTML = `
      <input type="color" value="${s.color}">
      <input type="text" value="${s.color}" maxlength="7" spellcheck="false">
      <input type="range" min="0" max="100" value="${s.pos}">
      <span class="val">${s.pos}%</span>
      <button type="button" class="rm-btn" ${stops.length <= 2 ? 'disabled' : ''}>\u00D7</button>`;
    const [colorPick, colorHex, rangeInp, valEl, rmBtn] = row.children;
    colorPick.addEventListener('input', () => { s.color = colorPick.value; colorHex.value = colorPick.value; update(); });
    colorHex.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(colorHex.value)) { s.color = colorHex.value; colorPick.value = colorHex.value; update(); }
    });
    rangeInp.addEventListener('input', () => { s.pos = parseInt(rangeInp.value, 10); valEl.textContent = `${s.pos}%`; update(); });
    rmBtn.addEventListener('click', () => {
      if (stops.length <= 2) return;
      stops.splice(i, 1); renderStops(); update();
    });
    stopsEl.appendChild(row);
  });
  addStop.disabled = stops.length >= MAX_STOPS;
}

function buildCss() {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const stopStr = sorted.map(s => `${s.color} ${s.pos}%`).join(', ');
  if (type === 'linear') {
    return `linear-gradient(${angleEl.value}deg, ${stopStr})`;
  } else {
    const pos = positionEl.value;
    return `radial-gradient(${shapeEl.value}${pos !== 'center' ? ' at ' + pos : ''}, ${stopStr})`;
  }
}

function update() {
  const css = buildCss();
  preview.style.background = css;
  codeOut.textContent = `background: ${css};`;
}

tabs.forEach(t => {
  t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    type = t.dataset.type;
    linearOpts.style.display = type === 'linear' ? 'flex' : 'none';
    radialOpts.style.display = type === 'radial' ? 'flex' : 'none';
    update();
  });
});

angleEl.addEventListener('input', () => { angleVal.textContent = `${angleEl.value}\u00B0`; update(); });
shapeEl.addEventListener('change', update);
positionEl.addEventListener('change', update);

addStop.addEventListener('click', () => {
  if (stops.length >= MAX_STOPS) return;
  const newPos = Math.min(100, Math.max(0, Math.round(stops[stops.length - 1].pos - 20)));
  stops.push({ color: '#66aaff', pos: newPos });
  renderStops(); update();
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(codeOut.textContent);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

renderStops();
update();
