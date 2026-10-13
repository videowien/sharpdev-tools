/**
 * Clip-path Generator — polygon shapes library with drag-to-edit vertices.
 * All coordinates are percentages so shapes scale with the element.
 */
const SHAPES = [
  { id: 'triangle',   name: 'Triangle',   pts: [[50,0],[100,100],[0,100]] },
  { id: 'right-tri',  name: 'Right tri',  pts: [[0,0],[100,100],[0,100]] },
  { id: 'trapezoid',  name: 'Trapezoid',  pts: [[20,0],[80,0],[100,100],[0,100]] },
  { id: 'rhombus',    name: 'Rhombus',    pts: [[50,0],[100,50],[50,100],[0,50]] },
  { id: 'pentagon',   name: 'Pentagon',   pts: [[50,0],[100,38],[82,100],[18,100],[0,38]] },
  { id: 'hexagon',    name: 'Hexagon',    pts: [[25,0],[75,0],[100,50],[75,100],[25,100],[0,50]] },
  { id: 'heptagon',   name: 'Heptagon',   pts: [[50,0],[90,20],[100,60],[75,100],[25,100],[0,60],[10,20]] },
  { id: 'octagon',    name: 'Octagon',    pts: [[30,0],[70,0],[100,30],[100,70],[70,100],[30,100],[0,70],[0,30]] },
  { id: 'star',       name: 'Star',       pts: [[50,0],[61,35],[98,35],[68,57],[79,91],[50,70],[21,91],[32,57],[2,35],[39,35]] },
  { id: 'plus',       name: 'Plus',       pts: [[35,0],[65,0],[65,35],[100,35],[100,65],[65,65],[65,100],[35,100],[35,65],[0,65],[0,35],[35,35]] },
  { id: 'arrow-r',    name: 'Arrow \u2192',pts: [[0,20],[60,20],[60,0],[100,50],[60,100],[60,80],[0,80]] },
  { id: 'arrow-l',    name: 'Arrow \u2190',pts: [[40,0],[40,20],[100,20],[100,80],[40,80],[40,100],[0,50]] },
  { id: 'chevron-r',  name: 'Chevron \u203A', pts: [[75,0],[100,50],[75,100],[25,100],[50,50],[25,0]] },
  { id: 'parallelo',  name: 'Paralle.',   pts: [[25,0],[100,0],[75,100],[0,100]] },
  { id: 'message',    name: 'Chat',       pts: [[0,0],[100,0],[100,75],[75,75],[75,100],[50,75],[0,75]] },
  { id: 'inset',      name: 'Inset',      kind: 'inset' },
  { id: 'circle',     name: 'Circle',     kind: 'circle' },
  { id: 'ellipse',    name: 'Ellipse',    kind: 'ellipse' },
];

const grid = document.getElementById('cp-shape-grid');
const preview = document.getElementById('cp-preview');
const handlesEl = document.getElementById('cp-handles');
const previewWrap = document.getElementById('cp-preview-wrap');
const codeOut = document.getElementById('code-out');
const copyBtn = document.getElementById('copy-btn');

let current = null;       // current shape (either {pts:[]} clone or {kind})

function buildClip(shape) {
  if (!shape) return '';
  if (shape.pts) {
    const pts = shape.pts.map(([x, y]) => `${round(x)}% ${round(y)}%`).join(', ');
    return `polygon(${pts})`;
  }
  switch (shape.kind) {
    case 'circle':  return 'circle(50% at 50% 50%)';
    case 'ellipse': return 'ellipse(50% 35% at 50% 50%)';
    case 'inset':   return 'inset(10% 15% 10% 15% round 12px)';
  }
  return '';
}
function round(n) { return Math.round(n * 100) / 100; }

function renderShapePicker() {
  grid.innerHTML = '';
  SHAPES.forEach(s => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cp-shape-btn';
    btn.innerHTML = `<div class="cp-shape-fill"></div><div class="cp-shape-name">${s.name}</div>`;
    btn.querySelector('.cp-shape-fill').style.clipPath = buildClip(s);
    btn.addEventListener('click', () => {
      applyShape(s);
      [...grid.children].forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
    });
    grid.appendChild(btn);
  });
}

function applyShape(shape) {
  if (shape.pts) {
    current = { pts: shape.pts.map(p => [...p]) }; // clone
  } else {
    current = { kind: shape.kind };
  }
  update();
  renderHandles();
}

function update() {
  const css = buildClip(current);
  preview.style.clipPath = css;
  codeOut.textContent = `clip-path: ${css};`;
}

function renderHandles() {
  handlesEl.innerHTML = '';
  if (!current || !current.pts) return;
  current.pts.forEach((pt, i) => {
    const h = document.createElement('div');
    h.className = 'cp-handle';
    h.style.left = pt[0] + '%';
    h.style.top = pt[1] + '%';
    h.addEventListener('pointerdown', e => startDrag(e, i, h));
    handlesEl.appendChild(h);
  });
}

function startDrag(e, idx, h) {
  e.preventDefault();
  h.setPointerCapture(e.pointerId);
  const rect = previewWrap.getBoundingClientRect();
  const onMove = ev => {
    const x = Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((ev.clientY - rect.top) / rect.height) * 100));
    current.pts[idx] = [x, y];
    h.style.left = x + '%';
    h.style.top = y + '%';
    update();
  };
  const onUp = () => {
    h.removeEventListener('pointermove', onMove);
    h.removeEventListener('pointerup', onUp);
    h.releasePointerCapture(e.pointerId);
  };
  h.addEventListener('pointermove', onMove);
  h.addEventListener('pointerup', onUp);
}

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(codeOut.textContent);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

renderShapePicker();
applyShape(SHAPES[5]); // default hexagon
grid.children[5].classList.add('active');
