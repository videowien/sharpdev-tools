/**
 * YouTube Thumbnail Downloader — SharpDev Tools
 * Download thumbnails in the highest available resolution.
 * Supports batch processing with ZIP download.
 */

const API_BASE = '/api';

// YouTube thumbnail resolutions (try in order, first success wins)
const THUMB_RESOLUTIONS = [
  { key: 'maxresdefault', label: '1280x720 (Max)' },
  { key: 'sddefault',     label: '640x480 (SD)' },
  { key: 'hqdefault',     label: '480x360 (HQ)' },
  { key: 'mqdefault',     label: '320x180 (MQ)' },
];

let results = []; // {videoId, title, blob, objectUrl, resolution, failed, error}

// ---- DOM refs ----
const urlsEl = document.getElementById('urls');
const countEl = document.getElementById('url-count');
const dupCountEl = document.getElementById('dup-count');
const validationEl = document.getElementById('validation-msg');

let debounceTimer = null;
urlsEl.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(updateUrlCount, 300);
});

// ---- URL parsing (same as subtitles tool) ----
function extractVideoId(url) {
  const m = url.match(/(?:v=|\/v\/|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/) ||
            url.match(/^([a-zA-Z0-9_-]{11})$/);
  return m ? m[1] : null;
}

function parseUrls() {
  const lines = urlsEl.value.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const valid = [], invalid = [];
  const seen = new Set();
  let dupes = 0;
  for (const line of lines) {
    const vid = extractVideoId(line);
    if (!vid) { invalid.push(line); }
    else if (seen.has(vid)) { dupes++; }
    else { seen.add(vid); valid.push({ url: line, videoId: vid }); }
  }
  return { valid, invalid, dupes };
}

function updateUrlCount() {
  const { valid, invalid, dupes } = parseUrls();
  countEl.textContent = valid.length;
  dupCountEl.textContent = dupes > 0 ? `(${dupes} duplicate${dupes > 1 ? 's' : ''} removed)` : '';
  dupCountEl.style.color = '#ff9800';

  if (invalid.length > 0) {
    validationEl.style.display = 'block';
    validationEl.textContent = `${invalid.length} invalid URL${invalid.length > 1 ? 's' : ''} will be skipped: ${invalid.slice(0, 3).join(', ')}${invalid.length > 3 ? '...' : ''}`;
  } else { validationEl.style.display = 'none'; }
}

// ---- Helpers ----
function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function sanitizeFilename(name) {
  let cleaned = name.replace(/[\\/*?:"<>|]/g, '').trim();
  if (!cleaned) cleaned = 'untitled';
  if (cleaned.length > 180) cleaned = cleaned.substring(0, 180).trim();
  return cleaned;
}

// ---- Fetch thumbnail (try resolutions in order) ----
async function fetchThumbnail(videoId) {
  for (const res of THUMB_RESOLUTIONS) {
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/${res.key}.jpg`;
    try {
      const resp = await fetch(`${API_BASE}/fetch?url=${encodeURIComponent(thumbUrl)}`);
      if (!resp.ok) continue;
      const blob = await resp.blob();
      // YouTube returns a small grey placeholder (< 2KB) for missing resolutions
      if (blob.size < 2000) continue;
      if (!blob.type.startsWith('image/')) continue;
      return { blob, resolution: res.label };
    } catch {
      continue;
    }
  }
  throw new Error('No thumbnail found');
}

// ---- Fetch video title via InnerTube ----
async function fetchTitle(videoId) {
  try {
    const resp = await fetch(`${API_BASE}/player`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId }),
    });
    if (!resp.ok) return videoId;
    const data = await resp.json();
    return data.videoDetails?.title || videoId;
  } catch {
    return videoId;
  }
}

// ---- Main download logic ----
async function startDownload() {
  const { valid, invalid } = parseUrls();
  if (valid.length === 0) {
    alert('No valid YouTube URLs found.\nPaste links like:\nhttps://www.youtube.com/watch?v=...');
    return;
  }

  const startBtn = document.getElementById('start-btn');
  const progArea = document.getElementById('progress-area');
  const bar = document.getElementById('progress-bar');
  const counterEl = document.getElementById('counter');
  const titleEl = document.getElementById('progress-title');
  const grid = document.getElementById('results-grid');
  const summaryEl = document.getElementById('summary');

  startBtn.disabled = true;
  startBtn.textContent = 'Downloading...';
  progArea.style.display = 'block';
  grid.innerHTML = '';
  summaryEl.style.display = 'none';
  bar.style.width = '0%';
  // Revoke old object URLs
  for (const r of results) { if (r.objectUrl) URL.revokeObjectURL(r.objectUrl); }
  results = [];

  const total = valid.length;
  let done = 0, successCount = 0, failCount = 0;
  titleEl.textContent = 'Downloading thumbnails...';
  counterEl.textContent = `0 / ${total}`;

  for (const { videoId } of valid) {
    // Fetch title and thumbnail in parallel
    const [title, thumbResult] = await Promise.allSettled([
      fetchTitle(videoId),
      fetchThumbnail(videoId),
    ]);

    const videoTitle = title.status === 'fulfilled' ? title.value : videoId;

    if (thumbResult.status === 'fulfilled') {
      const { blob, resolution } = thumbResult.value;
      const objectUrl = URL.createObjectURL(blob);
      results.push({ videoId, title: videoTitle, blob, objectUrl, resolution, failed: false });
      successCount++;
      addThumbCard(grid, videoId, videoTitle, objectUrl, resolution, false);
    } else {
      const error = thumbResult.reason?.message || 'Failed';
      results.push({ videoId, title: videoTitle, failed: true, error });
      failCount++;
      addThumbCard(grid, videoId, videoTitle, null, null, true, error);
    }

    done++;
    counterEl.textContent = `${done} / ${total}`;
    bar.style.width = ((done / total) * 100) + '%';
  }

  // Done
  titleEl.textContent = 'Complete!';
  startBtn.disabled = false;
  startBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Download Thumbnails';

  // Show summary
  const successResults = results.filter(r => !r.failed);
  summaryEl.style.display = 'flex';
  let html = `
    <div class="summary-item summary-ok"><div class="summary-num">${successCount}</div><div class="summary-label">Ready</div></div>
    <div class="summary-item summary-fail"><div class="summary-num">${failCount}</div><div class="summary-label">Failed</div></div>
    <div class="summary-item"><div class="summary-num">${total}</div><div class="summary-label">Total</div></div>`;
  if (successResults.length > 1) {
    html += `<button class="btn btn-primary" onclick="downloadAllZip()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
      Download All as ZIP</button>`;
  }
  summaryEl.innerHTML = html;
}

function addThumbCard(grid, videoId, title, objectUrl, resolution, failed, error) {
  const card = document.createElement('div');
  card.className = 'thumb-card' + (failed ? ' failed' : '');

  if (failed) {
    card.innerHTML = `
      <div class="thumb-info">
        <div class="thumb-title" title="${escHtml(title)}">${escHtml(title)}</div>
        <div class="thumb-res">${escHtml(error || 'No thumbnail available')}</div>
      </div>`;
  } else {
    const idx = results.length - 1;
    card.innerHTML = `
      <img src="${objectUrl}" alt="${escHtml(title)}">
      <div class="thumb-info">
        <div class="thumb-title" title="${escHtml(title)}">${escHtml(title)}</div>
        <div class="thumb-res">${resolution}</div>
        <div class="thumb-actions">
          <button class="btn btn-primary" onclick="downloadSingle(${idx})">Download</button>
        </div>
      </div>`;
  }

  grid.appendChild(card);
}

function downloadSingle(idx) {
  const r = results[idx];
  if (!r || r.failed || !r.blob) return;
  const filename = sanitizeFilename(r.title) + ` [${r.videoId}].jpg`;
  triggerDownload(r.blob, filename);
}

async function downloadAllZip() {
  const successResults = results.filter(r => !r.failed && r.blob);
  if (successResults.length === 0) return;

  if (successResults.length === 1) {
    downloadSingle(results.indexOf(successResults[0]));
    return;
  }

  const btn = document.querySelector('#summary .btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Generating ZIP...'; }

  try {
    const zip = new JSZip();
    const usedNames = new Set();

    for (const r of successResults) {
      let name = sanitizeFilename(r.title) + ` [${r.videoId}].jpg`;
      if (usedNames.has(name)) {
        let counter = 2;
        const base = name.replace(/\.jpg$/, '');
        while (usedNames.has(`${base}_${counter}.jpg`)) counter++;
        name = `${base}_${counter}.jpg`;
      }
      usedNames.add(name);
      zip.file(name, r.blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, 'thumbnails.zip');
  } catch (e) {
    console.error('ZIP failed:', e);
    alert('ZIP generation failed. Try downloading individually.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Download All as ZIP';
    }
  }
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
