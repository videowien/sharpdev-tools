/**
 * ROI Calculator — total + annualised return
 */

const initialEl = document.getElementById('initial');
const finalEl = document.getElementById('final');
const yearsEl = document.getElementById('years');
const curEl = document.getElementById('currency');
const curMirror = document.getElementById('cur-mirror');

curEl.addEventListener('change', () => { curMirror.textContent = curEl.value; calc(); });
[initialEl, finalEl, yearsEl].forEach(el => el.addEventListener('input', calc));

function calc() {
  const initial = parseFloat(initialEl.value) || 0;
  const final = parseFloat(finalEl.value) || 0;
  const years = Math.max(0.001, parseFloat(yearsEl.value) || 0.001);
  const cur = curEl.value;

  if (initial <= 0) { ['r-roi', 'r-profit', 'r-annual'].forEach(id => document.getElementById(id).textContent = '—'); return; }

  const profit = final - initial;
  const roi = (profit / initial) * 100;
  const annual = (Math.pow(final / initial, 1 / years) - 1) * 100;

  const roiEl = document.getElementById('r-roi');
  const profitEl = document.getElementById('r-profit');
  const annualEl = document.getElementById('r-annual');

  roiEl.textContent = (roi >= 0 ? '+' : '') + roi.toFixed(1) + '%';
  roiEl.className = 'result-value ' + (roi >= 0 ? 'pos' : 'neg');
  profitEl.textContent = (profit >= 0 ? '+' : '−') + cur + Math.abs(profit).toLocaleString(undefined, { maximumFractionDigits: 0 });
  profitEl.className = 'result-value ' + (profit >= 0 ? 'pos' : 'neg');
  annualEl.textContent = (annual >= 0 ? '+' : '') + annual.toFixed(2) + '%';
  annualEl.className = 'result-value ' + (annual >= 0 ? 'pos' : 'neg');
}

calc();
