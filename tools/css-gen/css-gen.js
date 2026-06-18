/**
 * CSS Generator — SharpDev Tools
 */

// ---- Tabs ----
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('panel-' + t.dataset.tab).classList.add('active');
  });
});

// ============ GRADIENT ============
let gType = 'linear';
let stops = [
  { color: '#ff4444', pos: 0 },
  { color: '#ff8844', pos: 100 },
];

function renderStops() {
  const wrap = document.getElementById('grad-stops');
  wrap.innerHTML = '';
  stops.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'stop-row';
    row.innerHTML =
      '<input type="color" value="' + s.color + '" data-i="' + i + '" class="stop-color">' +
      '<input type="range" min="0" max="100" value="' + s.pos + '" data-i="' + i + '" class="stop-pos">' +
      '<span class="stop-pct">' + s.pos + '%</span>' +
      '<button class="remove-btn" data-i="' + i + '">&times;</button>';
    wrap.appendChild(row);
  });
  wrap.querySelectorAll('.stop-color').forEach(el => {
    el.addEventListener('input', e => {
      stops[+e.target.dataset.i].color = e.target.value;
      updateGrad();
    });
  });
  wrap.querySelectorAll('.stop-pos').forEach(el => {
    el.addEventListener('input', e => {
      const i = +e.target.dataset.i;
      stops[i].pos = +e.target.value;
      e.target.parentElement.querySelector('.stop-pct').textContent = stops[i].pos + '%';
      updateGrad();
    });
  });
  wrap.querySelectorAll('.remove-btn').forEach(el => {
    el.addEventListener('click', e => {
      const i = +e.target.dataset.i;
      if (stops.length > 2) { stops.splice(i, 1); renderStops(); updateGrad(); }
    });
  });
}
function addStop() {
  const last = stops[stops.length - 1];
  stops.push({ color: last.color, pos: 100 });
  renderStops(); updateGrad();
}

function buildGradientCSS() {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const stopStr = sorted.map(s => s.color + ' ' + s.pos + '%').join(', ');
  if (gType === 'linear') {
    const ang = document.getElementById('grad-angle').value;
    return 'linear-gradient(' + ang + 'deg, ' + stopStr + ')';
  } else if (gType === 'radial') {
    const shape = document.getElementById('grad-radial-shape').value;
    const size = document.getElementById('grad-radial-size').value;
    const pos = document.getElementById('grad-radial-pos').value;
    return 'radial-gradient(' + shape + ' ' + size + ' at ' + pos + ', ' + stopStr + ')';
  } else {
    const from = document.getElementById('grad-from').value;
    const pos = document.getElementById('grad-conic-pos').value;
    return 'conic-gradient(from ' + from + 'deg at ' + pos + ', ' + stopStr + ')';
  }
}

function updateGrad() {
  const css = buildGradientCSS();
  document.getElementById('grad-preview').style.background = css;
  document.getElementById('grad-code').textContent = 'background: ' + css + ';';
}

document.querySelectorAll('[data-gtype]').forEach(b => {
  b.addEventListener('click', () => {
    gType = b.dataset.gtype;
    document.querySelectorAll('[data-gtype]').forEach(x => x.classList.toggle('active', x === b));
    document.getElementById('grad-linear-opts').style.display = gType === 'linear' ? '' : 'none';
    document.getElementById('grad-radial-opts').style.display = gType === 'radial' ? '' : 'none';
    document.getElementById('grad-conic-opts').style.display = gType === 'conic' ? '' : 'none';
    updateGrad();
  });
});

document.getElementById('grad-angle').addEventListener('input', e => {
  document.getElementById('grad-angle-val').textContent = e.target.value + 'deg';
  updateGrad();
});
document.getElementById('grad-from').addEventListener('input', e => {
  document.getElementById('grad-from-val').textContent = e.target.value + 'deg';
  updateGrad();
});
['grad-radial-shape', 'grad-radial-size', 'grad-radial-pos', 'grad-conic-pos'].forEach(id => {
  document.getElementById(id).addEventListener('change', updateGrad);
});

renderStops();
updateGrad();

// ============ BOX SHADOW ============
let shadows = [
  { x: 0, y: 10, blur: 20, spread: 0, color: '#000000', opacity: 0.4, inset: false },
];

