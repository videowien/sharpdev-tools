/**
 * Freelance Hourly Rate Calculator — SharpDev Tools
 */

const els = {
  takeHome: document.getElementById('take-home'),
  taxRate: document.getElementById('tax-rate'),
  overhead: document.getElementById('overhead'),
  vacation: document.getElementById('vacation'),
  publicHol: document.getElementById('public-hol'),
  sick: document.getElementById('sick'),
  hoursPerDay: document.getElementById('hours-per-day'),
  billableRatio: document.getElementById('billable-ratio'),
};

const out = {
  gross: document.getElementById('r-gross'),
  revenue: document.getElementById('r-revenue'),
  days: document.getElementById('r-days'),
  hours: document.getElementById('r-hours'),
  rate: document.getElementById('r-rate'),
};

function num(el) {
  const v = parseFloat(el.value);
  return isNaN(v) ? 0 : v;
}

function fmtMoney(n) {
  return Math.round(n).toLocaleString();
}

function recompute() {
  const takeHome = num(els.takeHome);
  const taxRate = num(els.taxRate);
  const overhead = num(els.overhead);
  const vacation = num(els.vacation);
  const publicHol = num(els.publicHol);
  const sick = num(els.sick);
  const hoursPerDay = num(els.hoursPerDay);
  const billableRatio = num(els.billableRatio);

  // Gross income needed: take-home / (1 - taxRate/100)
  const gross = taxRate >= 100 ? Infinity : takeHome / (1 - taxRate / 100);
  // Revenue (charged to clients) = gross + overhead
  const revenue = gross + overhead;

  // Working days: 52 weeks × 5 = 260 working days, minus vacation/holiday/sick
  const workingDays = Math.max(1, 260 - vacation - publicHol - sick);
  // Billable hours = workingDays × hoursPerDay × billableRatio
  const billableHours = workingDays * hoursPerDay * (billableRatio / 100);

  const rate = billableHours > 0 ? revenue / billableHours : 0;

  out.gross.textContent = '€' + fmtMoney(gross);
  out.revenue.textContent = '€' + fmtMoney(revenue);
  out.days.textContent = workingDays + ' days';
  out.hours.textContent = Math.round(billableHours) + ' h';
  out.rate.textContent = '€' + (Math.round(rate * 10) / 10).toFixed(2) + ' / h';
}

Object.values(els).forEach((el) => el.addEventListener('input', recompute));
recompute();
