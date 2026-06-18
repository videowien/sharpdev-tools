/**
 * Twitter / X Bio Counter — 160 char limit, emoji-safe via Intl.Segmenter
 */

const LIMIT = 160;
const bioEl = document.getElementById('bio');
const counterEl = document.getElementById('counter');
const fillEl = document.getElementById('counter-fill');
const nameEl = document.getElementById('display-name');
const handleEl = document.getElementById('handle');
const pBio = document.getElementById('p-bio');
const pName = document.getElementById('p-name');
const pHandle = document.getElementById('p-handle');

// Build a segmenter once if available (modern browsers); fallback to Array.from
const segmenter = (typeof Intl !== 'undefined' && Intl.Segmenter)
  ? new Intl.Segmenter('en', { granularity: 'grapheme' })
  : null;

function countGraphemes(str) {
  if (segmenter) {
    let n = 0;
    for (const _ of segmenter.segment(str)) n++;
    return n;
  }
  // Fallback: counts code-points (close but not perfect for ZWJ sequences)
  return [...str].length;
}

function update() {
  const text = bioEl.value;
  const count = countGraphemes(text);
  counterEl.textContent = `${count} / ${LIMIT}`;
  counterEl.className = 'counter';
  fillEl.className = 'counter-fill';
  const pct = Math.min(100, (count / LIMIT) * 100);
  fillEl.style.width = pct + '%';
  if (count > LIMIT) {
    counterEl.classList.add('over'); fillEl.classList.add('over');
  } else if (count > LIMIT * 0.9) {
    counterEl.classList.add('warn'); fillEl.classList.add('warn');
  }
  pBio.textContent = text || 'Your bio will appear here…';
}

function updatePreview() {
  pName.textContent = nameEl.value || '—';
  pHandle.textContent = '@' + (handleEl.value || '—');
}

bioEl.addEventListener('input', update);
nameEl.addEventListener('input', updatePreview);
handleEl.addEventListener('input', updatePreview);

update();
updatePreview();
