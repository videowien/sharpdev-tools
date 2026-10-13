/**
 * JSON Formatter — SharpDev Tools
 * Uses native JSON.parse/stringify.
 */

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const statsIn = document.getElementById('stats-in');
const statsOut = document.getElementById('stats-out');
const errorBox = document.getElementById('error-box');
const successBox = document.getElementById('success-box');

function parseJson(str) {
  return JSON.parse(str);
}

function tryParse(str) {
  try { return { ok: true, value: JSON.parse(str) }; }
  catch (e) { return { ok: false, error: e }; }
}

function showError(err, str) {
  successBox.style.display = 'none';
  let msg = err.message || String(err);
  // Try to extract position info
  const posMatch = msg.match(/position (\d+)/);
  let extra = '';
  if (posMatch) {
    const pos = parseInt(posMatch[1]);
    // Compute line and column
    let line = 1, col = 1;
    for (let i = 0; i < pos && i < str.length; i++) {
      if (str[i] === '\n') { line++; col = 1; }
      else col++;
    }
    extra = ` (line ${line}, column ${col})`;
  }
  errorBox.innerHTML = `<strong>Invalid JSON</strong>${escHtml(msg)}${extra}`;
  errorBox.style.display = 'block';
}

function showSuccess(msg) {
  errorBox.style.display = 'none';
  successBox.textContent = msg;
  successBox.style.display = 'block';
  setTimeout(() => { successBox.style.display = 'none'; }, 2500);
}

function hideMessages() {
  errorBox.style.display = 'none';
  successBox.style.display = 'none';
}

function format(indent) {
  const str = inputEl.value.trim();
  if (!str) { outputEl.value = ''; updateStats(); return; }
  const res = tryParse(str);
  if (!res.ok) { showError(res.error, str); outputEl.value = ''; updateStats(); return; }
  hideMessages();
  outputEl.value = JSON.stringify(res.value, null, indent);
  updateStats();
  showSuccess(`Valid JSON · ${describe(res.value)}`);
}

function minify() {
  const str = inputEl.value.trim();
  if (!str) return;
  const res = tryParse(str);
  if (!res.ok) { showError(res.error, str); return; }
  hideMessages();
  outputEl.value = JSON.stringify(res.value);
  updateStats();
  const saved = str.length - outputEl.value.length;
  showSuccess(`Minified · saved ${saved} chars (${Math.round((saved / str.length) * 100)}%)`);
}

function sortKeys() {
  const str = inputEl.value.trim();
  if (!str) return;
  const res = tryParse(str);
  if (!res.ok) { showError(res.error, str); return; }
  hideMessages();
  const sorted = deepSort(res.value);
  outputEl.value = JSON.stringify(sorted, null, 2);
  updateStats();
  showSuccess('Keys sorted alphabetically');
}

function deepSort(value) {
  if (Array.isArray(value)) return value.map(deepSort);
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value).sort().forEach(k => { out[k] = deepSort(value[k]); });
    return out;
  }
  return value;
}

function jsonEscape() {
  const str = inputEl.value;
  if (!str) return;
  hideMessages();
  outputEl.value = JSON.stringify(str);
  updateStats();
  showSuccess('Escaped as JSON string');
}

function jsonUnescape() {
  const str = inputEl.value.trim();
  if (!str) return;
  const res = tryParse(str);
  if (!res.ok) { showError(res.error, str); return; }
  if (typeof res.value !== 'string') {
    showError({ message: 'Input is not a JSON string (expected a quoted string like "hello\\nworld")' }, str);
    return;
  }
  hideMessages();
  outputEl.value = res.value;
  updateStats();
  showSuccess('Unescaped string');
}

function autoFormat() {
  updateStats();
  // Validate live without writing output
  const str = inputEl.value.trim();
  if (!str) { hideMessages(); return; }
  const res = tryParse(str);
  if (!res.ok) showError(res.error, str);
  else hideMessages();
}

function updateStats() {
  const inLen = inputEl.value.length;
  const outLen = outputEl.value.length;
  statsIn.textContent = `${inLen.toLocaleString()} chars`;
  statsOut.textContent = `${outLen.toLocaleString()} chars`;
}

function describe(val) {
  if (Array.isArray(val)) return `array with ${val.length} item${val.length !== 1 ? 's' : ''}`;
  if (val === null) return 'null';
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    return `object with ${keys.length} key${keys.length !== 1 ? 's' : ''}`;
  }
  return typeof val;
}

function copyOutput() {
  if (!outputEl.value) return;
  navigator.clipboard.writeText(outputEl.value);
  const btns = document.querySelectorAll('.small-btn');
  const btn = btns[0];
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 900);
}

function useAsInput() {
  if (!outputEl.value) return;
  inputEl.value = outputEl.value;
  outputEl.value = '';
  updateStats();
  autoFormat();
}

function clearAll() {
  inputEl.value = '';
  outputEl.value = '';
  updateStats();
  hideMessages();
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

updateStats();
