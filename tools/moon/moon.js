/**
 * Moon Phase Calculator — Conway's simple lunar age formula
 */

const LUNAR_CYCLE = 29.530588853;
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime(); // reference new moon

const dateEl = document.getElementById('date');
dateEl.value = new Date().toISOString().slice(0, 10);

dateEl.addEventListener('input', update);

function lunarAge(date) {
  const ms = date.getTime() - KNOWN_NEW_MOON;
  const days = ms / 86400000;
  const age = ((days % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  return age;
}

function phaseInfo(age) {
  // 0=new, 7.4=first quarter, 14.77=full, 22.1=last quarter
  const phaseAngle = (age / LUNAR_CYCLE) * 2 * Math.PI;
  const illumination = (1 - Math.cos(phaseAngle)) / 2; // 0..1
  let name, emoji;
  if (age < 1.85) { name = 'New Moon'; emoji = '🌑'; }
  else if (age < 5.54) { name = 'Waxing Crescent'; emoji = '🌒'; }
  else if (age < 9.23) { name = 'First Quarter'; emoji = '🌓'; }
  else if (age < 12.92) { name = 'Waxing Gibbous'; emoji = '🌔'; }
  else if (age < 16.61) { name = 'Full Moon'; emoji = '🌕'; }
  else if (age < 20.30) { name = 'Waning Gibbous'; emoji = '🌖'; }
  else if (age < 23.99) { name = 'Last Quarter'; emoji = '🌗'; }
  else if (age < 27.68) { name = 'Waning Crescent'; emoji = '🌘'; }
  else { name = 'New Moon'; emoji = '🌑'; }
  return { name, emoji, illumination };
}

function nextPhase(startDate, targetAge) {
  // Find next date where lunar age crosses targetAge.
  const d = new Date(startDate);
  for (let i = 0; i < 35; i++) {
    const a1 = lunarAge(d);
    const next = new Date(d.getTime() + 86400000);
    const a2 = lunarAge(next);
    // crossing handles wrap-around (29.5 → 0)
    if (crossesTarget(a1, a2, targetAge)) {
      // Linear-interpolate within the day
      const frac = (targetAge - a1 + LUNAR_CYCLE) % LUNAR_CYCLE;
      const delta = (a2 - a1 + LUNAR_CYCLE) % LUNAR_CYCLE;
      return new Date(d.getTime() + (frac / delta) * 86400000);
    }
    d.setDate(d.getDate() + 1);
  }
  return null;
}

function crossesTarget(a1, a2, t) {
  // Did target t fall between a1 and a2 (mod cycle)?
  if (a1 <= a2) return t >= a1 && t < a2;
  // Wrapped past 0
  return t >= a1 || t < a2;
}

function fmtDate(d) {
  if (!d) return '—';
  return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function update() {
  const d = new Date(dateEl.value + 'T12:00:00');
  if (isNaN(d)) return;
  const age = lunarAge(d);
  const info = phaseInfo(age);

  document.getElementById('moon-visual').textContent = info.emoji;
  document.getElementById('phase-name').textContent = info.name;
  document.getElementById('illumination').textContent = (info.illumination * 100).toFixed(1) + '%';
  document.getElementById('lunar-age').textContent = age.toFixed(1) + ' days';

  document.getElementById('next-full').textContent = fmtDate(nextPhase(d, 14.77));
  document.getElementById('next-new').textContent = fmtDate(nextPhase(d, 0));
  document.getElementById('next-q1').textContent = fmtDate(nextPhase(d, 7.38));
  document.getElementById('next-q3').textContent = fmtDate(nextPhase(d, 22.15));
}

update();
