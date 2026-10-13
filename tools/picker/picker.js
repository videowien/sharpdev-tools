/**
 * Random Picker — SharpDev Tools
 * Uses crypto.getRandomValues for true randomness.
 */

const history = [];
const MAX_HISTORY = 10;

function secureRandomInt(max) {
  // Returns integer in [0, max)
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  let r;
  do { crypto.getRandomValues(arr); r = arr[0]; } while (r >= limit);
  return r % max;
}

function secureRandomIntRange(min, max) {
  // Integer in [min, max] inclusive
  return min + secureRandomInt(max - min + 1);
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.getElementById('panel-names').style.display = name === 'names' ? 'block' : 'none';
  document.getElementById('panel-number').style.display = name === 'number' ? 'block' : 'none';
  document.getElementById('panel-coin').style.display = name === 'coin' ? 'block' : 'none';
}

function pickNames() {
  const raw = document.getElementById('names-in').value;
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const count = Math.max(1, parseInt(document.getElementById('pick-count').value) || 1);
  const noRepeats = document.getElementById('no-repeats').checked;
  const resultEl = document.getElementById('names-result');

  if (lines.length === 0) {
    resultEl.innerHTML = '<div class="result-label">Enter at least one item</div>';
    return;
  }

  const effectiveCount = noRepeats ? Math.min(count, lines.length) : count;
  const picks = [];
  const pool = lines.slice();

  for (let i = 0; i < effectiveCount; i++) {
    if (noRepeats) {
      const idx = secureRandomInt(pool.length);
      picks.push(pool[idx]);
      pool.splice(idx, 1);
    } else {
      picks.push(lines[secureRandomInt(lines.length)]);
    }
  }

  resultEl.innerHTML = picks.map(p => `<div class="result-chip">${escHtml(p)}</div>`).join('');
  addHistory(`Picked ${picks.length} of ${lines.length}: ${picks.join(', ')}`);
}

function pickNumber() {
  const min = parseInt(document.getElementById('num-min').value);
  const max = parseInt(document.getElementById('num-max').value);
  const count = Math.max(1, parseInt(document.getElementById('num-count').value) || 1);
  const noRepeats = document.getElementById('num-no-repeats').checked;
  const resultEl = document.getElementById('number-result');

  if (isNaN(min) || isNaN(max)) {
    resultEl.innerHTML = '<div class="result-label">Enter valid min and max</div>';
    return;
  }
  if (min > max) {
    resultEl.innerHTML = '<div class="result-label">Min must be ≤ Max</div>';
    return;
  }

  const range = max - min + 1;
  if (noRepeats && count > range) {
    resultEl.innerHTML = '<div class="result-label">Can\'t pick more unique numbers than the range allows</div>';
    return;
  }

  const picks = [];
  const used = new Set();
  while (picks.length < count) {
    const n = secureRandomIntRange(min, max);
    if (noRepeats) {
      if (used.has(n)) continue;
      used.add(n);
    }
    picks.push(n);
  }

  if (count === 1) {
    resultEl.innerHTML = `<div><div class="result-big">${picks[0]}</div><div class="result-label">Between ${min} and ${max}</div></div>`;
  } else {
    resultEl.innerHTML = picks.map(p => `<div class="result-chip">${p}</div>`).join('');
  }
  addHistory(`${count} number${count !== 1 ? 's' : ''} [${min}–${max}]: ${picks.join(', ')}`);
}

function flipCoin() {
  const result = secureRandomInt(2) === 0 ? 'Heads' : 'Tails';
  document.getElementById('coin-result').innerHTML =
    `<div><div class="result-big">${result}</div><div class="result-label">Coin flip</div></div>`;
  addHistory(`Coin: ${result}`);
}

function rollDice(sides) {
  const n = secureRandomIntRange(1, sides);
  document.getElementById('coin-result').innerHTML =
    `<div><div class="result-big">${n}</div><div class="result-label">d${sides} roll</div></div>`;
  addHistory(`d${sides}: ${n}`);
}

function rollMultiple() {
  const a = secureRandomIntRange(1, 6);
  const b = secureRandomIntRange(1, 6);
  document.getElementById('coin-result').innerHTML =
    `<div style="text-align:center"><div class="result-big">${a + b}</div><div class="result-label">2d6 = ${a} + ${b}</div></div>`;
  addHistory(`2d6: ${a} + ${b} = ${a + b}`);
}

function addHistory(text) {
  history.unshift(text);
  if (history.length > MAX_HISTORY) history.pop();
  renderHistory();
}

function renderHistory() {
  const card = document.getElementById('history-card');
  const el = document.getElementById('history');
  if (history.length === 0) { card.style.display = 'none'; return; }
  card.style.display = 'block';
  el.innerHTML = history.map(h => `<div class="history-row">${escHtml(h)}</div>`).join('');
}

function clearHistory() {
  history.length = 0;
  renderHistory();
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
