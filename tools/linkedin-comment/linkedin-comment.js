/**
 * LinkedIn Comment Counter — 1250 char limit, 3-line clamp preview
 */

const LIMIT = 1250;
const commentEl = document.getElementById('comment');
const counter = document.getElementById('counter');
const fill = document.getElementById('counter-fill');
const previewText = document.getElementById('preview-text');

function update() {
  const text = commentEl.value;
  const count = text.length;
  counter.textContent = `${count} / ${LIMIT}`;
  counter.className = 'counter';
  fill.className = 'counter-fill';
  const pct = Math.min(100, (count / LIMIT) * 100);
  fill.style.width = pct + '%';
  if (count > LIMIT) { counter.classList.add('over'); fill.classList.add('over'); }
  else if (count > LIMIT * 0.9) { counter.classList.add('warn'); fill.classList.add('warn'); }

  if (text) {
    previewText.textContent = text;
    // Approximate "see more" — kicks in around 250 chars or 3 lines
    if (text.length > 200 || text.split('\n').length > 3) {
      previewText.classList.add('show-cut');
    } else {
      previewText.classList.remove('show-cut');
    }
  } else {
    previewText.textContent = 'Your comment will appear here…';
    previewText.classList.remove('show-cut');
  }
}

commentEl.addEventListener('input', update);
update();
