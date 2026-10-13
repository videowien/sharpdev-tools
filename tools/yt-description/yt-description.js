/**
 * YouTube Description Counter + Link/Hashtag/Chapter Extractor
 */

const LIMIT = 5000;
const FOLD = 157;

const descEl = document.getElementById('desc');
const counter = document.getElementById('counter');
const fill = document.getElementById('counter-fill');
const fold = document.getElementById('preview-fold');
const statusMsg = document.getElementById('status-msg');

function update() {
  const text = descEl.value;
  const count = text.length;
  counter.textContent = `${count} / ${LIMIT}`;
  counter.className = 'counter';
  fill.className = 'counter-fill';
  const pct = Math.min(100, (count / LIMIT) * 100);
  fill.style.width = pct + '%';
  if (count > LIMIT) { counter.classList.add('over'); fill.classList.add('over'); }
  else if (count > LIMIT * 0.9) { counter.classList.add('warn'); fill.classList.add('warn'); }

  // Above-the-fold preview
  if (!text) {
    fold.textContent = '—';
  } else {
    const visible = text.slice(0, FOLD);
    const rest = text.slice(FOLD);
    fold.textContent = visible;
    if (rest.length) {
      const more = document.createElement('span');
      more.className = 'cut-marker';
      more.textContent = '…Show more';
      fold.appendChild(more);
    }
  }

  // Detect chapters: lines starting with a timestamp like 0:00, 00:00, 1:23:45
  const chapterRe = /^\s*(\d{1,2}:)?\d{1,2}:\d{2}(?=[\s\-—]|$)/gm;
  const chapterLines = [];
  text.split('\n').forEach(line => {
    if (chapterRe.test(line)) chapterLines.push(line.trim());
    chapterRe.lastIndex = 0;
  });
  setList('d-chapters', chapterLines);

  // Validate chapter requirements
  const hasZeroStart = chapterLines.some(l => /^\s*0+:0+(?=[\s\-—]|$)/.test(l));
  document.getElementById('warn-chapters').style.display =
    (chapterLines.length > 0 && (!hasZeroStart || chapterLines.length < 3)) ? '' : 'none';

  // Detect links
  const linkRe = /https?:\/\/[^\s)<>]+/g;
  setList('d-links', text.match(linkRe) || []);

  // Detect hashtags
  const hashRe = /(?<=^|\s)#[A-Za-z0-9_]+/g;
  const hashtags = text.match(hashRe) || [];
  setList('d-hashtags', hashtags);
  document.getElementById('warn-hashtags').style.display = hashtags.length > 15 ? '' : 'none';

  // Detect mentions / channels
  const mentionRe = /(?<=^|\s)@[A-Za-z0-9_.-]+/g;
  setList('d-mentions', text.match(mentionRe) || []);
}

function setList(id, items) {
  const el = document.getElementById(id);
  if (!items || items.length === 0) { el.innerHTML = '—'; return; }
  el.innerHTML = items.map(i => `<span class="item">${escapeHtml(i)}</span>`).join('');
  el.firstChild.parentNode.firstChild.before(document.createComment(items.length + ' items'));
}

function escapeHtml(s) {
  const d = document.createElement('div'); d.textContent = s; return d.innerHTML;
}

document.getElementById('copy-btn').addEventListener('click', async () => {
  if (!descEl.value) return;
  await navigator.clipboard.writeText(descEl.value);
  statusMsg.textContent = '✓ Copied';
  statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
});

descEl.addEventListener('input', update);
update();
