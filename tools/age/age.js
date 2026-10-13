/**
 * Age & Date Difference Calculator — SharpDev Tools
 */

const fromEl = document.getElementById('from-date');
const toEl = document.getElementById('to-date');
const resultEl = document.getElementById('result');

function calculate() {
  const fromVal = fromEl.value;
  const toVal = toEl.value;

  if (!fromVal || !toVal) {
    resultEl.innerHTML = '<div class="empty-state">Pick both dates to see the result.</div>';
    return;
  }

  const [fy, fm, fd] = fromVal.split('-').map(Number);
  const [ty, tm, td] = toVal.split('-').map(Number);
  const from = new Date(fy, fm - 1, fd);
  const to = new Date(ty, tm - 1, td);

  if (isNaN(from) || isNaN(to)) {
    resultEl.innerHTML = '<div class="empty-state">Invalid date.</div>';
    return;
  }

  // Always work with the earlier -> later direction for breakdown
  let early = from, late = to, reversed = false;
  if (to < from) { early = to; late = from; reversed = true; }

  // Calculate years, months, days (calendar-aware)
  let years = late.getFullYear() - early.getFullYear();
  let months = late.getMonth() - early.getMonth();
  let days = late.getDate() - early.getDate();

  if (days < 0) {
    months--;
    // Days in previous month of 'late' date
    const prevMonth = new Date(late.getFullYear(), late.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Total counts
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((late - early) / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  const mainParts = [];
  if (years) mainParts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months) mainParts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  if (days || mainParts.length === 0) mainParts.push(`${days} ${days === 1 ? 'day' : 'days'}`);

  const main = mainParts.join(', ');
  const direction = reversed ? 'until' : (late.toDateString() === new Date().toDateString() && !reversed ? 'old' : 'apart');

  let html = `<div class="main-result">${main}</div>`;
  if (fromVal === toVal) {
    html = `<div class="main-result">0 days</div><div class="main-sub">Same date</div>`;
  } else {
    const fromStr = early.toDateString();
    const toStr = late.toDateString();
    html += `<div class="main-sub">${fromStr} → ${toStr}</div>`;
  }

  html += `<div class="breakdown">
    <div class="b-item"><div class="b-val">${totalDays.toLocaleString()}</div><div class="b-label">Total days</div></div>
    <div class="b-item"><div class="b-val">${totalWeeks.toLocaleString()}</div><div class="b-label">Total weeks</div></div>
    <div class="b-item"><div class="b-val">${totalMonths.toLocaleString()}</div><div class="b-label">Total months</div></div>
    <div class="b-item"><div class="b-val">${totalHours.toLocaleString()}</div><div class="b-label">Total hours</div></div>
    <div class="b-item"><div class="b-val">${totalMinutes.toLocaleString()}</div><div class="b-label">Total minutes</div></div>
  </div>`;

  resultEl.innerHTML = html;
}

function setToday() {
  const today = new Date();
  const iso = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
  toEl.value = iso;
  calculate();
}

// Set defaults: from = 25 years ago, to = today
(function init() {
  const today = new Date();
  const past = new Date();
  past.setFullYear(today.getFullYear() - 25);
  const toIso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  fromEl.value = toIso(past);
  toEl.value = toIso(today);
  calculate();
})();
