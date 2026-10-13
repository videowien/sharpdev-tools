/**
 * Inflation Calculator — compound, forward or backward
 */

let dir = 'forward';
const amountEl = document.getElementById('amount');
const yearsEl = document.getElementById('years');
const rateEl = document.getElementById('rate');
const curEl = document.getElementById('currency');
const amountLabel = document.getElementById('amount-label');
const resultLabel = document.getElementById('result-label');

document.querySelectorAll('[data-dir]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-dir]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    dir = btn.dataset.dir;
    amountLabel.textContent = dir === 'forward' ? 'Amount today' : 'Amount in the past';
    resultLabel.textContent = dir === 'forward' ? 'Future value' : "Today's equivalent";
    calc();
  });
});

[amountEl, yearsEl, rateEl, curEl].forEach(el => el.addEventListener('input', calc));

function calc() {
  const amount = parseFloat(amountEl.value) || 0;
  const years = Math.max(1, parseInt(yearsEl.value, 10) || 1);
  const rate = (parseFloat(rateEl.value) || 0) / 100;
  const cur = curEl.value;

  let result, totalInflation;
  if (dir === 'forward') {
    // FV = PV * (1 + r)^n
    result = amount * Math.pow(1 + rate, years);
    totalInflation = ((result / amount) - 1) * 100;
  } else {
    // Today's equivalent = past * (1 + r)^n
    result = amount * Math.pow(1 + rate, years);
    totalInflation = ((result / amount) - 1) * 100;
  }

  document.getElementById('r-result').textContent = cur + Math.round(result).toLocaleString();
  document.getElementById('r-total').textContent = totalInflation.toFixed(1) + '%';
  // Purchasing power lost: 1 - 1/multiplier
  const multiplier = Math.pow(1 + rate, years);
  const lost = (1 - 1 / multiplier) * 100;
  document.getElementById('r-lost').textContent = lost.toFixed(1) + '%';
}

calc();
