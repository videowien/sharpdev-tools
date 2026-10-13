/**
 * Time Zone Converter — SharpDev Tools
 */

const FALLBACK_ZONES = [
  'UTC',
  'Africa/Cairo','Africa/Johannesburg','Africa/Lagos','Africa/Nairobi','Africa/Casablanca','Africa/Algiers',
  'America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Phoenix','America/Anchorage','America/Honolulu',
  'America/Toronto','America/Vancouver','America/Mexico_City','America/Sao_Paulo','America/Buenos_Aires','America/Bogota','America/Lima','America/Santiago','America/Caracas','America/Halifax',
  'Asia/Tokyo','Asia/Shanghai','Asia/Hong_Kong','Asia/Singapore','Asia/Seoul','Asia/Taipei','Asia/Bangkok','Asia/Jakarta','Asia/Manila','Asia/Ho_Chi_Minh',
  'Asia/Kolkata','Asia/Dubai','Asia/Tehran','Asia/Riyadh','Asia/Jerusalem','Asia/Karachi','Asia/Dhaka','Asia/Kathmandu','Asia/Yangon','Asia/Almaty',
  'Atlantic/Azores','Atlantic/Cape_Verde','Atlantic/Reykjavik',
  'Australia/Sydney','Australia/Melbourne','Australia/Perth','Australia/Brisbane','Australia/Adelaide','Australia/Hobart','Australia/Darwin',
  'Europe/London','Europe/Paris','Europe/Berlin','Europe/Madrid','Europe/Rome','Europe/Amsterdam','Europe/Brussels','Europe/Vienna','Europe/Zurich','Europe/Warsaw','Europe/Stockholm','Europe/Oslo','Europe/Copenhagen','Europe/Helsinki','Europe/Dublin','Europe/Lisbon','Europe/Prague','Europe/Budapest','Europe/Athens','Europe/Istanbul','Europe/Moscow','Europe/Kyiv','Europe/Bucharest',
  'Pacific/Auckland','Pacific/Fiji','Pacific/Honolulu','Pacific/Guam','Pacific/Samoa','Pacific/Tahiti',
  'Indian/Mauritius','Indian/Maldives','Indian/Reunion',
];

function getAllZones() {
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }
  } catch (e) {}
  return FALLBACK_ZONES;
}

const ZONES = getAllZones();

function cityFromZone(z) {
  const parts = z.split('/');
  return parts[parts.length - 1].replace(/_/g, ' ');
}
function regionFromZone(z) {
  if (z === 'UTC' || z === 'GMT') return 'UTC';
  const parts = z.split('/');
  return parts.length > 1 ? parts[0] : 'Other';
}

function offsetFor(zone, date) {
  // Returns UTC offset string like "+02:00"
  try {
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' });
    const parts = dtf.formatToParts(date);
    const tz = parts.find(p => p.type === 'timeZoneName');
    if (tz) {
      // e.g. "GMT+2" or "GMT-05:30" or "GMT"
      let s = tz.value.replace(/^GMT/, '').replace(/^UTC/, '');
      if (!s) return '+00:00';
      // normalize +2 -> +02:00
      const m = s.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
      if (m) {
        const sign = m[1];
        const hh = m[2].padStart(2, '0');
        const mm = m[3] || '00';
        return sign + hh + ':' + mm;
      }
      return s;
    }
  } catch (e) {}
  return '';
}

function formatInZone(zone, date, opts) {
  try {
    return new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: zone }, opts)).format(date);
  } catch (e) {
    return '';
  }
}

function getZoneDateParts(zone, date) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, weekday: 'short',
  });
  const parts = {};
  dtf.formatToParts(date).forEach(p => parts[p.type] = p.value);
  return parts;
}

// ============ TZ PICKER ============

