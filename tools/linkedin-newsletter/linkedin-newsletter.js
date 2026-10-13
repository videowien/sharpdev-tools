/**
 * LinkedIn Newsletter Counter — Title (150) + Body (110000), reading time, preview
 */

const TITLE_LIMIT = 150;
const BODY_LIMIT = 110000;
const WPM = 200; // standard reading speed

const titleEl = document.getElementById('title');
const bodyEl = document.getElementById('body');

function updateField(value, limit, counterId, fillId) {
  const count = value.length;
  const counter = document.getElementById(counterId);
  const fill = document.getElementById(fillId);
  counter.textContent = `${count.toLocaleString()} / ${limit.toLocaleString()}`;
  counter.className = 'counter';
  fill.className = 'counter-fill';
  fill.style.width = Math.min(100, (count / limit) * 100) + '%';
  if (count > limit) { counter.classList.add('over'); fill.classList.add('over'); }
  else if (count > limit * 0.9) { counter.classList.add('warn'); fill.classList.add('warn'); }
}

function update() {
  const title = titleEl.value;
  const body = bodyEl.value;
  updateField(title, TITLE_LIMIT, 'title-counter', 'title-fill');
  updateField(body, BODY_LIMIT, 'body-counter', 'body-fill');

  // Stats
  const words = (body.trim().match(/\S+/g) || []).length;
  const paragraphs = body.trim() ? body.trim().split(/\n\n+/).length : 0;
  const mins = Math.max(1, Math.round(words / WPM));
  document.getElementById('s-words').textContent = words.toLocaleString();
  document.getElementById('s-paragraphs').textContent = paragraphs;
  document.getElementById('s-time').textContent = `${mins} min`;

  // Preview
  document.getElementById('p-title').textContent = title || 'Newsletter title preview…';
  document.getElementById('p-snippet').textContent = body ? body.slice(0, 200) + (body.length > 200 ? '…' : '') : 'First ~200 chars of body show here in the feed snippet.';
}

[titleEl, bodyEl].forEach(el => el.addEventListener('input', update));
update();
