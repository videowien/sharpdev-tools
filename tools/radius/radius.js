/**
 * Border Radius Generator — 4 corners, optional elliptical, px or %.
 */
const CORNERS = [
  { key: 'tl', label: 'Top-left' },
  { key: 'tr', label: 'Top-right' },
  { key: 'br', label: 'Bottom-right' },
  { key: 'bl', label: 'Bottom-left' },
];

const slidersWrap = document.getElementById('rad-sliders');
const linkAll = document.getElementById('link-all');
const ellipticalOpt = document.getElementById('elliptical');
const unitSelect = document.getElementById('unit-select');
const radBox = document.getElementById('rad-box');
const codeOut = document.getElementById('code-out');
const copyBtn = document.getElementById('copy-btn');

// state: each corner has {h: number, v: number}. In non-elliptical mode, h is used.
const state = {};
CORNERS.forEach(c => state[c.key] = { h: 24, v: 24 });

function renderSliders() {
  slidersWrap.innerHTML = '';
  const max = unitSelect.value === 'px' ? 200 : 100;
  const elliptical = ellipticalOpt.checked;
  const linked = linkAll.checked;

  if (linked) {
    // one row for horizontal, optional second for vertical
    addSlider('all-h', 'All' + (elliptical ? ' (H)' : ''), state.tl.h, max);
    if (elliptical) addSlider('all-v', 'All (V)', state.tl.v, max);
  } else {
    CORNERS.forEach(c => {
      addSlider(`${c.key}-h`, c.label + (elliptical ? ' H' : ''), state[c.key].h, max);
      if (elliptical) addSlider(`${c.key}-v`, c.label + ' V', state[c.key].v, max);
    });
  }
}

function addSlider(id, label, value, max) {
  const row = document.createElement('div');
  row.className = 'slider-row';
  row.innerHTML = `
    <label>${label}</label>
    <input type="range" min="0" max="${max}" value="${value}" data-id="${id}">
    <span class="val"></span>`;
  const inp = row.querySelector('input');
  const val = row.querySelector('.val');
  val.textContent = `${value}${unitSelect.value}`;
  inp.addEventListener('input', () => {
    val.textContent = `${inp.value}${unitSelect.value}`;
    applyChange(id, parseInt(inp.value, 10));
  });
  slidersWrap.appendChild(row);
}

function applyChange(id, v) {
  const elliptical = ellipticalOpt.checked;
  const linked = linkAll.checked;
  if (linked) {
    const axis = id === 'all-h' ? 'h' : 'v';
    CORNERS.forEach(c => {
      state[c.key][axis] = v;
      if (!elliptical) state[c.key].v = v;
    });
  } else {
    const [k, axis] = id.split('-');
    state[k][axis] = v;
    if (!elliptical) state[k].v = v;
  }
  update();
}

function update() {
  const u = unitSelect.value;
  const elliptical = ellipticalOpt.checked;
  let css;
  if (elliptical) {
    const h = CORNERS.map(c => `${state[c.key].h}${u}`).join(' ');
    const v = CORNERS.map(c => `${state[c.key].v}${u}`).join(' ');
    css = `${h} / ${v}`;
  } else {
    css = CORNERS.map(c => `${state[c.key].h}${u}`).join(' ');
  }
  radBox.style.borderRadius = css;
  codeOut.textContent = `border-radius: ${css};`;
}

linkAll.addEventListener('change', () => { renderSliders(); update(); });
ellipticalOpt.addEventListener('change', () => { renderSliders(); update(); });
unitSelect.addEventListener('change', () => {
  // when switching units, clamp values to new max
  const max = unitSelect.value === 'px' ? 200 : 100;
  CORNERS.forEach(c => {
    state[c.key].h = Math.min(state[c.key].h, max);
    state[c.key].v = Math.min(state[c.key].v, max);
  });
  renderSliders(); update();
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(codeOut.textContent);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

renderSliders();
update();
