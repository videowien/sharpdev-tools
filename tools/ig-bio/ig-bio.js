/**
 * Instagram Bio Line Break Generator — SharpDev Tools
 * Preserves bio line breaks by injecting U+200B zero-width-space.
 */

const ZWSP = '​';

const input = document.getElementById('bio-input');
const output = document.getElementById('bio-output');
const charCount = document.getElementById('char-count');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const statusMsg = document.getElementById('status-msg');

function formatBio(raw) {
  // For every line that's empty OR appears between content, prepend ZWSP
  // so Instagram doesn't strip the line break. Be conservative: only inject
  // on lines that would otherwise be collapsed.
  const lines = raw.split(/\r?\n/);
  return lines.map((line, i) => {
    // Empty lines: add ZWSP so they're treated as "non-empty"
    if (line.length === 0) return ZWSP;
    // Non-empty lines: keep as is
    return line;
  }).join('\n');
}

function update() {
  const raw = input.value;
  const formatted = formatBio(raw);
  output.value = formatted;
  // Count INCLUDING invisible characters (since IG counts them against the limit)
  const total = formatted.length;
  const visible = raw.replace(/\n/g, '').length;
  charCount.textContent = `${total} / 150 (${visible} visible)`;
  charCount.className = 'char-count' + (total > 150 ? ' over' : '');
}

input.addEventListener('input', update);

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.value);
  statusMsg.textContent = '✓ Copied. Paste into Instagram bio field.';
  statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 2500);
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  output.value = '';
  charCount.textContent = '0 / 150';
  charCount.className = 'char-count';
  statusMsg.textContent = '';
  input.focus();
});

update();
