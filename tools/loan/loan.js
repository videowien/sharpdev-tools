/**
 * Mortgage & Loan Calculator — SharpDev Tools
 */

const ids = ['amount', 'down', 'rate', 'years', 'start', 'extra', 'currency'];
const els = {};
ids.forEach(id => els[id] = document.getElementById(id));

// Default start date = today
(function initDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  els.start.value = yyyy + '-' + mm + '-' + dd;
})();

let showAll = false;
let lastSchedule = [];

function fmtMoney(n) {
  const cur = els.currency.value;
  const noDecimals = cur === '¥';
  const opts = noDecimals
    ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return cur + (cur === 'CHF' ? ' ' : '') + n.toLocaleString('en-US', opts);
}

function fmtDate(d) {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function computeAmort(principal, annualRate, months, extra) {
  const r = annualRate / 12 / 100;
  let monthly;
  if (r === 0) monthly = principal / months;
  else monthly = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);

  const rows = [];
  let bal = principal;
  const start = new Date(els.start.value || new Date().toISOString().slice(0, 10));
  for (let i = 1; i <= months * 2 && bal > 0.01; i++) {
    const interest = bal * r;
    let principalPart = monthly - interest;
    let payment = monthly;
    const extraP = Math.max(0, Math.min(extra, bal - principalPart));
    principalPart += extraP;
    payment += extraP;
    if (principalPart > bal) {
      principalPart = bal;
      payment = interest + principalPart;
    }
    bal -= principalPart;
    const dt = new Date(start);
    dt.setMonth(dt.getMonth() + i);
    rows.push({ n: i, date: dt, payment, principal: principalPart, interest, balance: Math.max(0, bal) });
    if (bal < 0.01) break;
  }
  return { monthly, rows };
}

function calc() {
  const amount = Math.max(0, (+els.amount.value || 0) - (+els.down.value || 0));
  const rate = +els.rate.value || 0;
  const months = Math.max(1, Math.floor((+els.years.value || 1) * 12));
  const extra = +els.extra.value || 0;

  const cur = els.currency.value;
  document.getElementById('cur-prefix').textContent = cur;
  document.getElementById('cur-prefix2').textContent = cur;
  document.getElementById('cur-prefix3').textContent = cur;

  if (amount <= 0) {
    document.getElementById('r-monthly').textContent = fmtMoney(0);
    document.getElementById('r-total').textContent = fmtMoney(0);
    document.getElementById('r-interest').textContent = fmtMoney(0);
    document.getElementById('r-payoff').textContent = '-';
    document.getElementById('l-principal').textContent = fmtMoney(0);
    document.getElementById('l-interest').textContent = fmtMoney(0);
    drawDonut(0, 0);
    lastSchedule = [];
    renderTable();
    document.getElementById('savings-box').style.display = 'none';
    return;
  }

  const base = computeAmort(amount, rate, months, 0);
  const actual = computeAmort(amount, rate, months, extra);
  lastSchedule = actual.rows;

  const totalPaid = actual.rows.reduce((s, r) => s + r.payment, 0);
  const totalInterest = actual.rows.reduce((s, r) => s + r.interest, 0);
  const payoff = actual.rows.length ? actual.rows[actual.rows.length - 1].date : null;

  document.getElementById('r-monthly').textContent = fmtMoney(actual.monthly + extra);
  document.getElementById('r-total').textContent = fmtMoney(totalPaid);
  document.getElementById('r-interest').textContent = fmtMoney(totalInterest);
  document.getElementById('r-payoff').textContent = payoff ? fmtDate(payoff) : '-';

  document.getElementById('l-principal').textContent = fmtMoney(amount);
  document.getElementById('l-interest').textContent = fmtMoney(totalInterest);
  drawDonut(amount, totalInterest);

  // savings vs no-extra baseline
  const savingsBox = document.getElementById('savings-box');
  if (extra > 0) {
    const baseInterest = base.rows.reduce((s, r) => s + r.interest, 0);
    const monthsSaved = base.rows.length - actual.rows.length;
    const intSaved = baseInterest - totalInterest;
    savingsBox.style.display = 'block';
    savingsBox.innerHTML = 'With your ' + fmtMoney(extra) + ' extra monthly payment, you pay off <b>' + monthsSaved + ' months earlier</b> and save <b>' + fmtMoney(intSaved) + '</b> in interest.';
  } else {
    savingsBox.style.display = 'none';
  }

  renderTable();
}

function drawDonut(principal, interest) {
  const total = principal + interest || 1;
  const svg = document.getElementById('donut');
  const cx = 100, cy = 100, r = 80, sw = 24;
  const C = 2 * Math.PI * r;
  const pPct = principal / total;
  const iPct = interest / total;
  svg.innerHTML =
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#2a2a2a" stroke-width="' + sw + '"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#ff4444" stroke-width="' + sw +
      '" stroke-dasharray="' + (pPct * C) + ' ' + C + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#fbbf24" stroke-width="' + sw +
      '" stroke-dasharray="' + (iPct * C) + ' ' + C + '" stroke-dashoffset="' + (-pPct * C) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>' +
    '<text x="100" y="95" text-anchor="middle" fill="#fff" font-family="SF Mono, Monaco, monospace" font-size="13" font-weight="700">' + Math.round(pPct * 100) + '%</text>' +
    '<text x="100" y="112" text-anchor="middle" fill="#888" font-family="SF Mono, Monaco, monospace" font-size="11">principal</text>';
}

function renderTable() {
  const tbody = document.getElementById('schedule-body');
  const limit = showAll ? lastSchedule.length : Math.min(12, lastSchedule.length);
  const rows = [];
  for (let i = 0; i < limit; i++) {
    const r = lastSchedule[i];
    rows.push('<tr><td>' + r.n + '</td><td>' + fmtDate(r.date) + '</td><td class="num">' + fmtMoney(r.payment) + '</td><td class="num">' + fmtMoney(r.principal) + '</td><td class="num">' + fmtMoney(r.interest) + '</td><td class="num">' + fmtMoney(r.balance) + '</td></tr>');
  }
  tbody.innerHTML = rows.join('');
  const btn = document.getElementById('toggle-all');
  if (lastSchedule.length <= 12) { btn.style.display = 'none'; }
  else { btn.style.display = ''; btn.textContent = showAll ? 'Show first 12' : 'Show all (' + lastSchedule.length + ')'; }
}

document.getElementById('toggle-all').addEventListener('click', () => {
  showAll = !showAll;
  renderTable();
});

function exportCsv() {
  if (!lastSchedule.length) return;
  const header = ['#', 'Date', 'Payment', 'Principal', 'Interest', 'Balance'];
  const rows = lastSchedule.map(r => [
    r.n,
    r.date.toISOString().slice(0, 10),
    r.payment.toFixed(2),
    r.principal.toFixed(2),
    r.interest.toFixed(2),
    r.balance.toFixed(2),
  ]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'amortization.csv';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

ids.forEach(id => els[id].addEventListener('input', calc));
els.currency.addEventListener('change', calc);

calc();
