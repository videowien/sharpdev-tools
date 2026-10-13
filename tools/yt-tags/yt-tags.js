/**
 * YouTube Tags Extractor — pulls keywords via the same /api/player backend
 * the Thumbnail and Subtitle tools use.
 */
const API_BASE = '/api';

const urlIn = document.getElementById('url-in');
const fetchBtn = document.getElementById('fetch-btn');
const errEl = document.getElementById('err');
const videoCard = document.getElementById('video-card');
const videoTitle = document.getElementById('video-title');
const videoMeta = document.getElementById('video-meta');
const tagsPanel = document.getElementById('tags-panel');
const tagsCount = document.getElementById('tags-count');
const tagsList = document.getElementById('tags-list');
const copyComma = document.getElementById('copy-comma');
const copyLines = document.getElementById('copy-lines');
const emptyState = document.getElementById('empty-state');

let currentTags = [];

function extractVideoId(url) {
  const m = url.match(/(?:v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/) ||
            url.match(/^([a-zA-Z0-9_-]{11})$/);
  return m ? m[1] : null;
}

async function fetchPlayer(videoId) {
  const resp = await fetch(`${API_BASE}/player`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId }),
  });
  if (!resp.ok) {
    let msg = 'Could not fetch video data.';
    try { const j = await resp.json(); if (j.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  return resp.json();
}

function reset() {
  errEl.textContent = '';
  videoCard.style.display = 'none';
  tagsPanel.style.display = 'none';
  emptyState.style.display = 'none';
  currentTags = [];
}

function renderTags(tags) {
  tagsList.innerHTML = '';
  tagsCount.textContent = tags.length;
  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'yt-tag';
    btn.textContent = tag;
    btn.title = 'Click to copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(tag);
        btn.classList.add('copied');
        const orig = btn.textContent;
        btn.textContent = '✓ ' + orig;
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1200);
      } catch {}
    });
    tagsList.appendChild(btn);
  });
  tagsPanel.style.display = 'block';
}

async function go() {
  reset();
  const raw = urlIn.value.trim();
  if (!raw) { errEl.textContent = 'Paste a YouTube URL.'; return; }
  const videoId = extractVideoId(raw);
  if (!videoId) { errEl.textContent = 'Could not find a video ID in that URL.'; return; }

  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Fetching...';
  try {
    const data = await fetchPlayer(videoId);
    const details = data.videoDetails || {};
    videoTitle.textContent = details.title || `Video ${videoId}`;
    videoMeta.textContent = (details.author || '') +
      (details.lengthSeconds ? ` \u2022 ${formatDuration(parseInt(details.lengthSeconds, 10))}` : '');
    videoCard.style.display = 'block';

    const tags = Array.isArray(details.keywords) ? details.keywords : [];
    currentTags = tags;
    if (tags.length === 0) {
      emptyState.style.display = 'block';
    } else {
      renderTags(tags);
    }
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.textContent = 'Fetch tags';
  }
}

function formatDuration(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

fetchBtn.addEventListener('click', go);
urlIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });

copyComma.addEventListener('click', async () => {
  if (currentTags.length === 0) return;
  try {
    await navigator.clipboard.writeText(currentTags.join(', '));
    copyComma.textContent = 'Copied'; copyComma.classList.add('copied');
    setTimeout(() => { copyComma.textContent = 'Copy comma-separated'; copyComma.classList.remove('copied'); }, 1400);
  } catch { copyComma.textContent = 'Failed'; }
});
copyLines.addEventListener('click', async () => {
  if (currentTags.length === 0) return;
  try {
    await navigator.clipboard.writeText(currentTags.join('\n'));
    copyLines.textContent = 'Copied'; copyLines.classList.add('copied');
    setTimeout(() => { copyLines.textContent = 'Copy one per line'; copyLines.classList.remove('copied'); }, 1400);
  } catch { copyLines.textContent = 'Failed'; }
});