function buildDropdown(listEl, items, onPick) {
  listEl.innerHTML = '';
  // Group by region
  const groups = {};
  for (const z of items) {
    const r = regionFromZone(z);
    (groups[r] = groups[r] || []).push(z);
  }
  const regionOrder = ['UTC', 'Africa', 'America', 'Antarctica', 'Arctic', 'Asia', 'Atlantic', 'Australia', 'Europe', 'Indian', 'Pacific', 'Other'];
  const sortedRegions = Object.keys(groups).sort((a, b) => {
    const ai = regionOrder.indexOf(a), bi = regionOrder.indexOf(b);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
  const now = new Date();
  for (const region of sortedRegions) {
    const head = document.createElement('div');
    head.className = 'tz-group-head';
    head.textContent = region;
    listEl.appendChild(head);
    for (const z of groups[region].sort()) {
      const row = document.createElement('div');
      row.className = 'tz-item';
      const city = cityFromZone(z);
      const off = offsetFor(z, now);
      row.innerHTML = '<span>' + city + '</span><span class="offset">UTC' + off + '</span>';
      row.addEventListener('click', () => onPick(z));
      listEl.appendChild(row);
    }
  }
}

function filterZones(q) {
  if (!q) return ZONES;
  const s = q.toLowerCase();
  return ZONES.filter(z => z.toLowerCase().includes(s) || cityFromZone(z).toLowerCase().includes(s));
}

function wirePicker(searchId, dropdownId, onPick) {
  const search = document.getElementById(searchId);
  const dd = document.getElementById(dropdownId);
  const wrap = search.closest('.tz-picker');

  function refresh() {
    buildDropdown(dd, filterZones(search.value), z => {
      onPick(z);
      wrap.classList.remove('open');
      search.blur();
    });
  }
  search.addEventListener('focus', () => { wrap.classList.add('open'); refresh(); });
  search.addEventListener('input', refresh);
  search.addEventListener('blur', () => { setTimeout(() => wrap.classList.remove('open'), 150); });
}

// ============ CONVERT SECTION ============

let fromZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
let toZones = [];

document.getElementById('from-zone').value = fromZone;
document.getElementById('from-search').value = cityFromZone(fromZone);

function setFromZone(z) {
  fromZone = z;
  document.getElementById('from-zone').value = z;
  document.getElementById('from-search').value = cityFromZone(z);
  updateConvert();
}

function addToZone(z) {
  if (toZones.includes(z)) return;
  if (toZones.length >= 6) return;
  toZones.push(z);
  document.getElementById('to-search').value = '';
  renderChips();
  updateConvert();
}

function removeToZone(z) {
  toZones = toZones.filter(x => x !== z);
  renderChips();
  updateConvert();
}

function renderChips() {
  const wrap = document.getElementById('to-chips');
  wrap.innerHTML = '';
  for (const z of toZones) {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.innerHTML = cityFromZone(z) + ' <button>&times;</button>';
    chip.querySelector('button').addEventListener('click', () => removeToZone(z));
    wrap.appendChild(chip);
  }
}

wirePicker('from-search', 'from-dropdown', setFromZone);
wirePicker('to-search', 'to-dropdown', addToZone);

// initial defaults for to
['America/New_York', 'Europe/London', 'Asia/Tokyo'].forEach(addToZone);

// Default date/time
(function initDT() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('c-date').value = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  document.getElementById('c-time').value = pad(now.getHours()) + ':' + pad(now.getMinutes());
})();

function parseInput() {
  const d = document.getElementById('c-date').value;
  const t = document.getElementById('c-time').value || '00:00';
  if (!d) return null;
  // Interpret as if in fromZone. Use a trick: construct the wall time, then compute offset in fromZone.
  const [yy, mo, dd] = d.split('-').map(Number);
  const [hh, mi] = t.split(':').map(Number);
  // Guess a Date near it in UTC, then adjust by fromZone offset.
  const asUTC = Date.UTC(yy, mo - 1, dd, hh, mi);
  const off = offsetFor(fromZone, new Date(asUTC));
  const sign = off[0] === '-' ? -1 : 1;
  const [oh, om] = off.slice(1).split(':').map(Number);
  const offMin = sign * (oh * 60 + om);
  return new Date(asUTC - offMin * 60 * 1000);
}

function updateConvert() {
  const date = parseInput();
  const wrap = document.getElementById('convert-results');
  if (!date || isNaN(date.getTime())) { wrap.innerHTML = ''; return; }
  const cards = [];
  const srcParts = getZoneDateParts(fromZone, date);
  const srcDay = srcParts.year + '-' + srcParts.month + '-' + srcParts.day;
  for (const z of toZones) {
    const parts = getZoneDateParts(z, date);
    const dayStr = parts.year + '-' + parts.month + '-' + parts.day;
    const off = offsetFor(z, date);
    // day offset
    let dayBadge = '';
    if (dayStr !== srcDay) {
      const diff = new Date(dayStr).getTime() - new Date(srcDay).getTime();
      const d = Math.round(diff / 86400000);
      dayBadge = '<span class="day-badge">' + (d > 0 ? '+' : '') + d + 'd</span>';
    }
    cards.push(
      '<div class="result-card">' +
        '<div class="zone-name">' + cityFromZone(z) + '</div>' +
        '<div class="result-time">' + parts.hour + ':' + parts.minute + '</div>' +
        '<div class="result-date">' + parts.weekday + ', ' + parts.day + '/' + parts.month + '/' + parts.year + ' · UTC' + off + ' ' + dayBadge + '</div>' +
      '</div>'
    );
  }
  wrap.innerHTML = cards.join('');
}

['c-date', 'c-time'].forEach(id => document.getElementById(id).addEventListener('input', updateConvert));

updateConvert();

// ============ WORLD CLOCK ============

const WC_KEY = 'sd-timezone-wc';
const DEFAULT_WC = ['America/New_York', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney'];

function loadWC() {
  try {
    const raw = localStorage.getItem(WC_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...DEFAULT_WC];
}
function saveWC() {
  try { localStorage.setItem(WC_KEY, JSON.stringify(wcZones)); } catch (e) {}
}

let wcZones = loadWC();

wirePicker('wc-search', 'wc-dropdown', z => {
  if (!wcZones.includes(z)) { wcZones.push(z); saveWC(); renderWC(); }
  document.getElementById('wc-search').value = '';
});

function renderWC() {
  const wrap = document.getElementById('wc-grid');
  const now = new Date();
  wrap.innerHTML = '';
  for (const z of wcZones) {
    const parts = getZoneDateParts(z, now);
    const hour = +parts.hour;
    const isBusiness = hour >= 9 && hour < 17;
    const isNight = hour < 6 || hour >= 22;
    const cls = isBusiness ? ' business' : (isNight ? ' night' : '');
    const status = isBusiness ? 'Business hours' : (isNight ? 'Night' : 'Daytime');
    const off = offsetFor(z, now);
    const card = document.createElement('div');
    card.className = 'wc-card' + cls;
    card.innerHTML =
      '<button class="remove-btn" aria-label="Remove">&times;</button>' +
      '<div class="wc-city">' + cityFromZone(z) + '</div>' +
      '<div class="wc-time">' + parts.hour + ':' + parts.minute + ':' + parts.second + '</div>' +
      '<div class="wc-meta">' + parts.weekday + ', ' + parts.day + '/' + parts.month + '/' + parts.year + ' · UTC' + off + '</div>' +
      '<div class="wc-status">' + status + '</div>';
    card.querySelector('.remove-btn').addEventListener('click', () => {
      wcZones = wcZones.filter(x => x !== z);
      saveWC(); renderWC();
    });
    wrap.appendChild(card);
  }
}

renderWC();
setInterval(() => { if (!document.hidden) renderWC(); }, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) renderWC(); });
