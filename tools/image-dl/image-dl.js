/**
 * Image Downloader — SharpDev Tools
 * Paste an image URL to download directly, or paste a webpage URL to find all images.
 */

const API_BASE = '/api';
const MAX_IMAGES = 100; // Cap to avoid hammering servers / crashing browser

let foundImages = []; // {src, blob, objectUrl, size}
let selectedIndexes = new Set();
let siteName = 'images'; // derived from user's input URL

const urlInput = document.getElementById('url-input');
const statusEl = document.getElementById('status-msg');
const previewSingle = document.getElementById('preview-single');
const gridHeader = document.getElementById('image-grid-header');
const selectBar = document.getElementById('select-bar');
const imageGrid = document.getElementById('image-grid');
const downloadBar = document.getElementById('download-bar');
const selectedCountEl = document.getElementById('selected-count');
const imageCountEl = document.getElementById('image-count');
const fetchBtn = document.getElementById('fetch-btn');

// Allow Enter key to trigger fetch
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchUrl();
});

function setStatus(type, msg) {
  statusEl.className = 'status-msg ' + type;
  statusEl.textContent = msg;
  statusEl.style.display = msg ? 'block' : 'none';
}

function resetUI() {
  previewSingle.style.display = 'none';
  gridHeader.style.display = 'none';
  selectBar.style.display = 'none';
  imageGrid.style.display = 'none';
  downloadBar.style.display = 'none';
  // Revoke all existing object URLs to free memory
  for (const img of foundImages) {
    if (img.objectUrl) URL.revokeObjectURL(img.objectUrl);
  }
  foundImages = [];
  selectedIndexes.clear();
}

function isImageUrl(url) {
  const path = url.split('?')[0].split('#')[0].toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif|tiff?)$/i.test(path);
}

async function fetchUrl() {
  const rawUrl = urlInput.value.trim();
  if (!rawUrl) { setStatus('error', 'Please paste a URL.'); return; }

  let url = rawUrl;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  // Extract site name for filenames (e.g. "example" from "https://www.example.com/page")
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    siteName = hostname.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-]/g, '-') || 'images';
  } catch { siteName = 'images'; }

  resetUI();
  setStatus('loading', 'Fetching...');
  fetchBtn.disabled = true;

  try {
    // Always fetch first, then decide based on content-type
    const proxyUrl = `${API_BASE}/fetch?url=${encodeURIComponent(url)}`;
    const resp = await fetch(proxyUrl);

    if (!resp.ok) {
      throw new Error(`Could not fetch URL (status ${resp.status}). Check the URL and try again.`);
    }

    const contentType = resp.headers.get('content-type') || '';

    if (contentType.startsWith('image/')) {
      // Direct image
      const blob = await resp.blob();
      await showSingleImage(url, blob);
    } else {
      // Treat as webpage — parse HTML for images
      const html = await resp.text();
      await scanPageForImages(url, html);
    }
  } catch (e) {
    setStatus('error', e.message || 'Failed to fetch URL.');
  } finally {
    fetchBtn.disabled = false;
  }
}

async function showSingleImage(url, blob) {
  if (!blob.type.startsWith('image/') && blob.size < 100) {
    throw new Error('URL does not point to an image.');
  }

  const objectUrl = URL.createObjectURL(blob);
  const img = previewSingle.querySelector('img');
  const infoEl = previewSingle.querySelector('.img-info');

  img.onload = () => {
    const sizeKb = (blob.size / 1024).toFixed(1);
    const sizeMb = (blob.size / (1024 * 1024)).toFixed(1);
    const sizeStr = blob.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;
    infoEl.textContent = `${img.naturalWidth} x ${img.naturalHeight} — ${sizeStr} — ${blob.type || 'unknown'}`;
  };
  img.src = objectUrl;

  foundImages = [{ src: url, blob, objectUrl }];
  previewSingle.style.display = 'block';
  setStatus('success', 'Image found! Click download below.');
}

function downloadSingleImage() {
  if (!foundImages.length || !foundImages[0].blob) return;
  const { blob, src } = foundImages[0];
  const ext = guessExtension(blob.type, src);
  triggerDownload(blob, `${siteName}.${ext}`);
}

