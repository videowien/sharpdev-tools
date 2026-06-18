/**
 * Net Worth Calculator — assets - liabilities
 */

let assets = [
  { name: 'Cash + checking', amount: 5000 },
  { name: 'Savings', amount: 15000 },
  { name: 'Brokerage / index funds', amount: 40000 },
  { name: 'Retirement (401k / IRA)', amount: 65000 },
  { name: 'Home (current market value)', amount: 0 },
  { name: 'Vehicle (current resale value)', amount: 12000 },
];
let liabilities = [
  { name: 'Credit card balance', amount: 800 },
  { name: 'Student loans', amount: 18000 },
  { name: 'Mortgage', amount: 0 },
  { name: 'Car loan', amount: 8000 },
];

const curEl = document.getElementById('currency');
let cur = curEl.value;

curEl.addEventListener('change', () => { cur = curEl.value; renderAll(); calc(); });

function renderSide(side, listEl) {
  listEl.innerHTML = '';
  side.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'line';
    row.innerHTML = `
      <input type="text" value="${escAttr(item.name)}" placeholder="Description"/>
      <input type="number" step="100" value="${item.amount}"/>
      <button type="button" aria-label="Remove">×</button>
    `;
    const [nameI, amtI] = row.querySelectorAll('input');
    nameI.addEventListener('input', () => { item.name = nameI.value; });
    amtI.addEventListener('input', () => { item.amount = parseFloat(amtI.value) || 0; calc(); });
    row.querySelector('button').addEventListener('click', () => {
      side.splice(i, 1);
      renderAll();
      calc();
    });
    listEl.appendChild(row);
  });
}

function renderAll() {
  renderSide(assets, document.getElementById('assets-list'));
  renderSide(liabilities, document.getElementById('liabilities-list'));
}

function calc() {
  const a = assets.reduce((s, x) => s + (x.amount || 0), 0);
  const l = liabilities.reduce((s, x) => s + (x.amount || 0), 0);
  const net = a - l;
  document.getElementById('assets-total').textContent = cur + a.toLocaleString(undefined, { maximumFractionDigits: 0 });
  document.getElementById('liabilities-total').textContent = cur + l.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const nw = document.getElementById('net-worth');
  nw.textContent = (net >= 0 ? '+' : '−') + cur + Math.abs(net).toLocaleString(undefined, { maximumFractionDigits: 0 });
  nw.className = 'result-value ' + (net >= 0 ? 'pos' : 'neg');
  const ratio = a > 0 ? (net / a * 100) : 0;
  document.getElementById('net-sub').textContent = a > 0
    ? `Equity ratio: ${ratio.toFixed(0)}% (net worth as % of assets)`
    : '';
}

document.querySelectorAll('[data-side]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.side === 'assets' ? assets : liabilities;
    target.push({ name: '', amount: 0 });
    renderAll();
    calc();
  });
});

function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

renderAll();
calc();
