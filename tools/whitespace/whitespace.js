/**
 * Whitespace & Invisible Character Cleaner — SharpDev Tools
 */

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const outputHiEl = document.getElementById('output-hi');
const togglesEl = document.getElementById('toggles');
const statsEl = document.getElementById('stats');
const hiModeEl = document.getElementById('hi-mode');

const ZW_RE = /[\u200B\u200C\u200D\uFEFF\u2060\u180E]/g;
const NBSP_RE = /\u00A0/g;
const SMART_Q_RE = /[\u201C\u201D\u201E\u201F\u2018\u2019\u201A\u201B\u2039\u203A\u00AB\u00BB]/g;
const SMART_DASH_RE = /[\u2014\u2013]/g;
const ANSI_RE = /\x1B\[[0-9;?]*[a-zA-Z]/g;
const CTRL_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const TAB_RE = /\t/g;

const OPS = [
  {
    id: 'zw', label: 'Zero-width chars (ZWSP, ZWNJ, ZWJ, BOM, U+2060, U+180E)',
    count: s => (s.match(ZW_RE) || []).length,
    apply: s => s.replace(ZW_RE, ''),
  },
  {
    id: 'nbsp', label: 'Non-breaking spaces \u2192 regular space',
    count: s => (s.match(NBSP_RE) || []).length,
    apply: s => s.replace(NBSP_RE, ' '),
  },
  {
    id: 'smart-q', label: 'Smart quotes \u2192 straight quotes',
    count: s => (s.match(SMART_Q_RE) || []).length,
    apply: s => s
      .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B\u2039\u203A]/g, "'"),
  },
  {
    id: 'smart-d', label: 'Smart dashes (em/en) \u2192 hyphen',
    count: s => (s.match(SMART_DASH_RE) || []).length,
    apply: s => s.replace(SMART_DASH_RE, '-'),
  },
  {
    id: 'trail', label: 'Trim trailing whitespace per line',
    count: s => (s.match(/[ \t]+$/gm) || []).length,
    apply: s => s.replace(/[ \t]+$/gm, ''),
  },
  {
    id: 'collapse', label: 'Collapse multiple spaces to one',
    count: s => (s.match(/ {2,}/g) || []).length,
    apply: s => s.replace(/ {2,}/g, ' '),
  },
  {
    id: 'blank', label: 'Remove consecutive blank lines',
    count: s => (s.match(/\n[ \t]*\n[ \t]*\n/g) || []).length,
    apply: s => s.replace(/(\r?\n[ \t]*){3,}/g, '\n\n'),
  },
  {
    id: 'eol', label: 'Normalize line endings to LF',
    count: s => (s.match(/\r\n|\r(?!\n)/g) || []).length,
    apply: s => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n'),
  },
  {
    id: 'tabs', label: 'Tabs \u2192 2 spaces',
    count: s => (s.match(TAB_RE) || []).length,
    apply: s => s.replace(TAB_RE, '  '),
  },
  {
    id: 'ansi', label: 'Strip ANSI color escape codes',
    count: s => (s.match(ANSI_RE) || []).length,
    apply: s => s.replace(ANSI_RE, ''),
  },
  {
    id: 'ctrl', label: 'Strip other control characters',
    count: s => (s.match(CTRL_RE) || []).length,
    apply: s => s.replace(CTRL_RE, ''),
  },
  {
    id: 'nfc', label: 'NFC normalize (Unicode composition)',
    count: s => {
      try { return s.normalize('NFC') !== s ? 1 : 0; } catch (e) { return 0; }
    },
    apply: s => { try { return s.normalize('NFC'); } catch (e) { return s; } },
  },
];

const DEFAULT_ON = ['zw', 'nbsp', 'trail', 'eol'];

const state = {};
OPS.forEach(o => state[o.id] = DEFAULT_ON.includes(o.id));

function buildToggles() {
  togglesEl.innerHTML = '';
  for (const op of OPS) {
    const row = document.createElement('label');
    row.className = 'toggle-row';
    row.dataset.id = op.id;
    row.innerHTML =
      '<input type="checkbox"' + (state[op.id] ? ' checked' : '') + '>' +
      '<span class="tr-label">' + op.label + '</span>' +
      '<span class="tr-count">0</span>';
    row.querySelector('input').addEventListener('change', e => {
      state[op.id] = e.target.checked;
      run();
    });
    togglesEl.appendChild(row);
  }
}

function run() {
  const src = inputEl.value;
  // Update counts based on current source
  for (const op of OPS) {
    const row = togglesEl.querySelector('[data-id="' + op.id + '"]');
    const c = op.count(src);
    row.querySelector('.tr-count').textContent = c + ' found';
    row.classList.toggle('has-hits', c > 0);
  }

  // Apply in order
  let out = src;
  for (const op of OPS) {
    if (state[op.id]) out = op.apply(out);
  }
  outputEl.value = out;
  renderHi(out);

  const charDelta = out.length - src.length;
  const lineDelta = out.split('\n').length - src.split('\n').length;
  statsEl.textContent = 'In: ' + src.length + ' chars, ' + src.split('\n').length + ' lines \u00b7 ' +
    'Out: ' + out.length + ' chars, ' + out.split('\n').length + ' lines \u00b7 ' +
    '\u0394 ' + (charDelta >= 0 ? '+' : '') + charDelta + ' chars, ' + (lineDelta >= 0 ? '+' : '') + lineDelta + ' lines';
}

function renderHi(text) {
  if (!hiModeEl.checked) { outputHiEl.style.display = 'none'; outputEl.style.display = ''; return; }
  outputHiEl.style.display = '';
  outputEl.style.display = 'none';
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let html = '';
  for (const ch of text) {
    const c = ch.charCodeAt(0);
    if (ch === '\n') { html += '<span class="nl">\u00b6</span>\n'; }
    else if (ch === '\t') { html += '<span class="tab-mark">\u2192   </span>'; }
    else if (ch === ' ') { html += ' '; }
    else if (ch === '\u00A0') { html += '<span class="inv">\u2423</span>'; }
    else if (/[\u200B\u200C\u200D\uFEFF\u2060\u180E]/.test(ch)) { html += '<span class="inv">\u00b7</span>'; }
    else if (c < 0x20 || c === 0x7F) { html += '<span class="inv">?</span>'; }
    else { html += esc(ch); }
  }
  outputHiEl.innerHTML = html;
}

function applyAll() {
  OPS.forEach(o => state[o.id] = true);
  buildToggles();
  run();
}
function resetToggles() {
  OPS.forEach(o => state[o.id] = DEFAULT_ON.includes(o.id));
  buildToggles();
  run();
}
function clearAll() {
  inputEl.value = '';
  run();
}
function copyOutput() {
  navigator.clipboard.writeText(outputEl.value);
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = orig, 900);
}
async function pasteInput() {
  try {
    const t = await navigator.clipboard.readText();
    inputEl.value = t; run();
  } catch (e) { inputEl.focus(); }
}

const SAMPLE = 'Hello\u200B\u200Bworld.\r\nThis\u00A0has\u00A0NBSP.  Multiple   spaces.\r\n\r\n\r\n\u201CSmart quotes\u201D and \u2014 em dashes.\n\n\tA tab here.\nTrailing spaces here.   \n';

function loadSample() {
  inputEl.value = SAMPLE;
  run();
}

inputEl.addEventListener('input', run);
hiModeEl.addEventListener('change', () => renderHi(outputEl.value));

buildToggles();
loadSample();
