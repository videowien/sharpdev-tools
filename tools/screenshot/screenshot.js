/**
 * Website Screenshot — SharpDev Tools
 * Captures full-page screenshots via the backend API.
 */

const API_BASE = '/api';

const urlInput = document.getElementById('url-input');
const captureBtn = document.getElementById('capture-btn');
const statusEl = document.getElementById('status-msg');
const previewArea = document.getElementById('preview-area');
const previewImg = document.getElementById('preview-img');
const infoEl = document.getElementById('screenshot-info');
const downloadBtn = document.getElementById('download-btn');

let screenshotBlob = null;
let screenshotFilename = 'screenshot.png';

// Enter key triggers capture
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') captureScreenshot();
});

function setStatus(type, msg) {
  statusEl.className = 'status-msg ' + type;
  statusEl.innerHTML = msg;
  statusEl.style.display = msg ? 'block' : 'none';
}

function getSiteName(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return hostname.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-]/g, '-') || 'screenshot';
  } catch { return 'screenshot'; }
}

async function captureScreenshot() {
  const rawUrl = urlInput.value.trim();
  if (!rawUrl) { setStatus('error', 'Please enter a URL.'); return; }

  let url = rawUrl;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  const width = document.getElementById('width-select').value;
  const format = document.getElementById('format-select').value;

  // Reset
  previewArea.style.display = 'none';
  screenshotBlob = null;
  captureBtn.disabled = true;

  setStatus('loading', '<span class="spinner"></span>Capturing screenshot... This may take 10-20 seconds.');

  try {
    const resp = await fetch(`${API_BASE}/screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, width: parseInt(width), format }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      let msg = 'Screenshot failed.';
      try { msg = JSON.parse(errText).error || msg; } catch { msg = errText || msg; }
      throw new Error(msg);
    }

    const blob = await resp.blob();
    if (blob.size < 500) {
      throw new Error('Screenshot appears empty. The page may have blocked rendering.');
    }

    screenshotBlob = blob;
    const siteName = getSiteName(url);
    const ext = format === 'jpg' ? 'jpg' : format;
    screenshotFilename = `${siteName}.${ext}`;

    // Show preview (revoke previous URL to prevent memory leak)
    if (previewImg.src && previewImg.src.startsWith('blob:')) URL.revokeObjectURL(previewImg.src);
    const objectUrl = URL.createObjectURL(blob);
    previewImg.onload = () => {
      infoEl.textContent = `${previewImg.naturalWidth} x ${previewImg.naturalHeight} — ${(blob.size / 1024).toFixed(0)} KB`;
    };
    previewImg.src = objectUrl;
    previewImg.style.display = 'block';
    previewArea.style.display = 'block';

    setStatus('success', 'Screenshot captured! Scroll down to preview and download.');

  } catch (e) {
    setStatus('error', e.message || 'Failed to capture screenshot.');
  } finally {
    captureBtn.disabled = false;
  }
}

function downloadScreenshot() {
  if (!screenshotBlob) return;
  const url = URL.createObjectURL(screenshotBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = screenshotFilename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
