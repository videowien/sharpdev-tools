/**
 * Countdown Timer — to any future datetime
 */

const targetEl = document.getElementById('target');
const labelEl = document.getElementById('label');

// Default: next New Year
const now = new Date();
const ny = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
targetEl.value = toDatetimeLocal(ny);
labelEl.value = 'New Year ' + (now.getFullYear() + 1);

function toDatetimeLocal(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = btn.dataset.preset;
    const today = new Date();
    let target, label;
    if (p === 'newyear') {
      target = new Date(today.getFullYear() + 1, 0, 1, 0, 0, 0);
      label = 'New Year ' + (today.getFullYear() + 1);
    } else if (p === 'christmas') {
      let yr = today.getFullYear();
      target = new Date(yr, 11, 25, 0, 0, 0);
      if (target < today) target = new Date(yr + 1, 11, 25, 0, 0, 0);
      label = 'Christmas';
    } else if (p === 'midyear') {
      let yr = today.getFullYear();
      target = new Date(yr, 6, 1, 0, 0, 0);
      if (target < today) target = new Date(yr + 1, 6, 1, 0, 0, 0);
      label = 'Halfway through ' + target.getFullYear();
    } else if (p === 'weekend') {
      target = new Date(today);
      const day = target.getDay();
      const daysUntilSat = (6 - day + 7) % 7 || 7;
      target.setDate(target.getDate() + daysUntilSat);
      target.setHours(0, 0, 0, 0);
      label = 'Next weekend';
    }
    targetEl.value = toDatetimeLocal(target);
    labelEl.value = label;
    update();
  });
});

let tickHandle = null;

function update() {
  const t = new Date(targetEl.value);
  if (isNaN(t)) return;
  const labelText = labelEl.value || 'Countdown';
  document.getElementById('cd-label').textContent = labelText;
  document.getElementById('cd-target').textContent =
    t.toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  tick();
  if (tickHandle) clearInterval(tickHandle);
  tickHandle = setInterval(tick, 250);
}

function tick() {
  const t = new Date(targetEl.value);
  const now = new Date();
  let diff = t - now;
  const targetMsg = document.getElementById('cd-target');
  if (diff <= 0) {
    setAll(0, 0, 0, 0);
    targetMsg.classList.add('done');
    targetMsg.textContent = '🎉 ' + labelEl.value + ' — reached!';
    if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
    return;
  }
  targetMsg.classList.remove('done');
  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);
  setAll(days, hours, mins, secs);
}

function setAll(d, h, m, s) {
  document.getElementById('cd-days').textContent = d.toString();
  document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
}

[targetEl, labelEl].forEach(el => el.addEventListener('input', update));
update();
