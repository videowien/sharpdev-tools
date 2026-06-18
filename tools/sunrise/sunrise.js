/**
 * Sunrise / Sunset Calculator — NOAA-style algorithm
 * Based on Jean Meeus's astronomical algorithms.
 */

const latEl = document.getElementById('lat');
const lngEl = document.getElementById('lng');
const dateEl = document.getElementById('date');

dateEl.value = new Date().toISOString().slice(0, 10);

document.querySelectorAll('.preset').forEach(btn => {
  if (btn.id === 'geo') {
    btn.addEventListener('click', () => {
      if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
      navigator.geolocation.getCurrentPosition(pos => {
        latEl.value = pos.coords.latitude.toFixed(4);
        lngEl.value = pos.coords.longitude.toFixed(4);
        calc();
      }, err => alert('Could not get location: ' + err.message));
    });
  } else {
    btn.addEventListener('click', () => {
      latEl.value = btn.dataset.lat;
      lngEl.value = btn.dataset.lng;
      calc();
    });
  }
});

[latEl, lngEl, dateEl].forEach(el => el.addEventListener('input', calc));

const rad = d => d * Math.PI / 180;
const deg = r => r * 180 / Math.PI;

function julianDay(date) {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Returns hour-angle UT (in hours) for a given solar zenith angle.
 * Uses the standard NOAA sunrise equation.
 * altitude in degrees below horizon (positive for below, e.g. 0.833 for refraction-corrected sunrise).
 */
function sunTime(date, lat, lng, altitude, isRise) {
  const N = julianDay(date) - 2451545.0 + 0.0008;
  const Jstar = N - lng / 360;
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const C = 1.9148 * Math.sin(rad(M)) + 0.0200 * Math.sin(rad(2 * M)) + 0.0003 * Math.sin(rad(3 * M));
  const lambda = (M + C + 180 + 102.9372) % 360;
  const Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(rad(M)) - 0.0069 * Math.sin(rad(2 * lambda));
  const delta = deg(Math.asin(Math.sin(rad(lambda)) * Math.sin(rad(23.4397))));
  const cosOmega = (Math.sin(rad(-altitude)) - Math.sin(rad(lat)) * Math.sin(rad(delta))) / (Math.cos(rad(lat)) * Math.cos(rad(delta)));
  if (cosOmega > 1) return { polarNight: true };
  if (cosOmega < -1) return { polarDay: true };
  const omega = deg(Math.acos(cosOmega));
  const J = isRise ? Jtransit - omega / 360 : Jtransit + omega / 360;
  return { julian: J, transitJulian: Jtransit };
}

function julianToDate(j) {
  return new Date((j - 2440587.5) * 86400000);
}

function fmtTime(d) {
  if (!d) return '—';
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function fmtDuration(ms) {
  const total = Math.round(ms / 60000);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function calc() {
  const lat = parseFloat(latEl.value);
  const lng = parseFloat(lngEl.value);
  const date = new Date(dateEl.value + 'T12:00:00');
  if (isNaN(lat) || isNaN(lng) || isNaN(date)) { clearAll(); return; }

  const RISE_ALT = 0.833;  // standard refraction + 16' for solar disc
  const CIV = 6;
  const NAU = 12;
  const AST = 18;

  const rise = sunTime(date, lat, lng, RISE_ALT, true);
  const set  = sunTime(date, lat, lng, RISE_ALT, false);
  const civM = sunTime(date, lat, lng, CIV, true);
  const civE = sunTime(date, lat, lng, CIV, false);
  const nauM = sunTime(date, lat, lng, NAU, true);
  const nauE = sunTime(date, lat, lng, NAU, false);
  const astM = sunTime(date, lat, lng, AST, true);
  const astE = sunTime(date, lat, lng, AST, false);

  if (rise.polarDay) {
    setRiseSet('☀ Polar day (no sunset)', '—', '☀ Polar day (no sunrise)');
    return;
  }
  if (rise.polarNight) {
    setRiseSet('🌑 Polar night', '—', '🌑 Polar night');
    return;
  }

  const riseDate = julianToDate(rise.julian);
  const setDate = julianToDate(set.julian);
  const noonDate = julianToDate(rise.transitJulian);
  document.getElementById('r-rise').textContent = fmtTime(riseDate);
  document.getElementById('r-noon').textContent = fmtTime(noonDate);
  document.getElementById('r-set').textContent = fmtTime(setDate);
  document.getElementById('r-length').textContent = fmtDuration(setDate - riseDate);

  setPair('t-civ-m', 't-civ-e', civM, civE);
  setPair('t-nau-m', 't-nau-e', nauM, nauE);
  setPair('t-ast-m', 't-ast-e', astM, astE);
}

function setPair(mId, eId, m, e) {
  document.getElementById(mId).textContent = m.polarDay || m.polarNight ? '—' : fmtTime(julianToDate(m.julian));
  document.getElementById(eId).textContent = e.polarDay || e.polarNight ? '—' : fmtTime(julianToDate(e.julian));
}

function setRiseSet(rise, length, set) {
  document.getElementById('r-rise').textContent = rise;
  document.getElementById('r-noon').textContent = '—';
  document.getElementById('r-set').textContent = set;
  document.getElementById('r-length').textContent = length;
  ['t-civ-m', 't-civ-e', 't-nau-m', 't-nau-e', 't-ast-m', 't-ast-e'].forEach(id => document.getElementById(id).textContent = '—');
}

function clearAll() {
  ['r-rise', 'r-noon', 'r-set', 'r-length', 't-civ-m', 't-civ-e', 't-nau-m', 't-nau-e', 't-ast-m', 't-ast-e']
    .forEach(id => document.getElementById(id).textContent = '—');
}

calc();
