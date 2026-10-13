/**
 * Line Sorter & Deduplicator — SharpDev Tools
 */

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const statsIn = document.getElementById('stats-in');
const statsOut = document.getElementById('stats-out');

inputEl.addEventListener('input', () => updateStats(inputEl.value, statsIn));

function apply(action) {
  const text = inputEl.value;
  if (!text) { outputEl.value = ''; updateStats('', statsOut); return; }

  let lines = text.split('\n');
  // Strip trailing empty line if input ends with \n (common)
  if (lines.length > 0 && lines[lines.length - 1] === '' && text.endsWith('\n')) {
    lines = lines.slice(0, -1);
  }

  switch (action) {
    case 'sort-asc':
      lines = [...lines].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }));
      break;
    case 'sort-desc':
      lines = [...lines].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base', numeric: true }));
      break;
    case 'sort-len-asc':
      lines = [...lines].sort((a, b) => a.length - b.length);
      break;
    case 'sort-len-desc':
      lines = [...lines].sort((a, b) => b.length - a.length);
      break;
    case 'reverse':
      lines = [...lines].reverse();
      break;
    case 'shuffle':
      lines = shuffle(lines);
      break;
    case 'dedupe': {
      const seen = new Set();
      lines = lines.filter(l => { if (seen.has(l)) return false; seen.add(l); return true; });
      break;
    }
    case 'trim':
      lines = lines.map(l => l.trim());
      break;
    case 'blank':
      lines = lines.filter(l => l.trim() !== '');
      break;
    case 'number': {
      const width = String(lines.length).length;
      lines = lines.map((l, i) => `${String(i + 1).padStart(width, ' ')}. ${l}`);
      break;
    }
  }

  const result = lines.join('\n');
  outputEl.value = result;
  updateStats(result, statsOut);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const r = new Uint32Array(1);
    crypto.getRandomValues(r);
    const j = r[0] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateStats(text, el) {
  if (!text) { el.textContent = '0 lines'; return; }
  const lines = text.split('\n');
  // Don't count trailing empty line
  const count = (lines.length > 0 && lines[lines.length - 1] === '' && text.endsWith('\n'))
    ? lines.length - 1 : lines.length;
  const nonEmpty = lines.filter(l => l.trim()).length;
  el.textContent = `${count} lines · ${nonEmpty} non-empty · ${text.length} chars`;
}

function copyOutput() {
  if (!outputEl.value) return;
  navigator.clipboard.writeText(outputEl.value);
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 900);
}

function swap() {
  if (!outputEl.value) return;
  inputEl.value = outputEl.value;
  outputEl.value = '';
  updateStats(inputEl.value, statsIn);
  updateStats('', statsOut);
}

// Initial stats
updateStats(inputEl.value, statsIn);
updateStats(outputEl.value, statsOut);
