/**
 * Add/Subtract Days from Date
 */

let op = 'add';
const startEl = document.getElementById('start');
const amountEl = document.getElementById('amount');
const unitEl = document.getElementById('unit');

// Default to today
const today = new Date();
startEl.value = toISO(today);

document.querySelectorAll('[data-op]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-op]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    op = btn.dataset.op;
    calc();
  });
});
[startEl, amountEl, unitEl].forEach(el => el.addEventListener('input', calc));

function calc() {
  const start = new Date(startEl.value);
  if (isNaN(start)) { clear(); return; }
  let amount = Math.max(0, parseInt(amountEl.value, 10) || 0);
  if (op === 'sub') amount = -amount;
  const unit = unitEl.value;
  const result = new Date(start);

  if (unit === 'days') {
    result.setDate(result.getDate() + amount);
  } else if (unit === 'weeks') {
    result.setDate(result.getDate() + amount * 7);
  } else if (unit === 'months') {
    result.setMonth(result.getMonth() + amount);
  } else if (unit === 'years') {
    result.setFullYear(result.getFullYear() + amount);
  } else if (unit === 'business-days') {
    // Step forward or backward day-by-day, only counting weekdays
    let remaining = Math.abs(amount);
    const dir = amount >= 0 ? 1 : -1;
    while (remaining > 0) {
      result.setDate(result.getDate() + dir);
      const day = result.getDay();
      if (day !== 0 && day !== 6) remaining--;
    }
  }

  document.getElementById('r-date').textContent = fmtDate(result);
  document.getElementById('r-weekday').textContent = result.toLocaleDateString(undefined, { weekday: 'long' });
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const result0 = new Date(result); result0.setHours(0, 0, 0, 0);
  const diff = Math.round((result0 - today) / 86400000);
  document.getElementById('r-diff').textContent = (diff >= 0 ? '+' : '') + diff;
  document.getElementById('r-iso').textContent = toISO(result);
}

function clear() {
  ['r-date', 'r-weekday', 'r-diff', 'r-iso'].forEach(id => document.getElementById(id).textContent = '—');
}

function toISO(d) { return d.toISOString().slice(0, 10); }
function fmtDate(d) {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

calc();
