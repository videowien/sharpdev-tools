/**
 * YouTube Subtitle Downloader — SharpDev Tools
 * All tool logic in one self-contained file.
 *
 * Dependencies: JSZip (loaded via CDN in the HTML)
 * API: Requires a proxy at API_BASE that forwards to YouTube InnerTube.
 */

// ---- Constants ----
const BATCH_SIZE = 15;
const DELAY_BETWEEN = 5000; // ms
const COOLDOWN = 600;       // seconds (10 min)
const API_BASE = '/api';    // local dev proxy; change to Cloudflare Worker URL for production

let isPaused = false;
let isCancelled = false;
let downloadedFiles = []; // {name, content} for zip

// ---- DOM refs ----
const urlsEl = document.getElementById('urls');
const countEl = document.getElementById('url-count');
const dupCountEl = document.getElementById('dup-count');
const warningEl = document.getElementById('batch-warning');
const validationEl = document.getElementById('validation-msg');

let debounceTimer = null;
urlsEl.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(updateUrlCount, 300);
});

// ---- URL parsing ----
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
  const n = valid.length;
  countEl.textContent = n;
  dupCountEl.textContent = dupes > 0 ? `(${dupes} duplicate${dupes > 1 ? 's' : ''} removed)` : '';
  dupCountEl.style.color = '#ff9800';

  if (invalid.length > 0) {
    validationEl.style.display = 'block';
    validationEl.textContent = `${invalid.length} invalid URL${invalid.length > 1 ? 's' : ''} will be skipped: ${invalid.slice(0, 3).join(', ')}${invalid.length > 3 ? '...' : ''}`;
  } else { validationEl.style.display = 'none'; }

  if (n > BATCH_SIZE) {
    const batches = Math.ceil(n / BATCH_SIZE);
    const totalMin = Math.ceil((n * 5 + (batches - 1) * COOLDOWN) / 60);
    let msg = `<strong>Safe mode:</strong> ${n} links in <strong>${batches} batches</strong> of ${BATCH_SIZE} with a 10-minute cooldown. Estimated: ~<strong>${totalMin} minutes</strong>. Leave this tab open.`;
    if (n > 500) msg += `<br><br>\u26A0\uFE0F <strong>That's a lot!</strong> Consider splitting into smaller sessions.`;
    warningEl.style.display = 'block';
    warningEl.innerHTML = msg;
  } else { warningEl.style.display = 'none'; }
}

// ---- InnerTube API (via proxy) ----
async function fetchPlayerData(videoId) {
  const resp = await fetch(`${API_BASE}/player`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId }),
  });
  if (resp.status === 429) throw new Error('Rate limited. Wait and try again.');
  if (!resp.ok) throw new Error(`Player API returned ${resp.status}`);
  return resp.json();
}

async function fetchTranscriptXml(baseUrl) {
  const url = baseUrl.replace(/&fmt=[^&]*/, '');
  const resp = await fetch(`${API_BASE}/transcript?url=${encodeURIComponent(url)}`);
  if (resp.status === 429) throw new Error('Rate limited fetching transcript.');
  if (!resp.ok) throw new Error(`Transcript XML returned ${resp.status}`);
  return resp.text();
}

function findTrack(tracks, lang) {
  let manual = null, generated = null;
  for (const t of tracks) {
    if (t.languageCode === lang) {
      if (t.kind === 'asr') generated = t; else manual = t;
    }
  }
  return manual || generated;
}

function parseTranscriptXml(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid transcript XML');
  const snippets = [];

  // Handle <text> elements (most common)
  for (const el of doc.querySelectorAll('text')) {
    const text = el.textContent.trim();
    if (text) {
      snippets.push({
        text: decodeHtmlEntities(text),
        start: parseFloat(el.getAttribute('start') || '0'),
        duration: parseFloat(el.getAttribute('dur') || '0'),
      });
    }
  }

  // Handle <p> elements (alternative format)
  if (snippets.length === 0) {
    for (const el of doc.querySelectorAll('p')) {
      const text = el.textContent.trim();
      if (text) {
        snippets.push({
          text: decodeHtmlEntities(text),
          start: parseFloat(el.getAttribute('t') || '0') / 1000,
          duration: parseFloat(el.getAttribute('d') || '0') / 1000,
        });
      }
    }
  }
  return snippets;
}

