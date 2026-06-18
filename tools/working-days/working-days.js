/**
 * Working Days Calculator — SharpDev Tools
 * Two modes:
 *   1. Add days from a date — input: from-date + N; output: resulting date
 *   2. Days between two dates — input: start + end; output: working-day count
 */

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseHolidays(txt) {
  const set = new Set();
  for (const line of txt.split(/\r?\n/)) {
    const t = line.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) set.add(t);
  }
  return set;
}

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ===== Mode toggle =====
const modeBtns = document.querySelectorAll('.mode-btn');
const modePanels = {
  add: document.getElementById('mode-add'),
  between: document.getElementById('mode-between'),
};
modeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    modeBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const target = btn.dataset.mode;
    Object.entries(modePanels).forEach(([key, panel]) => {
      panel.classList.toggle('hidden', key !== target);
    });
  });
});

// ===== ADD mode =====
const addFromEl = document.getElementById('add-from');
const addNEl = document.getElementById('add-n');
const addHolidaysEl = document.getElementById('add-holidays');
const addRDate = document.getElementById('add-r-date');
const addRWeekday = document.getElementById('add-r-weekday');
const addRCalendar = document.getElementById('add-r-calendar');
const addRWeekends = document.getElementById('add-r-weekends');
const addRHolidays = document.getElementById('add-r-holidays');

function clearAdd() {
  addRDate.textContent = '—';
  addRWeekday.textContent = '—';
  addRCalendar.textContent = '—';
  addRWeekends.textContent = '—';
  addRHolidays.textContent = '—';
}

function computeAdd() {
  const fromStr = addFromEl.value;
  const nRaw = addNEl.value;
  if (!fromStr || nRaw === '' || isNaN(parseInt(nRaw, 10))) {
    clearAdd();
    return;
  }
  const n = parseInt(nRaw, 10);
  const holidays = parseHolidays(addHolidaysEl.value);
  const start = new Date(fromStr + 'T00:00:00');

  if (n === 0) {
    addRDate.textContent = toISODate(start);
    addRWeekday.textContent = WEEKDAY_NAMES[start.getDay()];
    addRCalendar.textContent = '0';
    addRWeekends.textContent = '0';
    addRHolidays.textContent = '0';
    return;
  }

  const direction = n >= 0 ? 1 : -1;
  let remaining = Math.abs(n);
  let weekendsCrossed = 0;
  let holidaysSkipped = 0;
  const cursor = new Date(start);

  while (remaining > 0) {
    cursor.setDate(cursor.getDate() + direction);
    const day = cursor.getDay();
    const isWeekend = day === 0 || day === 6;
    const isHoliday = holidays.has(toISODate(cursor));
    if (isWeekend) {
      weekendsCrossed++;
      continue;
    }
    if (isHoliday) {
      holidaysSkipped++;
      continue;
    }
    remaining--;
  }

  const calendarSpan = Math.abs(Math.round((cursor - start) / 86400000));
  addRDate.textContent = toISODate(cursor);
  addRWeekday.textContent = WEEKDAY_NAMES[cursor.getDay()];
  addRCalendar.textContent = calendarSpan;
  addRWeekends.textContent = weekendsCrossed;
  addRHolidays.textContent = holidaysSkipped;
}

[addFromEl, addNEl, addHolidaysEl].forEach((el) => el.addEventListener('input', computeAdd));

// ===== BETWEEN mode (original) =====
const startEl = document.getElementById('start');
const endEl = document.getElementById('end');
const inclusiveEl = document.getElementById('inclusive');
const holidaysEl = document.getElementById('holidays');
const rWorking = document.getElementById('r-working');
const rCalendar = document.getElementById('r-calendar');
const rWeekends = document.getElementById('r-weekends');
const rHolidays = document.getElementById('r-holidays');

function computeBetween() {
  const startStr = startEl.value;
  const endStr = endEl.value;
  if (!startStr || !endStr) {
    rWorking.textContent = '—';
    rCalendar.textContent = '—';
    rWeekends.textContent = '—';
    rHolidays.textContent = '—';
    return;
  }
  let start = new Date(startStr + 'T00:00:00');
  let end = new Date(endStr + 'T00:00:00');
  if (end < start) [start, end] = [end, start];

  const inclusive = inclusiveEl.checked;
  const holidays = parseHolidays(holidaysEl.value);

  let calendar = 0;
  let working = 0;
  let weekends = 0;
  let holidayMatches = 0;

  const cursor = new Date(start);
  while (cursor <= end) {
    const isFirstOrLast = (cursor.getTime() === start.getTime() || cursor.getTime() === end.getTime());
    if (!inclusive && isFirstOrLast) {
      cursor.setDate(cursor.getDate() + 1);
      continue;
    }
    calendar++;
    const day = cursor.getDay();
    const isWeekend = day === 0 || day === 6;
    const iso = toISODate(cursor);
    const isHoliday = holidays.has(iso);

    if (isWeekend) {
      weekends++;
    } else if (isHoliday) {
      holidayMatches++;
    } else {
      working++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  rWorking.textContent = working;
  rCalendar.textContent = calendar;
  rWeekends.textContent = weekends;
  rHolidays.textContent = holidayMatches;
}

[startEl, endEl, inclusiveEl, holidaysEl].forEach((el) => el.addEventListener('input', computeBetween));

// ===== Defaults =====
const today = new Date();
const in30 = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
addFromEl.value = toISODate(today);
startEl.value = toISODate(today);
endEl.value = toISODate(in30);
computeAdd();
computeBetween();
