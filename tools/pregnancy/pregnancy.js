/**
 * Due Date Calculator — Naegele's rule (LMP + 280 days)
 */

let mode = 'lmp'; // 'lmp' | 'conception'
const dateInput = document.getElementById('date-input');
const dateLabel = document.getElementById('date-label');
const resultCard = document.getElementById('result-card');

// Default LMP = 8 weeks ago
const defaultLmp = new Date();
defaultLmp.setDate(defaultLmp.getDate() - 56);
dateInput.value = toISO(defaultLmp);

document.querySelectorAll('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    dateLabel.textContent = mode === 'lmp' ? 'Date of first day of last period' : 'Date of conception';
    calc();
  });
});

dateInput.addEventListener('change', calc);

const MILESTONES = [
  { w: 6, t: 'Heartbeat detectable on ultrasound' },
  { w: 8, t: 'Baby is the size of a kidney bean' },
  { w: 12, t: 'End of first trimester — risk drops sharply' },
  { w: 13, t: 'Second trimester begins' },
  { w: 16, t: 'Possible first kicks (multiparous)' },
  { w: 20, t: 'Halfway point + anatomy ultrasound' },
  { w: 24, t: 'Viability threshold (~24 weeks)' },
  { w: 27, t: 'Third trimester begins' },
  { w: 28, t: 'Glucose tolerance test window' },
  { w: 32, t: 'Major growth spurt' },
  { w: 37, t: 'Full term reached' },
  { w: 40, t: 'Estimated due date' },
];

function calc() {
  const input = new Date(dateInput.value);
  if (isNaN(input)) { resultCard.style.display = 'none'; return; }
  // Convert conception → LMP if needed (conception ≈ LMP + 14 days)
  const lmp = mode === 'lmp' ? input : new Date(input.getTime() - 14 * 86400e3);
  const due = new Date(lmp.getTime() + 280 * 86400e3);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysSinceLmp = Math.floor((today - lmp) / 86400e3);
  const week = Math.floor(daysSinceLmp / 7);
  const extraDays = daysSinceLmp % 7;
  let trimester;
  if (week < 13) trimester = '1st trimester';
  else if (week < 27) trimester = '2nd trimester';
  else trimester = '3rd trimester';
  if (week < 0) trimester = 'Not yet conceived';
  if (week > 42) trimester = 'Past due';

  resultCard.style.display = '';
  document.getElementById('due-date').textContent = fmtDate(due);
  document.getElementById('current-week').textContent =
    week < 0 ? '—' : `Week ${week}${extraDays ? ' + ' + extraDays + 'd' : ''}`;
  document.getElementById('current-trimester').textContent = trimester;

  // Progress
  const pct = Math.max(0, Math.min(100, (daysSinceLmp / 280) * 100));
  document.getElementById('progress-fill').style.width = pct + '%';

  // Upcoming milestones (next 4 not yet reached)
  const upcoming = MILESTONES.filter(m => m.w >= week).slice(0, 4);
  const list = document.getElementById('milestones-list');
  list.innerHTML = '';
  if (!upcoming.length) {
    list.innerHTML = '<li><span>All milestones passed</span></li>';
    return;
  }
  for (const m of upcoming) {
    const dt = new Date(lmp.getTime() + m.w * 7 * 86400e3);
    const li = document.createElement('li');
    li.innerHTML = `<span>Week ${m.w} — ${m.t}</span><span class="ms-date">${fmtDate(dt)}</span>`;
    list.appendChild(li);
  }
}

function toISO(d) {
  return d.toISOString().slice(0, 10);
}
function fmtDate(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

calc();
