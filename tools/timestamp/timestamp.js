/**
 * Timestamp Converter — SharpDev Tools
 */

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

function pad(n) { return String(n).padStart(2, '0'); }

function formatLocal(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function updateNow() {
  const now = new Date();
  const nowUnix = document.getElementById('now-unix');
  const nowHuman = document.getElementById('now-human');
  nowUnix.textContent = Math.floor(now.getTime() / 1000);
  nowHuman.textContent = `${formatLocal(now)} (${TZ})`;
}
setInterval(updateNow, 1000);
updateNow();

// Click to copy the current unix timestamp
document.getElementById('now-unix').addEventListener('click', function() {
  navigator.clipboard.writeText(this.textContent);
  const original = this.textContent;
  this.textContent = 'Copied!';
  setTimeout(() => updateNow(), 700);
});

function convertUnix() {
  const raw = document.getElementById('unix-in').value.trim();
  const resultEl = document.getElementById('unix-result');
  if (!raw) { resultEl.innerHTML = '<div class="result-empty">Enter a timestamp above</div>'; return; }

  const num = Number(raw);
  if (!isFinite(num) || isNaN(num)) {
    resultEl.innerHTML = '<div class="result-empty">Not a valid number</div>';
    return;
  }

  const unit = document.querySelector('input[name="unit"]:checked').value;
  let ms;
  if (unit === 's') ms = num * 1000;
  else if (unit === 'ms') ms = num;
  else {
    // Auto-detect: if number has more than 11 digits, assume ms
    ms = Math.abs(num) > 1e12 ? num : num * 1000;
  }

  const d = new Date(ms);
  if (isNaN(d)) {
    resultEl.innerHTML = '<div class="result-empty">Out of range</div>';
    return;
  }

  renderDateResult(resultEl, d);
}

function convertDate() {
  const raw = document.getElementById('date-in').value;
  const resultEl = document.getElementById('date-result');
  if (!raw) { resultEl.innerHTML = '<div class="result-empty">Pick a date above</div>'; return; }
  const d = new Date(raw);
  if (isNaN(d)) { resultEl.innerHTML = '<div class="result-empty">Invalid date</div>'; return; }

  const rows = [
    ['Unix (seconds)', Math.floor(d.getTime() / 1000)],
    ['Unix (ms)', d.getTime()],
    ['ISO 8601', d.toISOString()],
    ['UTC', d.toUTCString()],
  ];
  resultEl.innerHTML = rows.map(([l, v]) =>
    `<div class="r-row"><span class="r-label">${l}</span><span class="r-val" onclick="copyText(this, '${v}')">${v}</span></div>`
  ).join('');
}

function renderDateResult(el, d) {
  const relative = formatRelative(d);
  const rows = [
    ['Local', `${formatLocal(d)} (${TZ})`],
    ['ISO 8601', d.toISOString()],
    ['UTC', d.toUTCString()],
    ['Unix (s)', Math.floor(d.getTime() / 1000)],
    ['Unix (ms)', d.getTime()],
    ['Relative', relative],
  ];
  el.innerHTML = rows.map(([l, v]) =>
    `<div class="r-row"><span class="r-label">${l}</span><span class="r-val" onclick="copyText(this, ${JSON.stringify(String(v))})">${v}</span></div>`
  ).join('');
}

function computeAgo() {
  const raw = document.getElementById('ago-in').value.trim();
  const resultEl = document.getElementById('ago-result');
  if (!raw) { resultEl.innerHTML = '<div class="result-empty">Enter a timestamp or date</div>'; return; }

  let d;
  const num = Number(raw);
  if (isFinite(num) && !isNaN(num)) {
    d = new Date(Math.abs(num) > 1e12 ? num : num * 1000);
  } else {
    d = new Date(raw);
  }

  if (isNaN(d)) { resultEl.innerHTML = '<div class="result-empty">Not a valid date or timestamp</div>'; return; }

  const relative = formatRelative(d);
  const rows = [
    ['Parsed as', d.toISOString()],
    ['Relative', relative],
  ];
  resultEl.innerHTML = rows.map(([l, v]) =>
    `<div class="r-row"><span class="r-label">${l}</span><span class="r-val" onclick="copyText(this, ${JSON.stringify(String(v))})">${v}</span></div>`
  ).join('');
}

function formatRelative(d) {
  const now = Date.now();
  const diff = d.getTime() - now;
  const abs = Math.abs(diff);
  const sec = Math.round(abs / 1000);
  const min = Math.round(abs / 60000);
  const hr = Math.round(abs / 3600000);
  const day = Math.round(abs / 86400000);
  const year = Math.round(abs / (365.25 * 86400000));
  const month = Math.round(abs / (30.44 * 86400000));

  let str;
  if (sec < 60) str = `${sec} second${sec !== 1 ? 's' : ''}`;
  else if (min < 60) str = `${min} minute${min !== 1 ? 's' : ''}`;
  else if (hr < 24) str = `${hr} hour${hr !== 1 ? 's' : ''}`;
  else if (day < 30) str = `${day} day${day !== 1 ? 's' : ''}`;
  else if (month < 24) str = `${month} month${month !== 1 ? 's' : ''}`;
  else str = `${year} year${year !== 1 ? 's' : ''}`;

  return diff >= 0 ? `in ${str}` : `${str} ago`;
}

function setNow() {
  const now = new Date();
  const iso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById('date-in').value = iso;
  convertDate();
}

function copyText(el, text) {
  navigator.clipboard.writeText(text);
  el.classList.add('copied');
  const orig = el.textContent;
  el.textContent = '✓ Copied';
  setTimeout(() => { el.textContent = orig; el.classList.remove('copied'); }, 800);
}

// Initial demo values
document.getElementById('unix-in').value = Math.floor(Date.now() / 1000);
convertUnix();
setNow();
