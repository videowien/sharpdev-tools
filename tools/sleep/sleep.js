/**
 * Sleep Cycle Calculator — 90-min cycles + 14-min fall-asleep buffer
 */

const CYCLE_MIN = 90;
let mode = 'wake';

const wakeEl = document.getElementById('wake-time');
const sleepEl = document.getElementById('sleep-time');
const fallEl = document.getElementById('fall-asleep');
const resultGrid = document.getElementById('result-grid');
const hint = document.getElementById('hint');

document.querySelectorAll('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    document.querySelector('.mode-wake').style.display = mode === 'wake' ? '' : 'none';
    document.querySelector('.mode-sleep').style.display = mode === 'sleep' ? '' : 'none';
    calc();
  });
});

[wakeEl, sleepEl, fallEl].forEach(el => el.addEventListener('input', calc));

function calc() {
  const fall = Math.max(0, Math.min(60, parseInt(fallEl.value, 10) || 0));
  if (mode === 'wake') showFromWake(parseTime(wakeEl.value), fall);
  else if (mode === 'sleep') showFromSleep(parseTime(sleepEl.value), fall);
  else showFromNow(fall);
}

function parseTime(s) {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
}

function fmtTime(mins) {
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function showFromWake(wakeMin, fall) {
  // To wake at wakeMin, go to bed at: wakeMin - (N cycles * 90 minutes + fall asleep)
  const cycles = [6, 5, 4, 3];
  const items = cycles.map(c => ({
    type: 'bed',
    time: wakeMin - (c * CYCLE_MIN) - fall,
    cycles: c,
    hours: (c * CYCLE_MIN) / 60,
  }));
  render(items, 'Best bed times to wake refreshed at ' + fmtTime(wakeMin));
}

function showFromSleep(sleepMin, fall) {
  // From bedtime, valid wake times = sleepMin + fall + N * 90 minutes
  const cycles = [3, 4, 5, 6];
  const items = cycles.map(c => ({
    type: 'wake',
    time: sleepMin + fall + (c * CYCLE_MIN),
    cycles: c,
    hours: (c * CYCLE_MIN) / 60,
  }));
  render(items, 'Best wake times if you go to bed at ' + fmtTime(sleepMin));
}

function showFromNow(fall) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const cycles = [3, 4, 5, 6];
  const items = cycles.map(c => ({
    type: 'wake',
    time: nowMin + fall + (c * CYCLE_MIN),
    cycles: c,
    hours: (c * CYCLE_MIN) / 60,
  }));
  render(items, 'If you sleep now (' + fmtTime(nowMin) + ' + ' + fall + 'min to fall asleep)');
}

function render(items, hintText) {
  resultGrid.innerHTML = '';
  items.forEach(item => {
    const cycle = document.createElement('div');
    let cls = 'cycle';
    if (item.cycles === 5 || item.cycles === 6) cls += ' recommended';
    else if (item.cycles === 3) cls += ' minimal';
    cycle.className = cls;
    cycle.innerHTML = `
      <div class="cycle-time">${fmtTime(item.time)}</div>
      <div class="cycle-label">${item.type === 'bed' ? 'Go to bed' : 'Wake up'}</div>
      <div class="cycle-detail">${item.cycles} cycles · ${item.hours}h</div>
    `;
    resultGrid.appendChild(cycle);
  });
  hint.textContent = hintText + '. Green = optimal (5-6 cycles). Red = bare minimum (3 cycles, only for naps).';
}

calc();
