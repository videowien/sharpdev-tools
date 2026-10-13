/**
 * Profit Margin Calculator — SharpDev Tools
 */

const fwdGrid = document.getElementById('forward-grid');
const revGrid = document.getElementById('reverse-grid');
const cost = document.getElementById('cost');
const price = document.getElementById('price');
const costR = document.getElementById('cost-r');
const marginR = document.getElementById('margin-r');
const rProfit = document.getElementById('r-profit');
const rMargin = document.getElementById('r-margin');
const rMarkup = document.getElementById('r-markup');
const rPrice = document.getElementById('r-price');
const revCard = document.getElementById('rev-price-card');

function fmt(n, suffix = '') {
  if (!isFinite(n)) return '—';
  return (Math.round(n * 100) / 100).toFixed(2) + suffix;
}

function recompute() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (mode === 'forward') {
    const c = parseFloat(cost.value);
    const p = parseFloat(price.value);
    if (isNaN(c) || isNaN(p) || p <= 0) {
      rProfit.textContent = '—'; rMargin.textContent = '—'; rMarkup.textContent = '—';
      return;
    }
    const profit = p - c;
    const margin = (profit / p) * 100;
    const markup = c > 0 ? (profit / c) * 100 : 0;
    rProfit.textContent = fmt(profit);
    rMargin.textContent = fmt(margin, '%');
    rMarkup.textContent = fmt(markup, '%');
    revCard.style.display = 'none';
  } else {
    const c = parseFloat(costR.value);
    const m = parseFloat(marginR.value);
    if (isNaN(c) || isNaN(m) || m >= 100) {
      rProfit.textContent = '—'; rMargin.textContent = '—'; rMarkup.textContent = '—'; rPrice.textContent = '—';
      return;
    }
    const p = c / (1 - m / 100);
    const profit = p - c;
    const markup = c > 0 ? (profit / c) * 100 : 0;
    rProfit.textContent = fmt(profit);
    rMargin.textContent = fmt(m, '%');
    rMarkup.textContent = fmt(markup, '%');
    rPrice.textContent = fmt(p);
    revCard.style.display = '';
  }
}

document.querySelectorAll('input[name="mode"]').forEach((r) => {
  r.addEventListener('change', () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    fwdGrid.style.display = mode === 'forward' ? 'grid' : 'none';
    revGrid.style.display = mode === 'reverse' ? 'grid' : 'none';
    recompute();
  });
});

[cost, price, costR, marginR].forEach((el) => el.addEventListener('input', recompute));

recompute();
