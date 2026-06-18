/**
 * Savings Goal Calculator — solve for monthly amount OR months required
 */

let mode = 'monthly';

const targetEl = document.getElementById('target');
const startEl = document.getElementById('start');
const monthsInEl = document.getElementById('months-in');
const monthlyInEl = document.getElementById('monthly-in');
const rateEl = document.getElementById('rate');
const currencyEl = document.getElementById('currency');

document.querySelectorAll('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    document.querySelector('.mode-monthly').style.display = mode === 'monthly' ? '' : 'none';
    document.querySelector('.mode-months').style.display = mode === 'months' ? '' : 'none';
    document.getElementById('result-label').textContent = mode === 'monthly' ? 'Monthly amount needed' : 'Months required';
    calc();
  });
});

[targetEl, startEl, monthsInEl, monthlyInEl, rateEl, currencyEl].forEach(el => el.addEventListener('input', calc));

function calc() {
  const target = Math.max(0, parseFloat(targetEl.value) || 0);
  const start = Math.max(0, parseFloat(startEl.value) || 0);
  const annualRate = Math.max(0, parseFloat(rateEl.value) || 0);
  const r = (annualRate / 100) / 12; // monthly rate
  const cur = currencyEl.value;
  let primary = 0;
  let months = 0;
  let monthly = 0;

  if (mode === 'monthly') {
    months = Math.max(1, parseInt(monthsInEl.value, 10) || 1);
    // Find monthly contribution so that FV = target
    // target = start * (1+r)^n + PMT * ((1+r)^n - 1)/r
    // PMT = (target - start * (1+r)^n) / (((1+r)^n - 1)/r)
    const grown = start * Math.pow(1 + r, months);
    const factor = r === 0 ? months : (Math.pow(1 + r, months) - 1) / r;
    monthly = Math.max(0, (target - grown) / factor);
    primary = monthly;
    document.getElementById('r-primary').textContent = cur + monthly.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' / mo';
  } else {
    monthly = Math.max(0, parseFloat(monthlyInEl.value) || 0);
    // Find months. Iterate (no clean closed form for arbitrary r).
    if (start >= target) months = 0;
    else if (monthly === 0 && r === 0) months = Infinity;
    else {
      let bal = start;
      let n = 0;
      while (bal < target && n < 12000) {
        bal = bal * (1 + r) + monthly;
        n++;
      }
      months = n;
    }
    primary = months;
    if (months === Infinity) {
      document.getElementById('r-primary').textContent = '∞ (never)';
    } else {
      const years = (months / 12).toFixed(1);
      document.getElementById('r-primary').textContent = `${months} months (${years} years)`;
    }
  }

  // Total contributions + interest
  const totalContrib = start + monthly * months;
  const interest = Math.max(0, target - totalContrib);
  document.getElementById('r-total-contrib').textContent = cur + totalContrib.toLocaleString(undefined, { maximumFractionDigits: 0 });
  document.getElementById('r-interest').textContent = cur + interest.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

calc();
