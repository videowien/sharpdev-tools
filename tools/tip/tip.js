/**
 * Tip Calculator — SharpDev Tools
 * 100% browser-side.
 */

function calculate() {
  const bill = Math.max(0, parseFloat(document.getElementById('bill').value) || 0);
  const tipPct = parseFloat(document.getElementById('tip-pct').value) || 0;
  const people = Math.max(1, parseInt(document.getElementById('people').value) || 1);
  const currency = document.getElementById('currency').value;

  const tipAmount = bill * (tipPct / 100);
  const total = bill + tipAmount;
  const perPerson = total / people;
  const tipPerPerson = tipAmount / people;

  document.getElementById('res-tip').textContent = formatMoney(tipAmount, currency);
  document.getElementById('res-total').textContent = formatMoney(total, currency);
  document.getElementById('res-per-person').textContent = formatMoney(perPerson, currency);
  document.getElementById('res-tip-per-person').textContent = formatMoney(tipPerPerson, currency);
}

function formatMoney(amount, currency) {
  const noDecimals = (currency === '¥');
  if (noDecimals) return currency + Math.round(amount).toLocaleString();
  return currency + amount.toFixed(2);
}

function setTip(n) {
  document.getElementById('tip-pct').value = n;
  document.getElementById('tip-val').textContent = n + '%';
  calculate();
}

function changePeople(delta) {
  const input = document.getElementById('people');
  const val = Math.max(1, (parseInt(input.value) || 1) + delta);
  input.value = val;
  calculate();
}

function updateCurrency() {
  document.getElementById('currency-symbol').textContent = document.getElementById('currency').value;
}

// Initial
updateCurrency();
calculate();
