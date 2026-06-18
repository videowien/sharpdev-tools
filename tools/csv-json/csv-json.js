/**
 * CSV ↔ JSON Converter — SharpDev Tools
 */

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const errorBox = document.getElementById('error-box');
const statsIn = document.getElementById('stats-in');
const statsOut = document.getElementById('stats-out');
const delimSel = document.getElementById('opt-delim');
const delimCustom = document.getElementById('opt-delim-custom');

delimSel.addEventListener('change', () => {
  delimCustom.style.display = delimSel.value === 'custom' ? 'inline-block' : 'none';
});

let lastMode = null; // 'tojson' or 'tocsv'

function getDelim() {
  if (delimSel.value === 'custom') return delimCustom.value || ',';
  if (delimSel.value === 'tab') return '\t';
  return delimSel.value;
}

function showError(msg) {
  errorBox.innerHTML = `<strong>Error</strong>${escHtml(msg)}`;
  errorBox.style.display = 'block';
}
function hideError() { errorBox.style.display = 'none'; }
function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function parseCsv(text, delim) {
  // Returns array of arrays of strings. Throws with line/col info on failure.
  const rows = [];
  let cur = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  let line = 1, col = 1;

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; col += 2; continue; }
        inQuotes = false; i++; col++; continue;
      }
      field += c;
      if (c === '\n') { line++; col = 1; } else { col++; }
      i++;
      continue;
    }
    if (c === '"') {
      if (field !== '') {
        throw new Error(`Unexpected quote at line ${line}, column ${col}.`);
      }
      inQuotes = true; i++; col++; continue;
    }
    if (c === delim) { cur.push(field); field = ''; i++; col++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') {
      cur.push(field); rows.push(cur); cur = []; field = '';
      i++; line++; col = 1; continue;
    }
    field += c; i++; col++;
  }
  if (inQuotes) throw new Error(`Unterminated quoted field starting near line ${line}.`);
  // Last field
  if (field !== '' || cur.length) { cur.push(field); rows.push(cur); }
  return rows;
}

function stringifyCsv(rows, delim, quoteAll) {
  const needQuotes = (s) => quoteAll || /[",\r\n]/.test(s) || s.includes(delim);
  const quote = (s) => '"' + String(s).replace(/"/g, '""') + '"';
  return rows.map(r => r.map(f => {
    const s = f == null ? '' : String(f);
    return needQuotes(s) ? quote(s) : s;
  }).join(delim)).join('\n');
}

function autoCoerce(s) {
  if (s === '') return '';
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null') return null;
  if (/^-?\d+$/.test(s)) {
    const n = Number(s);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^-?\d*\.\d+(?:[eE][+-]?\d+)?$/.test(s) || /^-?\d+[eE][+-]?\d+$/.test(s)) {
    return Number(s);
  }
  return s;
}

function csvToJson() {
  hideError();
  const text = inputEl.value;
  if (!text.trim()) { outputEl.value = ''; statsOut.textContent = ''; return; }
  const delim = getDelim();
  const hasHeader = document.getElementById('opt-header').checked;
  const pretty = document.getElementById('opt-pretty').checked;
  let rows;
  try { rows = parseCsv(text, delim); }
  catch (e) { showError(e.message); return; }
  if (!rows.length) { outputEl.value = '[]'; statsOut.textContent = ''; return; }

  let result;
  let cols;
  if (hasHeader) {
    const headers = rows[0];
    cols = headers.length;
    result = rows.slice(1).map(r => {
      const obj = {};
      for (let i = 0; i < headers.length; i++) {
        obj[headers[i]] = autoCoerce(r[i] !== undefined ? r[i] : '');
      }
      return obj;
    });
  } else {
    cols = Math.max(...rows.map(r => r.length));
    result = rows.map(r => r.map(autoCoerce));
  }

  outputEl.value = pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);
  statsOut.textContent = `Parsed ${result.length.toLocaleString()} rows × ${cols} columns`;
  updateStats();
  lastMode = 'tojson';
}

function jsonToCsv() {
  hideError();
  const text = inputEl.value.trim();
  if (!text) { outputEl.value = ''; statsOut.textContent = ''; return; }
  const delim = getDelim();
  const quoteAll = document.getElementById('opt-quote-all').checked;
  let data;
  try { data = JSON.parse(text); }
  catch (e) { showError('Invalid JSON: ' + e.message); return; }
  if (!Array.isArray(data)) {
    if (data && typeof data === 'object') data = [data];
    else { showError('JSON must be an array of objects or an array of arrays.'); return; }
  }
  if (!data.length) { outputEl.value = ''; statsOut.textContent = 'Parsed 0 rows'; return; }

  let rows;
  let cols;
  if (data.every(x => Array.isArray(x))) {
    rows = data.map(r => r.map(v => v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)));
    cols = Math.max(...rows.map(r => r.length));
  } else {
    // object rows — union of keys
    const keys = [];
    const seen = new Set();
    for (const row of data) {
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        for (const k of Object.keys(row)) {
          if (!seen.has(k)) { seen.add(k); keys.push(k); }
        }
      }
    }
    cols = keys.length;
    const body = data.map(row => {
      if (!row || typeof row !== 'object') return keys.map(() => '');
      return keys.map(k => {
        const v = row[k];
        if (v === undefined || v === null) return '';
        if (typeof v === 'object') return JSON.stringify(v);
        return String(v);
      });
    });
    rows = [keys, ...body];
  }

  outputEl.value = stringifyCsv(rows, delim, quoteAll);
  const dataRows = Array.isArray(data[0]) ? rows.length : rows.length - 1;
  statsOut.textContent = `Parsed ${dataRows.toLocaleString()} rows × ${cols} columns`;
  updateStats();
  lastMode = 'tocsv';
}

function swap() {
  const t = inputEl.value;
  inputEl.value = outputEl.value;
  outputEl.value = t;
  updateStats();
}

function clearAll() {
  inputEl.value = ''; outputEl.value = '';
  statsOut.textContent = ''; hideError(); updateStats();
}

function onInputChanged() {
  updateStats();
}

function autoDetect() {
  const v = inputEl.value.trim();
  if (!v) return;
  if (v[0] === '[' || v[0] === '{') jsonToCsv(); else csvToJson();
}

function updateStats() {
  statsIn.textContent = `${inputEl.value.length.toLocaleString()} chars`;
}

function copyOutput() {
  if (!outputEl.value) return;
  navigator.clipboard.writeText(outputEl.value);
  flash(event.target);
}
function useAsInput() {
  if (!outputEl.value) return;
  inputEl.value = outputEl.value; outputEl.value = ''; updateStats(); statsOut.textContent = '';
}
function downloadOut() {
  if (!outputEl.value) return;
  const ext = lastMode === 'tojson' ? 'json' : lastMode === 'tocsv' ? 'csv' : (outputEl.value.trim()[0] === '[' || outputEl.value.trim()[0] === '{' ? 'json' : 'csv');
  const type = ext === 'json' ? 'application/json' : 'text/csv';
  const blob = new Blob([outputEl.value], { type: type + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'output.' + ext;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
function flash(btn) {
  const orig = btn.textContent; btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 900);
}

updateStats();
