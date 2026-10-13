/**
 * LinkedIn About Section Counter — SharpDev Tools
 */

const LIMIT = 2600;
const CUTOFF = 265;

const input = document.getElementById('about-input');
const counterFill = document.getElementById('counter-fill');
const charCount = document.getElementById('char-count');
const cutoffMsg = document.getElementById('cutoff-msg');
const aboutText = document.getElementById('about-text');
const seeMoreBtn = document.getElementById('see-more-btn');
const aboutPreview = document.getElementById('about-preview');

let expanded = false;

function update() {
  const text = input.value;
  const len = text.length;
  charCount.textContent = len + ' / ' + LIMIT;
  const pct = Math.min(100, (len / LIMIT) * 100);
  counterFill.style.width = pct + '%';

  let cls = 'counter-fill';
  if (len > LIMIT) cls += ' over';
  else if (len > LIMIT * 0.9) cls += ' near';
  counterFill.className = cls;

  if (len <= CUTOFF) {
    cutoffMsg.textContent = `${CUTOFF - len} chars before "see more" cutoff`;
    cutoffMsg.className = 'cutoff';
  } else {
    cutoffMsg.textContent = `${len - CUTOFF} chars hidden behind "see more"`;
    cutoffMsg.className = 'cutoff over-cutoff';
  }

  renderPreview(text);
}

function renderPreview(text) {
  if (!text) {
    aboutText.textContent = 'Your About section will preview here.';
    seeMoreBtn.style.display = 'none';
    aboutText.className = 'about-text';
    return;
  }
  if (expanded || text.length <= CUTOFF) {
    aboutText.textContent = text;
    aboutText.className = 'about-text';
    seeMoreBtn.style.display = text.length > CUTOFF ? 'inline' : 'none';
    seeMoreBtn.textContent = expanded ? 'see less' : '…see more';
  } else {
    aboutText.textContent = text.slice(0, CUTOFF);
    aboutText.className = 'about-text truncated';
    seeMoreBtn.style.display = 'inline';
    seeMoreBtn.textContent = '…see more';
  }
}

input.addEventListener('input', update);
seeMoreBtn.addEventListener('click', () => {
  expanded = !expanded;
  renderPreview(input.value);
});

update();
