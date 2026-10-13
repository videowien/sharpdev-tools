/**
 * JSONPath Tester — minimal implementation
 */

const queryEl = document.getElementById('query');
const inputEl = document.getElementById('input');
const output = document.getElementById('output');
const resultCount = document.getElementById('result-count');
const statusMsg = document.getElementById('status-msg');

inputEl.value = JSON.stringify({
  store: {
    book: [
      { category: 'reference', author: 'Nigel Rees', title: 'Sayings of the Century', price: 8.95 },
      { category: 'fiction', author: 'Evelyn Waugh', title: 'Sword of Honour', price: 12.99 },
      { category: 'fiction', author: 'Herman Melville', title: 'Moby Dick', isbn: '0-553-21311-3', price: 8.99 },
      { category: 'fiction', author: 'J. R. R. Tolkien', title: 'The Lord of the Rings', isbn: '0-395-19395-8', price: 22.99 }
    ],
    bicycle: { color: 'red', price: 19.95 }
  }
}, null, 2);

document.querySelectorAll('.preset').forEach(btn => {
  btn.addEventListener('click', () => { queryEl.value = btn.dataset.q; run(); });
});

[queryEl, inputEl].forEach(el => el.addEventListener('input', run));

/**
 * Mini JSONPath evaluator.
 * Supports: $, .prop, ['prop'], [n], [-n], [a:b:c], [*], .., [?(expr)], expr like @.foo > 10
 */
function jsonPath(data, expr) {
  if (!expr.startsWith('$')) throw new Error('Path must start with $');
  // Tokenise the path
  const tokens = tokenize(expr.slice(1));
  let nodes = [data];
  for (const t of tokens) nodes = applyToken(nodes, t);
  return nodes;
}

function tokenize(s) {
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '.') {
      if (s[i + 1] === '.') {
        tokens.push({ type: 'descend' });
        i += 2;
        // followed by identifier or *
        if (i < s.length && (/[\w*]/.test(s[i]))) {
          const m = s.slice(i).match(/^[\w*]+/);
          tokens.push({ type: 'name', value: m[0] });
          i += m[0].length;
        }
      } else {
        i++;
        // identifier
        const m = s.slice(i).match(/^[\w*]+/);
        if (!m) throw new Error('Expected name after .');
        tokens.push({ type: 'name', value: m[0] });
        i += m[0].length;
      }
    } else if (c === '[') {
      const end = s.indexOf(']', i);
      if (end < 0) throw new Error('Unclosed bracket');
      const inside = s.slice(i + 1, end);
      i = end + 1;
      if (inside === '*') tokens.push({ type: 'name', value: '*' });
      else if (inside.startsWith('?(') && inside.endsWith(')')) {
        tokens.push({ type: 'filter', expr: inside.slice(2, -1) });
      } else if (inside.startsWith("'") || inside.startsWith('"')) {
        // quoted prop
        tokens.push({ type: 'name', value: inside.slice(1, -1) });
      } else if (inside.includes(':')) {
        const parts = inside.split(':').map(p => p.trim() === '' ? null : parseInt(p, 10));
        tokens.push({ type: 'slice', start: parts[0], end: parts[1], step: parts[2] });
      } else {
        tokens.push({ type: 'index', value: parseInt(inside, 10) });
      }
    } else {
      throw new Error('Unexpected char: ' + c);
    }
  }
  return tokens;
}

function applyToken(nodes, t) {
  const out = [];
  for (const node of nodes) {
    if (t.type === 'name') {
      if (t.value === '*') {
        if (Array.isArray(node)) out.push(...node);
        else if (node && typeof node === 'object') out.push(...Object.values(node));
      } else if (node && typeof node === 'object' && t.value in node) {
        out.push(node[t.value]);
      }
    } else if (t.type === 'index') {
      if (Array.isArray(node)) {
        const idx = t.value < 0 ? node.length + t.value : t.value;
        if (idx >= 0 && idx < node.length) out.push(node[idx]);
      }
    } else if (t.type === 'slice') {
      if (Array.isArray(node)) {
        const len = node.length;
        const start = t.start == null ? 0 : (t.start < 0 ? len + t.start : t.start);
        const end = t.end == null ? len : (t.end < 0 ? len + t.end : t.end);
        const step = t.step == null ? 1 : t.step;
        for (let k = start; k < end; k += step) if (k >= 0 && k < len) out.push(node[k]);
      }
    } else if (t.type === 'filter') {
      if (Array.isArray(node)) {
        for (const item of node) if (evalFilter(t.expr, item)) out.push(item);
      } else if (node && typeof node === 'object') {
        for (const v of Object.values(node)) if (evalFilter(t.expr, v)) out.push(v);
      }
    } else if (t.type === 'descend') {
      // Walk the whole subtree
      const stack = [node];
      while (stack.length) {
        const n = stack.pop();
        out.push(n);
        if (Array.isArray(n)) stack.push(...n);
        else if (n && typeof n === 'object') stack.push(...Object.values(n));
      }
    }
  }
  return out;
}

function evalFilter(expr, item) {
  // Very limited safe eval. Replaces @ with item and evaluates simple comparisons.
  // Supported: ==, !=, <, <=, >, >=, &&, ||, !, parens
  // Property: @.foo or @['foo']
  try {
    const safe = expr
      .replace(/@\.([\w]+)/g, (_, p) => JSON.stringify(item?.[p] ?? null))
      .replace(/@\['([^']+)'\]/g, (_, p) => JSON.stringify(item?.[p] ?? null))
      .replace(/@/g, JSON.stringify(item));
    // Disallow anything other than JSON literals + operators
    if (!/^[\s\d.+\-*/<>=!&|()'"\w,:[\]{}]*$/.test(safe)) return false;
    return Function('"use strict";return (' + safe + ')')();
  } catch { return false; }
}

function run() {
  try {
    const data = JSON.parse(inputEl.value);
    const result = jsonPath(data, queryEl.value);
    output.textContent = JSON.stringify(result, null, 2);
    resultCount.textContent = `(${result.length} match${result.length === 1 ? '' : 'es'})`;
    output.style.color = '#4caf50';
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
    output.style.color = '#ff6666';
    resultCount.textContent = '';
  }
}

document.getElementById('format-btn').addEventListener('click', () => {
  try {
    const data = JSON.parse(inputEl.value);
    inputEl.value = JSON.stringify(data, null, 2);
    run();
  } catch (err) {
    flash('Invalid JSON', 'error');
  }
});
document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent);
  flash('✓ Copied', 'ok');
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg ' + cls;
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
}

run();
