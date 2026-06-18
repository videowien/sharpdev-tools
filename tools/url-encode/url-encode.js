/**
 * URL Encoder/Decoder — SharpDev Tools
 */

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const statsIn = document.getElementById('stats-in');
const statsOut = document.getElementById('stats-out');
const errorBox = document.getElementById('error-box');
const urlPartsBox = document.getElementById('url-parts');
const urlPartsTable = document.getElementById('url-parts-table');
const paramsTable = document.getElementById('params-table');
const paramsHeading = document.getElementById('params-heading');

function showError(msg) {
  errorBox.innerHTML = `<strong>Error</strong>${escHtml(msg)}`;
  errorBox.style.display = 'block';
}
function hideError() { errorBox.style.display = 'none'; }

function doEncode() {
  const s = inputEl.value;
  if (!s) return;
  try { hideError(); outputEl.value = encodeURI(s); updateStats(); }
  catch (e) { showError(e.message); }
}
function doDecode() {
  const s = inputEl.value;
  if (!s) return;
  try { hideError(); outputEl.value = decodeURI(s); updateStats(); }
  catch (e) { showError(e.message); }
}
function doEncodeComponent() {
  const s = inputEl.value;
  if (!s) return;
  try { hideError(); outputEl.value = encodeURIComponent(s); updateStats(); }
  catch (e) { showError(e.message); }
}
function doDecodeComponent() {
  const s = inputEl.value;
  if (!s) return;
  try { hideError(); outputEl.value = decodeURIComponent(s); updateStats(); }
  catch (e) { showError(e.message); }
}

function swap() {
  const t = inputEl.value;
  inputEl.value = outputEl.value;
  outputEl.value = t;
  updateStats();
  onInputChanged();
}

function clearAll() {
  inputEl.value = '';
  outputEl.value = '';
  hideError();
  urlPartsBox.style.display = 'none';
  updateStats();
}

function copyOutput() {
  if (!outputEl.value) return;
  navigator.clipboard.writeText(outputEl.value);
  const btn = document.querySelectorAll('.small-btn')[0];
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 900);
}

function useAsInput() {
  if (!outputEl.value) return;
  inputEl.value = outputEl.value;
  outputEl.value = '';
  updateStats();
  onInputChanged();
}

function updateStats() {
  statsIn.textContent = `${inputEl.value.length.toLocaleString()} chars`;
  statsOut.textContent = `${outputEl.value.length.toLocaleString()} chars`;
}

function onInputChanged() {
  updateStats();
  const v = inputEl.value.trim();
  if (!v) { urlPartsBox.style.display = 'none'; return; }
  parseUrlIfPossible(v);
}

function parseUrlIfPossible(str) {
  try {
    const u = new URL(str);
    const rows = [
      ['Scheme', u.protocol.replace(/:$/, '')],
      ['Host', u.hostname],
    ];
    if (u.port) rows.push(['Port', u.port]);
    if (u.username) rows.push(['User', u.username]);
    if (u.pathname) rows.push(['Path', u.pathname]);
    if (u.hash) rows.push(['Fragment', u.hash.replace(/^#/, '')]);

    urlPartsTable.innerHTML = rows.map(([k, v]) =>
      `<tr><td>${escHtml(k)}</td><td>${escHtml(v)}</td></tr>`
    ).join('');

    const params = [...u.searchParams.entries()];
    if (params.length) {
      paramsHeading.style.display = 'block';
      paramsTable.style.display = 'table';
      paramsTable.innerHTML = params.map(([k, v]) =>
        `<tr><td>${escHtml(k)}</td><td>${escHtml(v)}</td></tr>`
      ).join('');
    } else {
      paramsHeading.style.display = 'none';
      paramsTable.style.display = 'none';
      paramsTable.innerHTML = '';
    }
    urlPartsBox.style.display = 'block';
  } catch (e) {
    urlPartsBox.style.display = 'none';
  }
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

updateStats();
