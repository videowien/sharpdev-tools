/**
 * Day of Year + ISO Week Calculator
 */

let mode = 'date';
const dateInput = document.getElementById('date-input');
const yearInput = document.getElementById('year-input');
const doyInput = document.getElementById('doy-input');
const modeDate = document.querySelector('.mode-date');
const modeNumber = document.querySelector('.mode-number');

// Default to today
const today = new Date();
dateInput.value = toISO(today);
yearInput.value = today.getFullYear();

document.querySelectorAll('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    modeDate.style.display = mode === 'date' ? '' : 'none';
    modeNumber.style.display = mode === 'number' ? '' : 'none';
    update();
  });
});

dateInput.addEventListener('input', update);
yearInput.addEventListener('input', update);
doyInput.addEventListener('input', update);

function update() {
  let date;
  if (mode === 'date') {
    date = new Date(dateInput.value);
  } else {
    const yr = parseInt(yearInput.value, 10);
    const doy = parseInt(doyInput.value, 10);
    if (isNaN(yr) || isNaN(doy) || doy < 1) { clearAll(); return; }
    date = new Date(yr, 0, 1);
    date.setDate(doy);
  }
  if (isNaN(date)) { clearAll(); return; }

  const year = date.getFullYear();
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const totalDaysInYear = isLeap ? 366 : 365;

  // Day of year
  const startOfYear = new Date(year, 0, 1);
  const diffMs = date - startOfYear;
  const doy = Math.floor(diffMs / 86400000) + 1;

  // ISO week (ISO 8601)
  const isoWeek = getISOWeek(date);
  const isoWeekYear = getISOWeekYear(date);

  // Quarter
  const quarter = Math.floor(date.getMonth() / 3) + 1;

  // Days remaining
  const remaining = totalDaysInYear - doy;
  const progress = ((doy / totalDaysInYear) * 100).toFixed(1);

  document.getElementById('r-date').textContent = fmtDate(date);
  document.getElementById('r-doy').textContent = doy;
  document.getElementById('r-doy-sub').textContent = `of ${totalDaysInYear}${isLeap ? ' (leap)' : ''}`;
  document.getElementById('r-week').textContent = isoWeek;
  document.getElementById('r-week-sub').textContent = `ISO ${isoWeekYear}-W${String(isoWeek).padStart(2, '0')}`;
  document.getElementById('r-quarter').textContent = 'Q' + quarter;
  document.getElementById('r-remain').textContent = remaining;
  document.getElementById('r-progress').textContent = progress + '%';
}

function getISOWeek(date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const diffDays = (target - firstThursday) / 86400000;
  return 1 + Math.round(diffDays / 7);
}
function getISOWeekYear(date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNum + 3);
  return target.getUTCFullYear();
}

function toISO(d) { return d.toISOString().slice(0, 10); }
function fmtDate(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function clearAll() {
  ['r-date', 'r-doy', 'r-doy-sub', 'r-week', 'r-week-sub', 'r-quarter', 'r-remain', 'r-progress']
    .forEach(id => document.getElementById(id).textContent = '—');
}

update();
