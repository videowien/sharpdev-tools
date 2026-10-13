/**
 * Cron Expression Explainer — SharpDev Tools
 */

const cronInput = document.getElementById('cron-input');
const explainBox = document.getElementById('explain-box');
const errorBox = document.getElementById('error-box');
const nextRunsWrap = document.getElementById('next-runs-wrap');
const nextRunsList = document.getElementById('next-runs');
const fieldsGrid = document.getElementById('fields-grid');

const FIELD_SPECS = [
  { name: 'Minute',       min: 0, max: 59, label: 'minute', names: null },
  { name: 'Hour',         min: 0, max: 23, label: 'hour', names: null },
  { name: 'Day of month', min: 1, max: 31, label: 'day-of-month', names: null },
  { name: 'Month',        min: 1, max: 12, label: 'month', names: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'] },
  { name: 'Day of week',  min: 0, max: 6,  label: 'day-of-week', names: ['SUN','MON','TUE','WED','THU','FRI','SAT'] },
];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function showError(msg) {
  errorBox.innerHTML = `<strong>Error</strong>${escHtml(msg)}`;
  errorBox.style.display = 'block';
  cronInput.classList.add('invalid');
}
function hideError() { errorBox.style.display = 'none'; cronInput.classList.remove('invalid'); }
function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function parseField(segment, spec) {
  // Returns { values: Set<number>, anyValue: boolean }
  const anyValue = segment === '*';
  const result = new Set();
  const parts = segment.split(',');
  for (const part of parts) {
    let body = part, step = 1;
    const slashIdx = part.indexOf('/');
    if (slashIdx !== -1) {
      body = part.slice(0, slashIdx);
      step = parseInt(part.slice(slashIdx + 1), 10);
      if (!Number.isFinite(step) || step <= 0) {
        throw new Error(`Invalid step value "${part.slice(slashIdx + 1)}" in ${spec.label}.`);
      }
    }
    let rangeStart, rangeEnd;
    if (body === '*') { rangeStart = spec.min; rangeEnd = spec.max; }
    else if (body.includes('-')) {
      const [a, b] = body.split('-');
      rangeStart = parseValue(a, spec);
      rangeEnd = parseValue(b, spec);
      if (rangeStart > rangeEnd) throw new Error(`Range ${a}-${b} invalid in ${spec.label}.`);
    } else {
      const v = parseValue(body, spec);
      rangeStart = v; rangeEnd = slashIdx !== -1 ? spec.max : v;
    }
    if (rangeStart < spec.min || rangeEnd > spec.max) {
      throw new Error(`Value out of range in ${spec.label} (${spec.min}-${spec.max}).`);
    }
    for (let v = rangeStart; v <= rangeEnd; v += step) result.add(v);
  }
  return { values: result, anyValue, segment };
}

function parseValue(v, spec) {
  v = v.trim().toUpperCase();
  if (spec.names) {
    const idx = spec.names.indexOf(v);
    if (idx !== -1) return idx + spec.min;
  }
  // Handle day-of-week 7 as Sunday
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) throw new Error(`Invalid value "${v}" in ${spec.label}.`);
  if (spec.label === 'day-of-week' && n === 7) return 0;
  return n;
}

function parseCron(expr) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error(`Expected 5 fields, got ${parts.length}.`);
  const fields = [];
  for (let i = 0; i < 5; i++) {
    fields.push(parseField(parts[i], FIELD_SPECS[i]));
  }
  return fields;
}

function describeField(f, spec) {
  const s = f.segment;
  if (s === '*') return `every ${spec.label.replace('-', ' ')}`;
  if (/^\*\/\d+$/.test(s)) {
    const step = s.split('/')[1];
    const unit = spec.label === 'minute' ? 'minutes' :
                 spec.label === 'hour' ? 'hours' :
                 spec.label === 'day-of-month' ? 'days' :
                 spec.label === 'month' ? 'months' : 'days of the week';
    return `every ${step} ${unit}`;
  }
  // List values
  const vals = [...f.values].sort((a,b)=>a-b);
  const fmt = (v) => {
    if (spec.label === 'month') return MONTH_NAMES[v - 1];
    if (spec.label === 'day-of-week') return DOW_NAMES[v];
    return String(v);
  };
  if (vals.length === 1) {
    if (spec.label === 'minute') return `at minute ${vals[0]}`;
    if (spec.label === 'hour') return `at hour ${vals[0]}`;
    if (spec.label === 'day-of-month') return `on day ${vals[0]} of the month`;
    if (spec.label === 'month') return `in ${fmt(vals[0])}`;
    if (spec.label === 'day-of-week') return `on ${fmt(vals[0])}`;
  }
  // Range?
  const isRange = vals.every((v, i) => i === 0 || v === vals[i-1] + 1);
  if (isRange && vals.length > 2) {
    return `${spec.label.replace('-',' ')} ${fmt(vals[0])}–${fmt(vals[vals.length-1])}`;
  }
  return `${spec.label.replace('-',' ')} ${vals.map(fmt).join(', ')}`;
}

function fieldSummary(f, spec) {
  if (f.anyValue) return `every ${spec.label.replace('-', ' ')}`;
  const vals = [...f.values].sort((a,b)=>a-b);
  if (vals.length === 1) {
    if (spec.label === 'month') return `${MONTH_NAMES[vals[0]-1]} only`;
    if (spec.label === 'day-of-week') return `${DOW_NAMES[vals[0]]} only`;
    return `at ${vals[0]}`;
  }
  if (/^\*\/\d+$/.test(f.segment)) {
    return `every ${f.segment.split('/')[1]} ${spec.label.includes('minute')?'minutes':spec.label.includes('hour')?'hours':'units'}`;
  }
  const isRange = vals.every((v, i) => i === 0 || v === vals[i-1] + 1);
  if (isRange) {
    return `${vals[0]}–${vals[vals.length-1]}`;
  }
  if (vals.length <= 6) return vals.join(', ');
  return `${vals.length} values`;
}

