/** Compound Interest Calculator with yearly breakdown */
const fmt = n => '$' + (+n.toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const $ = id => document.getElementById(id);
const principal = $('principal'), deposit = $('deposit'), rate = $('rate'), years = $('years'), compounds = $('compounds');
const rFinal = $('r-final'), rDeposited = $('r-deposited'), rInterest = $('r-interest');
const yearly = $('ci-yearly');

function calc() {
  const P = parseFloat(principal.value) || 0;
  const D = parseFloat(deposit.value) || 0;
  const r = (parseFloat(rate.value) || 0) / 100;
  const n = parseInt(compounds.value, 10);
  const Y = parseInt(years.value, 10) || 1;

  // Monthly contributions compound at the chosen frequency
  // Approximation: treat deposit as monthly, growth applied at frequency n
  let balance = P;
  const rows = [{ year: 0, deposited: P, balance: P, interest: 0 }];
  let totalDeposited = P;
  const ratePerPeriod = r / n;
  const periodsPerYear = n;
  const depositPerPeriod = (D * 12) / n; // distribute monthly deposits evenly across compounding periods

  for (let y = 1; y <= Y; y++) {
    for (let p = 0; p < periodsPerYear; p++) {
      balance = balance * (1 + ratePerPeriod) + depositPerPeriod;
      totalDeposited += depositPerPeriod;
    }
    rows.push({ year: y, deposited: totalDeposited, balance, interest: balance - totalDeposited });
  }
  rFinal.textContent = fmt(balance);
  rDeposited.textContent = fmt(totalDeposited);
  rInterest.textContent = fmt(balance - totalDeposited);

  // Render yearly table
  let html = '<h2>Yearly breakdown</h2><div class="ci-yr-row head"><span>Year</span><span class="val">Deposited</span><span class="val">Balance</span><span class="val">Interest</span></div>';
  rows.forEach(r => {
    html += `<div class="ci-yr-row"><span>${r.year}</span><span class="val">${fmt(r.deposited)}</span><span class="val">${fmt(r.balance)}</span><span class="val">${fmt(r.interest)}</span></div>`;
  });
  yearly.innerHTML = html;
}

[principal, deposit, rate, years, compounds].forEach(el => el.addEventListener('input', calc));
calc();
