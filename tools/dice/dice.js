/**
 * Dice Roller — D4 through D100, plus D&D-style notation (NdS+/-M).
 * Uses crypto.getRandomValues for unbiased randomness.
 */
const QUICK_DICE = [4, 6, 8, 10, 12, 20, 100];
const MAX_DICE = 100;
const MAX_SIDES = 1000;

const quickEl = document.getElementById('quick-dice');
const notationEl = document.getElementById('notation');
const rollBtn = document.getElementById('roll-btn');
const errEl = document.getElementById('notation-err');
const resultPanel = document.getElementById('result-panel');
const resultNotation = document.getElementById('result-notation');
const resultTotal = document.getElementById('result-total');
const resultDice = document.getElementById('result-dice');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const clearBtn = document.getElementById('clear-btn');

const history = [];

// Populate quick-roll buttons
QUICK_DICE.forEach(n => {
  const b = document.createElement('button');
  b.textContent = 'D' + n;
  b.type = 'button';
  b.addEventListener('click', () => doRoll({ count: 1, sides: n, mod: 0 }, `d${n}`));
  quickEl.appendChild(b);
});

// Unbiased integer in [1, sides] using crypto.getRandomValues + rejection sampling
function randomInt(sides) {
  const max = Math.floor(0xFFFFFFFF / sides) * sides;
  const buf = new Uint32Array(1);
  while (true) {
    crypto.getRandomValues(buf);
    if (buf[0] < max) return (buf[0] % sides) + 1;
  }
}

function parseNotation(raw) {
  const s = raw.trim().toLowerCase().replace(/\s+/g, '');
  const m = s.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!m) return null;
  const count = m[1] === '' ? 1 : parseInt(m[1], 10);
  const sides = parseInt(m[2], 10);
  const mod = m[3] ? parseInt(m[3], 10) : 0;
  if (count < 1 || count > MAX_DICE) return { error: `Dice count must be between 1 and ${MAX_DICE}.` };
  if (sides < 2 || sides > MAX_SIDES) return { error: `Sides must be between 2 and ${MAX_SIDES}.` };
  return { count, sides, mod };
}

function formatNotation(count, sides, mod) {
  let s = count + 'd' + sides;
  if (mod > 0) s += '+' + mod;
  else if (mod < 0) s += mod; // negative sign already there
  return s;
}

function doRoll(spec, notationLabel) {
  const { count, sides, mod } = spec;
  const rolls = Array.from({ length: count }, () => randomInt(sides));
  const subtotal = rolls.reduce((a, b) => a + b, 0);
  const total = subtotal + mod;
  const label = notationLabel || formatNotation(count, sides, mod);

  // Render result
  resultPanel.style.display = 'block';
  resultNotation.textContent = label;
  resultTotal.textContent = total;
  resultDice.innerHTML = '';
  rolls.forEach(r => {
    const chip = document.createElement('span');
    chip.className = 'die-chip';
    if (r === sides) chip.classList.add('max');
    if (r === 1 && sides > 2) chip.classList.add('min');
    chip.textContent = r;
    resultDice.appendChild(chip);
  });
  if (mod !== 0) {
    const modChip = document.createElement('span');
    modChip.className = 'die-chip mod';
    modChip.textContent = (mod > 0 ? '+' : '') + mod;
    resultDice.appendChild(modChip);
  }

  // Update history (keep last 15)
  history.unshift({ label, rolls, mod, total });
  if (history.length > 15) history.pop();
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyPanel.style.display = 'none';
    return;
  }
  historyPanel.style.display = 'block';
  historyList.innerHTML = '';
  history.forEach(h => {
    const item = document.createElement('div');
    item.className = 'history-item';
    const left = document.createElement('span');
    left.className = 'h-left';
    const detail = h.rolls.join(', ') + (h.mod ? (h.mod > 0 ? ' +' + h.mod : ' ' + h.mod) : '');
    left.textContent = `${h.label}  [${detail}]`;
    const right = document.createElement('span');
    right.className = 'h-right';
    right.textContent = h.total;
    item.appendChild(left);
    item.appendChild(right);
    historyList.appendChild(item);
  });
}

rollBtn.addEventListener('click', () => {
  const raw = notationEl.value;
  if (!raw.trim()) { errEl.textContent = 'Enter a dice expression like 3d6+2.'; return; }
  const res = parseNotation(raw);
  if (!res) { errEl.textContent = 'Invalid notation. Use NdS or NdS+M / NdS-M.'; return; }
  if (res.error) { errEl.textContent = res.error; return; }
  errEl.textContent = '';
  doRoll(res);
});

notationEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); rollBtn.click(); }
});

clearBtn.addEventListener('click', () => {
  history.length = 0;
  renderHistory();
});
