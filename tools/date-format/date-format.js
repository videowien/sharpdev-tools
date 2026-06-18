/**
 * Date Format Converter — edit any field, others update
 */

const fields = ['iso', 'iso-date', 'us', 'eu', 'rfc', 'unix', 'unix-ms', 'long'];
const els = Object.fromEntries(fields.map(f => [f, document.getElementById('f-' + f)]));
let lastChanged = null;
let suppressNext = false;

// Initialize with current time
setFromDate(new Date());

fields.forEach(f => {
  els[f].addEventListener('input', () => {
    if (suppressNext) return;
    lastChanged = f;
    const d = parseInputBy(f, els[f].value);
    if (d && !isNaN(d)) {
      els[f].classList.remove('invalid');
      setFromDate(d, f);
    } else if (els[f].value.trim()) {
      els[f].classList.add('invalid');
    }
  });
});

document.getElementById('now-btn').addEventListener('click', () => {
  setFromDate(new Date());
});
document.getElementById('clear-btn').addEventListener('click', () => {
  suppressNext = true;
  fields.forEach(f => { els[f].value = ''; els[f].classList.remove('invalid'); });
  suppressNext = false;
});

function parseInputBy(fmt, s) {
  s = s.trim();
  if (!s) return null;
  if (fmt === 'iso' || fmt === 'iso-date') {
    return new Date(s);
  }
  if (fmt === 'us') {
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!m) return null;
    return new Date(+m[3], +m[1] - 1, +m[2], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  }
  if (fmt === 'eu') {
    const m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  }
  if (fmt === 'rfc') {
    return new Date(s);
  }
  if (fmt === 'unix') {
    const n = parseInt(s, 10);
    if (isNaN(n)) return null;
    return new Date(n * 1000);
  }
  if (fmt === 'unix-ms') {
    const n = parseInt(s, 10);
    if (isNaN(n)) return null;
    return new Date(n);
  }
  if (fmt === 'long') return new Date(s);
  return null;
}

function setFromDate(d, except) {
  if (isNaN(d)) return;
  suppressNext = true;
  if (except !== 'iso') els['iso'].value = d.toISOString();
  if (except !== 'iso-date') els['iso-date'].value = d.toISOString().slice(0, 10);
  if (except !== 'us') els['us'].value = `${pad(d.getMonth()+1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  if (except !== 'eu') els['eu'].value = `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  if (except !== 'rfc') els['rfc'].value = d.toUTCString().replace(/GMT$/, '+0000');
  if (except !== 'unix') els['unix'].value = String(Math.floor(d.getTime() / 1000));
  if (except !== 'unix-ms') els['unix-ms'].value = String(d.getTime());
  els['long'].value = d.toLocaleString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  // Clear invalid states on all that aren't the actively-edited one
  fields.forEach(f => { if (f !== except) els[f].classList.remove('invalid'); });
  setTimeout(() => { suppressNext = false; }, 50);
}

function pad(n) { return String(n).padStart(2, '0'); }
