/**
 * JSON Diff — SharpDev Tools
 */

const origEl = document.getElementById('orig');
const updEl = document.getElementById('upd');
const errOrigEl = document.getElementById('err-orig');
const errUpdEl = document.getElementById('err-upd');
const outputWrap = document.getElementById('output-wrap');
const statsBar = document.getElementById('stats-bar');
const diffList = document.getElementById('diff-list');
const optSort = document.getElementById('opt-sort');
const optUnchanged = document.getElementById('opt-unchanged');

const SAMPLE_A = `{
  "name": "Alice",
  "age": 30,
  "city": "Berlin",
  "hobbies": ["reading", "hiking"],
  "profile": {
    "verified": true,
    "score": 87
  }
}`;

const SAMPLE_B = `{
  "name": "Alice",
  "age": 31,
  "country": "Germany",
  "hobbies": ["reading", "cooking"],
  "profile": {
    "verified": true,
    "score": 92,
    "premium": true
  }
}`;

function loadSample() {
  origEl.value = SAMPLE_A;
  updEl.value = SAMPLE_B;
  runDiff();
}

function clearAll() {
  origEl.value = '';
  updEl.value = '';
  errOrigEl.textContent = '';
  errUpdEl.textContent = '';
  outputWrap.style.display = 'none';
}

function swap() {
  const a = origEl.value;
  origEl.value = updEl.value;
  updEl.value = a;
  if (outputWrap.style.display !== 'none') runDiff();
}

function sortKeysDeep(val) {
  if (val === null) return val;
  if (Array.isArray(val)) return val.map(sortKeysDeep);
  if (typeof val === 'object') {
    const out = {};
    for (const k of Object.keys(val).sort()) out[k] = sortKeysDeep(val[k]);
    return out;
  }
  return val;
}

function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }

function fmtPath(parts) {
  let s = '';
  for (const p of parts) {
    if (typeof p === 'number') s += '[' + p + ']';
    else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(p)) s += (s ? '.' : '') + p;
    else s += '["' + p.replace(/"/g, '\\"') + '"]';
  }
  return s || '(root)';
}

function fmtVal(v) {
  return JSON.stringify(v);
}

function diff(a, b, path, out) {
  if (a === b) {
    out.push({ type: 'unchanged', path: [...path], before: a, after: b });
    return;
  }
  if (isObj(a) && isObj(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (!(k in a)) {
        out.push({ type: 'added', path: [...path, k], after: b[k] });
      } else if (!(k in b)) {
        out.push({ type: 'removed', path: [...path, k], before: a[k] });
      } else {
        diff(a[k], b[k], [...path, k], out);
      }
    }
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      if (i >= a.length) out.push({ type: 'added', path: [...path, i], after: b[i] });
      else if (i >= b.length) out.push({ type: 'removed', path: [...path, i], before: a[i] });
      else diff(a[i], b[i], [...path, i], out);
    }
    return;
  }
  // Both primitives (or one is primitive, other container — treat as change)
  const eq = JSON.stringify(a) === JSON.stringify(b);
  if (eq) {
    out.push({ type: 'unchanged', path: [...path], before: a, after: b });
  } else {
    out.push({ type: 'changed', path: [...path], before: a, after: b });
  }
}

function tryParse(text, label, errEl) {
  errEl.textContent = '';
  if (!text.trim()) {
    errEl.textContent = label + ' is empty';
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    errEl.textContent = label + ' invalid: ' + e.message;
    return null;
  }
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let lastDiff = [];

function runDiff() {
  const a = tryParse(origEl.value, 'Original', errOrigEl);
  const b = tryParse(updEl.value, 'Updated', errUpdEl);
  if (a === null || b === null) {
    outputWrap.style.display = 'none';
    return;
  }
  const A = optSort.checked ? sortKeysDeep(a) : a;
  const B = optSort.checked ? sortKeysDeep(b) : b;
  const out = [];
  diff(A, B, [], out);
  lastDiff = out;
  render();
}

function render() {
  const showUnchanged = optUnchanged.checked;
  const counts = { added: 0, removed: 0, changed: 0, unchanged: 0 };
  for (const d of lastDiff) counts[d.type]++;

  statsBar.innerHTML =
    '<span class="pill added"><span class="dot"></span>' + counts.added + ' added</span>' +
    '<span class="pill removed"><span class="dot"></span>' + counts.removed + ' removed</span>' +
    '<span class="pill changed"><span class="dot"></span>' + counts.changed + ' changed</span>' +
    '<span class="pill unchanged"><span class="dot"></span>' + counts.unchanged + ' unchanged</span>';

  const rows = [];
  for (const d of lastDiff) {
    if (d.type === 'unchanged' && !showUnchanged) continue;
    const path = escHtml(fmtPath(d.path));
    if (d.type === 'added') {
      rows.push('<div class="diff-row added"><span class="sign">+</span><div class="body"><span class="path">' + path + '</span> <span class="val">' + escHtml(fmtVal(d.after)) + '</span></div></div>');
    } else if (d.type === 'removed') {
      rows.push('<div class="diff-row removed"><span class="sign">-</span><div class="body"><span class="path">' + path + '</span> <span class="val">' + escHtml(fmtVal(d.before)) + '</span></div></div>');
    } else if (d.type === 'changed') {
      rows.push('<div class="diff-row changed"><span class="sign">~</span><div class="body"><span class="path">' + path + '</span> <span class="val-old">' + escHtml(fmtVal(d.before)) + '</span><span class="arrow">&rarr;</span><span class="val-new">' + escHtml(fmtVal(d.after)) + '</span></div></div>');
    } else {
      rows.push('<div class="diff-row unchanged"><span class="sign">=</span><div class="body"><span class="path">' + path + '</span> <span class="val">' + escHtml(fmtVal(d.after)) + '</span></div></div>');
    }
  }
  diffList.innerHTML = rows.length ? rows.join('') : '<div class="empty-msg">No differences' + (showUnchanged ? '' : ' (enable "Show unchanged" to see all paths)') + '.</div>';
  outputWrap.style.display = 'block';
}

function copyDiff() {
  if (!lastDiff.length) return;
  const lines = [];
  const showUnchanged = optUnchanged.checked;
  for (const d of lastDiff) {
    if (d.type === 'unchanged' && !showUnchanged) continue;
    const path = fmtPath(d.path);
    if (d.type === 'added') lines.push('+ ' + path + ' ' + fmtVal(d.after));
    else if (d.type === 'removed') lines.push('- ' + path + ' ' + fmtVal(d.before));
    else if (d.type === 'changed') lines.push('~ ' + path + ' ' + fmtVal(d.before) + ' -> ' + fmtVal(d.after));
    else lines.push('= ' + path + ' ' + fmtVal(d.after));
  }
  navigator.clipboard.writeText(lines.join('\n'));
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = orig, 900);
}

optSort.addEventListener('change', () => {
  if (outputWrap.style.display !== 'none') runDiff();
});
optUnchanged.addEventListener('change', () => {
  if (outputWrap.style.display !== 'none') render();
});

loadSample();