function renderShadows() {
  const wrap = document.getElementById('shadow-list');
  wrap.innerHTML = '';
  shadows.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'shadow-row';
    row.innerHTML =
      '<div><label>X</label><input type="number" value="' + s.x + '" data-f="x" data-i="' + i + '"></div>' +
      '<div><label>Y</label><input type="number" value="' + s.y + '" data-f="y" data-i="' + i + '"></div>' +
      '<div><label>Blur</label><input type="number" min="0" value="' + s.blur + '" data-f="blur" data-i="' + i + '"></div>' +
      '<div><label>Spread</label><input type="number" value="' + s.spread + '" data-f="spread" data-i="' + i + '"></div>' +
      '<button class="remove-btn" data-i="' + i + '">&times;</button>' +
      '<div class="full">' +
        '<input type="color" value="' + s.color + '" data-f="color" data-i="' + i + '">' +
        '<label style="margin:0; text-transform:none; letter-spacing:0; font-size:12px">Opacity <input type="range" min="0" max="1" step="0.05" value="' + s.opacity + '" data-f="opacity" data-i="' + i + '" style="width:100px; vertical-align:middle"></label>' +
        '<label class="inset-toggle"><input type="checkbox" data-f="inset" data-i="' + i + '"' + (s.inset ? ' checked' : '') + '> inset</label>' +
      '</div>';
    wrap.appendChild(row);
  });
  wrap.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', e => {
      const i = +e.target.dataset.i;
      const f = e.target.dataset.f;
      const v = e.target.type === 'checkbox' ? e.target.checked : (e.target.type === 'color' ? e.target.value : +e.target.value);
      shadows[i][f] = v;
      updateShadow();
    });
  });
  wrap.querySelectorAll('.remove-btn').forEach(el => {
    el.addEventListener('click', e => {
      const i = +e.target.dataset.i;
      if (shadows.length > 1) { shadows.splice(i, 1); renderShadows(); updateShadow(); }
      else { shadows.splice(i, 1); renderShadows(); updateShadow(); }
    });
  });
}
function addShadow() {
  shadows.push({ x: 0, y: 4, blur: 10, spread: 0, color: '#000000', opacity: 0.3, inset: false });
  renderShadows(); updateShadow();
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function buildShadowCSS() {
  if (!shadows.length) return 'none';
  return shadows.map(s =>
    (s.inset ? 'inset ' : '') + s.x + 'px ' + s.y + 'px ' + s.blur + 'px ' + s.spread + 'px ' + hexToRgba(s.color, s.opacity)
  ).join(', ');
}

function updateShadow() {
  const css = buildShadowCSS();
  document.getElementById('shadow-card').style.boxShadow = css;
  document.getElementById('shadow-preview-wrap').style.background = document.getElementById('shadow-bg').value;
  document.getElementById('shadow-code').textContent = 'box-shadow: ' + css + ';';
}

document.getElementById('shadow-bg').addEventListener('input', updateShadow);

renderShadows();
updateShadow();

// ============ BORDER RADIUS ============
let radiusMode = 'simple';
document.querySelectorAll('[data-rmode]').forEach(b => {
  b.addEventListener('click', () => {
    radiusMode = b.dataset.rmode;
    document.querySelectorAll('[data-rmode]').forEach(x => x.classList.toggle('active', x === b));
    document.getElementById('radius-simple-opts').style.display = radiusMode === 'simple' ? '' : 'none';
    document.getElementById('radius-advanced-opts').style.display = radiusMode === 'advanced' ? '' : 'none';
    updateRadius();
  });
});

['r-all'].forEach(id => {
  document.getElementById(id).addEventListener('input', e => {
    document.getElementById(id + '-val').textContent = e.target.value + 'px';
    updateRadius();
  });
});
document.querySelectorAll('.r-adv').forEach(el => {
  el.addEventListener('input', e => {
    document.getElementById(e.target.id + '-val').textContent = e.target.value + 'px';
    updateRadius();
  });
});
document.getElementById('r-color').addEventListener('input', updateRadius);

function updateRadius() {
  const shape = document.getElementById('radius-shape');
  shape.style.background = document.getElementById('r-color').value;
  let css;
  if (radiusMode === 'simple') {
    const v = document.getElementById('r-all').value + 'px';
    css = v;
    shape.style.borderRadius = css;
  } else {
    const tlx = document.getElementById('r-tl-x').value;
    const tly = document.getElementById('r-tl-y').value;
    const trx = document.getElementById('r-tr-x').value;
    const trY = document.getElementById('r-tr-y').value;
    const brx = document.getElementById('r-br-x').value;
    const bry = document.getElementById('r-br-y').value;
    const blx = document.getElementById('r-bl-x').value;
    const bly = document.getElementById('r-bl-y').value;
    const xs = [tlx, trx, brx, blx].map(v => v + 'px').join(' ');
    const ys = [tly, trY, bry, bly].map(v => v + 'px').join(' ');
    css = xs + ' / ' + ys;
    shape.style.borderRadius = css;
  }
  document.getElementById('radius-code').textContent = 'border-radius: ' + css + ';';
}

updateRadius();

// ============ Copy helper ============
function copyCode(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text);
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = orig, 900);
}
