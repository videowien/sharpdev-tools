/**
 * LinkedIn Post Counter — 3000 char limit with 210-char "see more" cutoff.
 */
const LI_LIMIT = 3000;
const LI_HOOK = 210;

const textIn = document.getElementById('text-in');
const bar = document.getElementById('li-bar');
const meter = document.getElementById('li-meter');
const cnt = document.getElementById('li-count');
const hookEl = document.getElementById('li-hook');
const prevBody = document.getElementById('li-preview-body');
const prevMeta = document.getElementById('li-preview-meta');

function codePoints(s) { return [...s].length; }

function update() {
  const text = textIn.value;
  const len = codePoints(text);
  cnt.textContent = len;

  const pct = Math.min(100, (len / LI_LIMIT) * 100);
  bar.style.width = pct + '%';
  bar.classList.remove('warn', 'over');
  meter.classList.remove('over');
  if (len > LI_LIMIT) {
    bar.classList.add('over'); meter.classList.add('over');
  } else if (len > LI_LIMIT * 0.9) {
    bar.classList.add('warn');
  }

  const hookLen = Math.min(len, LI_HOOK);
  hookEl.textContent = `${hookLen}/${LI_HOOK} hook`;

  // Preview: first 210 chars, then "...see more" if longer
  const graphemes = [...text];
  if (graphemes.length === 0) {
    prevBody.textContent = '—';
    prevBody.classList.add('empty');
    prevMeta.textContent = '';
    return;
  }
  prevBody.classList.remove('empty');
  if (graphemes.length <= LI_HOOK) {
    prevBody.textContent = text;
    prevMeta.textContent = 'Fully visible in feed (no truncation).';
  } else {
    const hookText = graphemes.slice(0, LI_HOOK).join('');
    prevBody.innerHTML = '';
    prevBody.appendChild(document.createTextNode(hookText));
    const cut = document.createElement('span');
    cut.className = 'cutoff';
    cut.textContent = '\u2026see more';
    prevBody.appendChild(cut);
    const hidden = graphemes.length - LI_HOOK;
    prevMeta.textContent = `Truncated — ${hidden} char${hidden === 1 ? '' : 's'} hidden until click.`;
  }
}

textIn.addEventListener('input', update);
window.liGo = update;
update();