function decodeHtmlEntities(str) {
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
}

// Detect YouTube-side blocks. When YT refuses to serve player metadata
// (LOGIN_REQUIRED, ERROR, UNPLAYABLE), the response still arrives with
// HTTP 200 but a non-OK playabilityStatus. We surface that as a tagged
// error so the caller can show a different message.
function buildBlockError(playerData) {
  const ps = playerData?.playabilityStatus || {};
  const s = ps.status;
  if (!s || s === 'OK') return null;
  let msg;
  if (s === 'LOGIN_REQUIRED') msg = 'YouTube blocked this request (sign-in required)';
  else if (s === 'UNPLAYABLE') msg = 'Video unavailable (private, removed, or region-locked)';
  else if (s === 'ERROR') msg = 'YouTube blocked this request';
  else msg = `YouTube returned status ${s}`;
  const err = new Error(msg);
  err.ytBlocked = (s === 'LOGIN_REQUIRED' || s === 'ERROR');
  return err;
}

async function fetchSubtitle(videoId, lang) {
  const playerData = await fetchPlayerData(videoId);
  const blockErr = buildBlockError(playerData);
  if (blockErr) throw blockErr;

  const title = playerData.videoDetails?.title || videoId;
  const tracks = playerData.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

  if (!tracks.length) throw new Error('No captions available for this video');
  const track = findTrack(tracks, lang);
  if (!track) {
    const available = tracks.map(t => `${t.languageCode} (${t.kind === 'asr' ? 'auto' : 'manual'})`).join(', ');
    throw new Error(`No '${lang}' transcript. Available: ${available}`);
  }

  const xmlText = await fetchTranscriptXml(track.baseUrl);
  const snippets = parseTranscriptXml(xmlText);
  const subType = track.kind === 'asr' ? 'auto-generated' : 'manual';
  return { title, snippets, subType };
}