async function scanPageForImages(pageUrl, html) {
  setStatus('loading', 'Scanning page for images...');

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const imgUrls = new Set();
  let baseUrl;
  try { baseUrl = new URL(pageUrl); } catch {
    setStatus('error', 'Invalid page URL.');
    return;
  }

  function resolveUrl(src) {
    if (!src || src.startsWith('data:') || src.length < 5) return null;
    try {
      const resolved = new URL(src, baseUrl).href;
      // Only allow http/https URLs
      if (!/^https?:\/\//i.test(resolved)) return null;
      return resolved;
    } catch { return null; }
  }

  function addUrl(src) {
    const resolved = resolveUrl(src);
    if (resolved) imgUrls.add(resolved);
  }

  // Standard <img src>
  doc.querySelectorAll('img[src]').forEach(el => addUrl(el.getAttribute('src')));

  // Lazy-loaded images (data-src, data-lazy-src, data-original, etc.)
  const lazyAttrs = ['data-src', 'data-lazy-src', 'data-original', 'data-lazy', 'data-image',
                     'data-full-src', 'data-hi-res-src', 'data-srcset'];
  doc.querySelectorAll('img').forEach(el => {
    for (const attr of lazyAttrs) {
      const val = el.getAttribute(attr);
      if (val) {
        if (attr === 'data-srcset' || attr.includes('srcset')) {
          // Parse srcset format
          val.split(',').forEach(entry => addUrl(entry.trim().split(/\s+/)[0]));
        } else {
          addUrl(val);
        }
      }
    }
  });

  // <picture> / <source> elements
  doc.querySelectorAll('source[src], source[srcset]').forEach(el => {
    addUrl(el.getAttribute('src'));
    const srcset = el.getAttribute('srcset');
    if (srcset) srcset.split(',').forEach(entry => addUrl(entry.trim().split(/\s+/)[0]));
  });

  // Standard srcset on img
  doc.querySelectorAll('img[srcset]').forEach(el => {
    const srcset = el.getAttribute('srcset') || '';
    srcset.split(',').forEach(entry => addUrl(entry.trim().split(/\s+/)[0]));
  });

  // Skip OG/Twitter meta images — these are usually site branding or page screenshots, not content images

  // Video poster images
  doc.querySelectorAll('video[poster]').forEach(el => addUrl(el.getAttribute('poster')));

  // Links pointing to images
  doc.querySelectorAll('a[href]').forEach(el => {
    const href = el.getAttribute('href');
    if (href && isImageUrl(href)) addUrl(href);
  });

  // CSS background-image in inline styles (all matches)
  doc.querySelectorAll('[style]').forEach(el => {
    const style = el.getAttribute('style') || '';
    const matches = style.matchAll(/url\(['"]?([^'")\s]+)['"]?\)/g);
    for (const match of matches) addUrl(match[1]);
  });

  // Images inside <noscript> tags (lazy-loading fallbacks)
  doc.querySelectorAll('noscript').forEach(el => {
    const noscriptDoc = parser.parseFromString(el.textContent, 'text/html');
    noscriptDoc.querySelectorAll('img[src]').forEach(img => addUrl(img.getAttribute('src')));
  });

  if (imgUrls.size === 0) {
    setStatus('error', 'No images found on this page.');
    return;
  }

  const urls = Array.from(imgUrls);
  const totalFound = urls.length;
  const toProcess = urls.slice(0, MAX_IMAGES);
  const capped = totalFound > MAX_IMAGES;

  setStatus('loading', `Found ${totalFound} image URLs.${capped ? ` Processing first ${MAX_IMAGES}.` : ''} Loading previews...`);

  foundImages = [];
  let errorCount = 0;
  let loaded = 0;

  // Load images in batches of 8
  for (let i = 0; i < toProcess.length; i += 8) {
    const batch = toProcess.slice(i, i + 8);
    const results = await Promise.allSettled(
      batch.map(async (imgUrl) => {
        const proxyUrl = `${API_BASE}/fetch?url=${encodeURIComponent(imgUrl)}`;
        const r = await fetch(proxyUrl);
        if (!r.ok) return null;
        const blob = await r.blob();
        // Accept images, skip tiny tracking pixels (<1KB)
        if (blob.size < 1000) return null;
        // Only accept known image content-types
        if (!blob.type.startsWith('image/')) return null;
        const objectUrl = URL.createObjectURL(blob);
        return { src: imgUrl, blob, objectUrl, size: blob.size };
      })
    );

    for (const r of results) {
      loaded++;
      if (r.status === 'fulfilled' && r.value) {
        foundImages.push(r.value);
      } else {
        errorCount++;
      }
    }

    // Update progress
    setStatus('loading', `Loading images: ${loaded}/${toProcess.length}... (${foundImages.length} found so far)`);
  }

  if (foundImages.length === 0) {
    let msg = 'No downloadable images found.';
    if (errorCount > toProcess.length * 0.8) {
      msg += ' Most image requests failed — the site may be blocking external access.';
    } else {
      msg += ' Only tiny icons or tracking pixels were detected.';
    }
    setStatus('error', msg);
    return;
  }

  // Sort by size descending
  foundImages.sort((a, b) => b.size - a.size);
  renderImageGrid();

  let statusMsg = `Found ${foundImages.length} images.`;
  if (errorCount > 0) statusMsg += ` (${errorCount} failed to load)`;
  if (capped) statusMsg += ` Showing first ${MAX_IMAGES} of ${totalFound} found.`;
  statusMsg += ' Click to select, then download.';
  setStatus('success', statusMsg);
}

function renderImageGrid() {
  imageGrid.innerHTML = '';
  selectedIndexes.clear();

  foundImages.forEach((img, idx) => {
    const tile = document.createElement('div');
    tile.className = 'image-tile';
    tile.onclick = () => toggleSelect(idx, tile);

    const sizeKb = (img.size / 1024).toFixed(0);
    const sizeStr = img.size > 1024 * 1024 ? `${(img.size / (1024*1024)).toFixed(1)} MB` : `${sizeKb} KB`;

    tile.innerHTML = `<img src="${img.objectUrl}" loading="lazy" alt="Image ${idx + 1}"><div class="tile-size">${sizeStr}</div>`;
    imageGrid.appendChild(tile);
  });

  imageCountEl.textContent = foundImages.length + ' images';
  gridHeader.style.display = 'flex';
  selectBar.style.display = 'flex';
  imageGrid.style.display = 'grid';
  downloadBar.style.display = 'block';
  updateSelectedCount();
}

function toggleSelect(idx, tile) {
  if (selectedIndexes.has(idx)) {
    selectedIndexes.delete(idx);
    tile.classList.remove('selected');
  } else {
    selectedIndexes.add(idx);
    tile.classList.add('selected');
  }
  updateSelectedCount();
}

function selectAll() {
  document.querySelectorAll('.image-tile').forEach((tile, idx) => {
    selectedIndexes.add(idx);
    tile.classList.add('selected');
  });
  updateSelectedCount();
}

function selectNone() {
  document.querySelectorAll('.image-tile').forEach((tile, idx) => {
    selectedIndexes.delete(idx);
    tile.classList.remove('selected');
  });
  updateSelectedCount();
}

function updateSelectedCount() {
  const n = selectedIndexes.size;
  selectedCountEl.textContent = n > 0 ? `${n} selected` : 'None selected';
}

function guessExtension(mimeType, url) {
  const mimeMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/avif': 'avif', 'image/bmp': 'bmp' };
  if (mimeMap[mimeType]) return mimeMap[mimeType];
  const match = url.split('?')[0].match(/\.(\w{3,4})$/);
  if (match) return match[1].toLowerCase();
  return 'jpg';
}

function guessFilename(url, ext) {
  try {
    const path = new URL(url).pathname;
    const parts = path.split('/');
    const last = parts[parts.length - 1];
    if (last && last.length > 1 && last.length < 200) {
      if (/\.\w{3,4}$/.test(last)) return last;
      return last + '.' + ext;
    }
  } catch {}
  return 'image.' + ext;
}

function triggerDownload(blob, filename) {
  // Create a fresh blob URL to ensure the download attribute works
  const freshBlob = (blob instanceof Blob) ? blob : null;
  const url = freshBlob ? URL.createObjectURL(freshBlob) : blob; // blob can be a URL string for zip
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  // Clean up after a short delay to ensure download starts
  setTimeout(() => {
    document.body.removeChild(a);
    if (freshBlob) URL.revokeObjectURL(url);
  }, 1000);
}

async function downloadSelected() {
  if (selectedIndexes.size === 0) {
    setStatus('error', 'Select at least one image first.');
    return;
  }

  if (selectedIndexes.size === 1) {
    const idx = Array.from(selectedIndexes)[0];
    const img = foundImages[idx];
    const ext = guessExtension(img.blob.type, img.src);
    triggerDownload(img.blob, `${siteName}-1.${ext}`);
    return;
  }

  // Multiple images — try ZIP, fall back to individual downloads
  const btn = document.querySelector('#download-bar .btn');

  if (typeof JSZip !== 'undefined') {
    // ZIP available — bundle them
    if (btn) { btn.disabled = true; btn.textContent = 'Generating ZIP...'; }
    try {
      const zip = new JSZip();
      let num = 1;

      for (const idx of selectedIndexes) {
        const img = foundImages[idx];
        const ext = guessExtension(img.blob.type, img.src);
        const padded = String(num).padStart(2, '0');
        zip.file(`${siteName}-${padded}.${ext}`, img.blob);
        num++;
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(zipBlob, `${siteName}.zip`);
    } catch (e) {
      console.error('ZIP failed, falling back to individual downloads:', e);
      downloadIndividually();
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Download Selected'; }
    }
  } else {
    // JSZip not available — download individually
    downloadIndividually();
  }
}

function downloadIndividually() {
  let delay = 0;
  let num = 1;
  for (const idx of selectedIndexes) {
    const img = foundImages[idx];
    const ext = guessExtension(img.blob.type, img.src);
    const padded = String(num).padStart(2, '0');
    const filename = `${siteName}-${padded}.${ext}`;
    // Stagger downloads slightly so browser doesn't block them
    setTimeout(() => triggerDownload(img.blob, filename), delay);
    delay += 500;
    num++;
  }
}
