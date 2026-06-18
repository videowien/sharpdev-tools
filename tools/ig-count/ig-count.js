/**
 * Instagram Caption Counter with feed preview + hashtag extraction.
 */
const IG_LIMIT = 2200;
const IG_HOOK = 125; // approximate chars before "...more" in feed
const IG_TAGS_MAX = 30;

const textIn = document.getElementById('text-in');
const bar = document.getElementById('ig-bar');
const meter = document.getElementById('ig-meter');
const cnt = document.getElementById('ig-count');
const tagsLbl = document.getElementById('ig-tags');
const prevBody = document.getElementById('ig-preview-body');
const prevMeta = document.getElementById('ig-preview-meta');
const tagsPanel = document.getElementById('ig-hashtags');
const tagsList = document.getElementById('ig-hashtags-list');
const copyTags = document.getElementById('copy-tags');

function codePoints(s) { return [...s].length; }

function extractHashtags(s) {
  const re = /#([\p{L}\p{N}_]+)/gu;
  const found = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(s)) !== null) {
    const tag = '#' + m[1];
    if (!seen.has(tag.toLowerCase())) {
      seen.add(tag.toLowerCase());
      found.push(tag);
    }
  }
  return found;
}

function igGo() {
  const text = textIn.value;
  const len = codePoints(text);
  cnt.textContent = len;

  const pct = Math.min(100, (len / IG_LIMIT) * 100);
  bar.style.width = pct + '%';
  bar.classList.remove('warn', 'over');
  meter.classList.remove('over');
  if (len > IG_LIMIT) { bar.classList.add('over'); meter.classList.add('over'); }
  else if (len > IG_LIMIT * 0.9) { bar.classList.add('warn'); }

  // Hashtags
  const tags = extractHashtags(text);
  tagsLbl.textContent = `${tags.length} / ${IG_TAGS_MAX} hashtags`;
  tagsLbl.classList.toggle('over', tags.length > IG_TAGS_MAX);

  if (tags.length > 0) {
    tagsPanel.style.display = 'block';
    tagsList.innerHTML = '';
    tags.forEach(t => {
      const el = document.createElement('span');
      el.className = 'ig-hashtag';
      el.textContent = t;
      tagsList.appendChild(el);
    });
  } else {
    tagsPanel.style.display = 'none';
  }

  // Preview: stops at first newline OR IG_HOOK chars
  const graphemes = [...text];
  if (graphemes.length === 0) {
    prevBody.textContent = '—'; prevBody.classList.add('empty');
    prevMeta.textContent = ''; return;
  }
  prevBody.classList.remove('empty');
  const firstNewline = text.indexOf('\n');
  const cutByNewline = firstNewline !== -1 && [...text.slice(0, firstNewline)].length <= IG_HOOK;
  let visibleChars;
  let reason;
  if (cutByNewline) {
    visibleChars = firstNewline; reason = 'first line break';
  } else if (graphemes.length > IG_HOOK) {
    visibleChars = graphemes.slice(0, IG_HOOK).join('').length;
    reason = 'char limit';
  } else {
    prevBody.textContent = text;
    prevMeta.textContent = 'Fully visible in feed (no truncation).';
    return;
  }
  const hookText = text.substring(0, visibleChars);
  prevBody.innerHTML = '';
  prevBody.appendChild(document.createTextNode(hookText));
  const cut = document.createElement('span');
  cut.className = 'cutoff';
  cut.textContent = '\u2026 more';
  prevBody.appendChild(cut);
  prevMeta.textContent = `Truncated at ${reason}. Hook: ${codePoints(hookText)} chars.`;
}

copyTags.addEventListener('click', async () => {
  const tagStr = [...tagsList.querySelectorAll('.ig-hashtag')]
    .map(e => e.textContent)
    .join(' ');
  if (!tagStr) return;
  try {
    await navigator.clipboard.writeText(tagStr);
    copyTags.textContent = 'Copied';
    copyTags.classList.add('copied');
    setTimeout(() => { copyTags.textContent = 'Copy all'; copyTags.classList.remove('copied'); }, 1200);
  } catch { copyTags.textContent = 'Failed'; }
});

window.igGo = igGo;
igGo();