// ---- Formatting ----
function formatSrtTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(3,'0')}`;
}

function formatSrt(snippets) {
  return snippets.map((s, i) => {
    const start = formatSrtTime(s.start);
    const end = formatSrtTime(s.start + s.duration);
    return `${i + 1}\n${start} --> ${end}\n${s.text}\n`;
  }).join('\n');
}

function formatTxt(snippets) {
  return snippets.map(s => s.text).join('\n');
}

function sanitizeFilename(name) {
  let cleaned = name.replace(/[\\/*?:"<>|]/g, '').trim();
  if (!cleaned) cleaned = 'untitled';
  if (cleaned.length > 180) cleaned = cleaned.substring(0, 180).trim();
  return cleaned;
}

// ---- Helpers ----
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function formatTime(secs) { return Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'); }

// ---- Main download logic ----
async function startDownload() {
  const { valid, invalid } = parseUrls();
  if (valid.length === 0) {
    alert('No valid YouTube URLs found.\nPaste links like:\nhttps://www.youtube.com/watch?v=...');
    return;
  }

  const lang = document.getElementById('lang').value;
  const fmt = document.getElementById('fmt').value;
  const ext = fmt === 'srt' ? 'srt' : 'txt';

  // UI setup
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const progArea = document.getElementById('progress-area');
  const log = document.getElementById('log');
  const bar = document.getElementById('progress-bar');
  const counterEl = document.getElementById('counter');
  const summaryEl = document.getElementById('summary');
  const titleEl = document.getElementById('progress-title');
  const batchInfoEl = document.getElementById('batch-info');
  const cooldownBanner = document.getElementById('cooldown-banner');
  const cooldownTimerEl = document.getElementById('cooldown-timer');
  const errorBanner = document.getElementById('error-banner');

  startBtn.disabled = true;
  startBtn.textContent = 'Downloading...';
  pauseBtn.style.display = 'inline-flex';
  cancelBtn.style.display = 'inline-flex';
  isPaused = false;
  isCancelled = false;
  pauseBtn.textContent = 'Pause';
  progArea.style.display = 'block';
  log.innerHTML = '';
  summaryEl.style.display = 'none';
  cooldownBanner.style.display = 'none';
  errorBanner.style.display = 'none';
  bar.style.width = '0%';
  downloadedFiles = [];

  const total = valid.length;
  let done = 0, successCount = 0, failCount = 0, ytBlockCount = 0;

  // Log invalid URLs
  for (const inv of invalid) {
    addLogItem(log, 'skip', inv, 'skipped \u2014 not a YouTube URL');
  }

  const totalBatches = Math.ceil(total / BATCH_SIZE);

  for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
    const batchStart = batchNum * BATCH_SIZE;
    const batchUrls = valid.slice(batchStart, batchStart + BATCH_SIZE);

    for (let j = 0; j < batchUrls.length; j++) {
      if (isCancelled) {
        finish(titleEl, summaryEl, startBtn, pauseBtn, cancelBtn, successCount, failCount, total, true, ytBlockCount);
        return;
      }

      while (isPaused) {
        titleEl.innerHTML = '<span class="paused-label">Paused</span>';
        cooldownBanner.style.display = 'none';
        if (isCancelled) {
          finish(titleEl, summaryEl, startBtn, pauseBtn, cancelBtn, successCount, failCount, total, true, ytBlockCount);
          return;
        }
        await sleep(500);
      }

      titleEl.textContent = 'Downloading...';
      batchInfoEl.textContent = `Batch ${batchNum + 1} of ${totalBatches} \u2014 Link ${j + 1} of ${batchUrls.length}`;

      const { videoId } = batchUrls[j];

      try {
        const info = await fetchSubtitle(videoId, lang);
        if (!info.snippets.length) {
          failCount++;
          addLogItem(log, 'fail', info.title, 'Transcript is empty');
        } else {
          const content = fmt === 'srt' ? formatSrt(info.snippets) : formatTxt(info.snippets);
          const safeName = sanitizeFilename(info.title);
          const filename = `${safeName} [${videoId}].${ext}`;
          downloadedFiles.push({ name: filename, content });
          successCount++;
          addLogItem(log, 'ok', info.title, info.subType);
        }
      } catch (e) {
        failCount++;
        if (e && e.ytBlocked) ytBlockCount++;
        let err = e.message || String(e);
        if (err.length > 120) err = err.substring(0, 120) + '...';
        addLogItem(log, 'fail', videoId, err);
      }

      done++;
      counterEl.textContent = `${done} / ${total}`;
      bar.style.width = ((done / total) * 100) + '%';

      if (j < batchUrls.length - 1) {
        await sleep(DELAY_BETWEEN);
      }
    }

    // Cooldown between batches.
    // Time-source: wall-clock (Date.now()), NOT a decrement counter.
    // Why: browsers throttle setTimeout in background/inactive tabs (Chrome
    // drops to 1Hz or pauses entirely), so a sleep(1000)+counter approach
    // desyncs from real time. With timestamps the math is always correct
    // even if the tab is backgrounded for an hour — when the user comes
    // back, the next tick shows the right remaining seconds.
    if (batchNum < totalBatches - 1) {
      titleEl.textContent = 'Cooling down...';
      cooldownBanner.style.display = 'block';
      batchInfoEl.textContent = `Completed batch ${batchNum + 1} of ${totalBatches}. Next batch after cooldown.`;

      let cooldownEnd = Date.now() + COOLDOWN * 1000;
      let wasPaused = false;
      let pauseStart = 0;

      const renderRemaining = () => {
        const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
        cooldownTimerEl.textContent = formatTime(remaining);
        return remaining;
      };
      renderRemaining();

      // Snap the display to the correct value the moment the tab becomes
      // visible again — without this, the user might briefly see a stale
      // value before the next sleep(1000) tick fires.
      const onVisibility = () => {
        if (!document.hidden && !isPaused) renderRemaining();
      };
      document.addEventListener('visibilitychange', onVisibility);

      try {
        while (true) {
          if (isCancelled) {
            cooldownBanner.style.display = 'none';
            finish(titleEl, summaryEl, startBtn, pauseBtn, cancelBtn, successCount, failCount, total, true, ytBlockCount);
            return;
          }
          if (isPaused) {
            if (!wasPaused) {
              pauseStart = Date.now();
              wasPaused = true;
            }
            titleEl.innerHTML = '<span class="paused-label">Paused</span>';
            cooldownBanner.style.display = 'none';
          } else {
            if (wasPaused) {
              // Push the cooldown's end-time forward by however long we
              // sat paused, so pausing freezes the countdown instead of
              // letting it tick down silently.
              cooldownEnd += Date.now() - pauseStart;
              wasPaused = false;
            }
            if (cooldownBanner.style.display === 'none') {
              titleEl.textContent = 'Cooling down...';
              cooldownBanner.style.display = 'block';
            }
            if (renderRemaining() <= 0) break;
          }
          await sleep(1000);
        }
      } finally {
        document.removeEventListener('visibilitychange', onVisibility);
      }

      cooldownBanner.style.display = 'none';
    }
  }

  finish(titleEl, summaryEl, startBtn, pauseBtn, cancelBtn, successCount, failCount, total, false, ytBlockCount);
}

function finish(titleEl, summaryEl, startBtn, pauseBtn, cancelBtn, success, failed, total, cancelled, ytBlocked) {
  titleEl.textContent = cancelled ? 'Cancelled' : 'Complete!';
  document.getElementById('cooldown-banner').style.display = 'none';

  summaryEl.style.display = 'flex';
  let html = `
    <div class="summary-item summary-ok"><div class="summary-num">${success}</div><div class="summary-label">Succeeded</div></div>
    <div class="summary-item summary-fail"><div class="summary-num">${failed}</div><div class="summary-label">Failed</div></div>
    <div class="summary-item"><div class="summary-num">${total}</div><div class="summary-label">Total</div></div>`;
  if (success > 0) {
    const label = downloadedFiles.length === 1
      ? `Download .${downloadedFiles[0].name.split('.').pop()}`
      : 'Download ZIP';
    html += `<button class="btn btn-primary" onclick="downloadResult()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
      ${label}</button>`;
  }
  if (ytBlocked > 0) {
    const plural = ytBlocked === 1 ? 'video was' : 'videos were';
    html += `<div class="yt-block-info" style="flex-basis:100%;margin-top:16px;padding:14px 16px;background:rgba(255,152,0,.08);border:1px solid rgba(255,152,0,.35);border-radius:8px;color:#ddd;font-size:14px;line-height:1.5;text-align:left;">
      <strong style="color:#ff9800;">${ytBlocked} ${plural} blocked by YouTube.</strong>
      This is almost certainly <em>not a bug in this tool</em> &mdash; YouTube's bot detection refuses to serve player metadata for some videos when the request comes from a cloud IP, and no third-party tool can bypass that on the same backend.
      In our experience, recently uploaded videos and very long recordings (multi-hour streams) hit this most often, regardless of which subtitle tool tries to fetch them.
      If you need the captions urgently, <code style="background:rgba(255,255,255,.06);padding:1px 5px;border-radius:3px;">yt-dlp</code> running on your own machine is the most reliable workaround.
    </div>`;
  }
  summaryEl.innerHTML = html;

  startBtn.disabled = false;
  startBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Download Subtitles';
  pauseBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
}

function addLogItem(log, type, title, detail) {
  const icons = { ok: '\u2713', fail: '\u2717', skip: '\u26A0' };
  const classes = { ok: 'log-ok', fail: 'log-fail', skip: 'log-skip' };
  const item = document.createElement('div');
  item.className = 'log-item ' + classes[type];
  item.innerHTML = `<span class="log-icon">${icons[type]}</span><span class="log-text">${escHtml(title)}${detail ? ` <span class="log-detail">(${escHtml(detail)})</span>` : ''}</span>`;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById('pause-btn').textContent = isPaused ? 'Resume' : 'Pause';
}

function cancelDownload() {
  isCancelled = true;
  isPaused = false;
}

async function downloadResult() {
  if (downloadedFiles.length === 0) return;
  const btn = document.querySelector('#summary .btn');
  const single = downloadedFiles.length === 1;
  const restoreLabel = single
    ? `Download .${downloadedFiles[0].name.split('.').pop()}`
    : 'Download ZIP';
  if (btn) { btn.disabled = true; btn.textContent = single ? 'Preparing...' : 'Generating ZIP...'; }

  try {
    let blob, downloadName;
    if (single) {
      blob = new Blob([downloadedFiles[0].content], { type: 'text/plain;charset=utf-8' });
      downloadName = downloadedFiles[0].name;
    } else {
      const zip = new JSZip();
      for (const f of downloadedFiles) {
        zip.file(f.name, f.content);
      }
      blob = await zip.generateAsync({ type: 'blob' });
      downloadName = 'subtitles.zip';
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> ${restoreLabel}`;
    }
  }
}