function describeAll(fields) {
  const [min, hr, dom, mon, dow] = fields;
  // Common patterns
  if (min.segment === '*' && hr.segment === '*' && dom.segment === '*' && mon.segment === '*' && dow.segment === '*') {
    return 'Every minute';
  }
  // Every N minutes
  const everyMin = /^\*\/(\d+)$/.exec(min.segment);
  if (everyMin && hr.segment === '*' && dom.segment === '*' && mon.segment === '*' && dow.segment === '*') {
    return `Every ${everyMin[1]} minutes`;
  }
  // Build description
  let desc = '';
  // Time of day part
  if (min.segment !== '*' && hr.segment !== '*' && !min.segment.includes('/') && !hr.segment.includes('/') && min.values.size === 1 && hr.values.size === 1) {
    const h = [...hr.values][0], m = [...min.values][0];
    desc = `At ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  } else {
    const minD = describeField(min, FIELD_SPECS[0]);
    const hrD = describeField(hr, FIELD_SPECS[1]);
    if (min.segment === '0' && hr.segment !== '*') {
      desc = `At the top of ${hrD}`;
    } else if (min.segment === '*' && hr.segment === '*') {
      desc = 'Every minute';
    } else {
      desc = `${capitalize(minD)}, ${hrD}`;
    }
  }
  // Day / month / dow
  const parts = [];
  if (dom.segment !== '*') parts.push(`${describeField(dom, FIELD_SPECS[2])}`);
  if (mon.segment !== '*') parts.push(`${describeField(mon, FIELD_SPECS[3])}`);
  if (dow.segment !== '*') parts.push(`on ${describeField(dow, FIELD_SPECS[4])}`);
  if (parts.length) desc += ', ' + parts.join(', ');
  return desc;
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function matchesAt(fields, date) {
  const [min, hr, dom, mon, dow] = fields;
  if (!min.values.has(date.getMinutes())) return false;
  if (!hr.values.has(date.getHours())) return false;
  if (!mon.values.has(date.getMonth() + 1)) return false;
  // DOM/DOW: if both restricted, OR; if one is *, AND
  const domMatch = dom.values.has(date.getDate());
  const dowMatch = dow.values.has(date.getDay());
  if (dom.anyValue && dow.anyValue) return true;
  if (dom.anyValue) return dowMatch;
  if (dow.anyValue) return domMatch;
  return domMatch || dowMatch;
}

function nextRuns(fields, count) {
  const out = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  const maxIter = 10000;
  for (let i = 0; i < maxIter && out.length < count; i++) {
    if (matchesAt(fields, d)) out.push(new Date(d));
    d.setMinutes(d.getMinutes() + 1);
  }
  return out;
}

function relTime(date) {
  const diff = (date - Date.now()) / 1000;
  const abs = Math.abs(diff);
  let unit, val;
  if (abs < 60) { unit = 'second'; val = Math.round(abs); }
  else if (abs < 3600) { unit = 'minute'; val = Math.round(abs / 60); }
  else if (abs < 86400) { unit = 'hour'; val = Math.round(abs / 3600); }
  else if (abs < 86400 * 30) { unit = 'day'; val = Math.round(abs / 86400); }
  else { unit = 'month'; val = Math.round(abs / (86400 * 30)); }
  const s = val !== 1 ? 's' : '';
  return diff >= 0 ? `in ${val} ${unit}${s}` : `${val} ${unit}${s} ago`;
}

function fmtDate(d) {
  const pad = n => String(n).padStart(2, '0');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return `${days[d.getDay()]} ${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function explain() {
  const expr = cronInput.value.trim();
  if (!expr) {
    hideError();
    explainBox.textContent = 'Type a cron expression.';
    nextRunsWrap.style.display = 'none';
    fieldsGrid.innerHTML = '';
    return;
  }
  let fields;
  try { fields = parseCron(expr); }
  catch (e) {
    showError(e.message);
    explainBox.textContent = 'Invalid expression.';
    nextRunsWrap.style.display = 'none';
    fieldsGrid.innerHTML = '';
    return;
  }
  hideError();
  explainBox.textContent = describeAll(fields);

  // Next runs
  const runs = nextRuns(fields, 5);
  if (!runs.length) {
    nextRunsWrap.style.display = 'block';
    nextRunsList.innerHTML = '<li><span class="when">No runs found within the search window.</span></li>';
  } else {
    nextRunsWrap.style.display = 'block';
    nextRunsList.innerHTML = runs.map(d =>
      `<li><span class="when">${fmtDate(d)}</span><span class="rel">${relTime(d)}</span></li>`
    ).join('');
  }

  // Fields grid
  fieldsGrid.innerHTML = FIELD_SPECS.map((spec, i) => {
    const f = fields[i];
    return `<div class="field-card">
      <div class="fname">${spec.name}</div>
      <div class="fsegment">${escHtml(f.segment)}</div>
      <div class="fmeans">${escHtml(fieldSummary(f, spec))}</div>
    </div>`;
  }).join('');
}

function setExpr(e) {
  cronInput.value = e;
  explain();
}

explain();
