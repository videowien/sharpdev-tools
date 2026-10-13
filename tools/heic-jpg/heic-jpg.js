/**
 * HEIC to JPG / PNG — browser conversion.
 * Decode order per file:
 *   1. Native decode via <img> (Safari 17+ decodes HEIC natively; also handles
 *      files that are really JPEGs renamed to .HEIC, e.g. from messengers).
 *   2. Vendored libheif 1.19.8 WASM (lazy-loaded on first use, ~1.4 MB) —
 *      handles Chrome/Firefox and modern iPhone variants incl. iOS-18
 *      HDR gain-map ("tmap") files that the old heic2any/libheif choked on.
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const resultsCard = document.getElementById('results-card');
const resultsEl = document.getElementById('results');
const qualityEl = document.getElementById('quality');
const qualityVal = document.getElementById('quality-val');
const statusMsg = document.getElementById('status-msg');

let format = 'image/jpeg';
let converted = []; // { name, blob }

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) processFiles(Array.from(fileInput.files)); fileInput.value = ''; });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) processFiles(Array.from(e.dataTransfer.files));
});

document.querySelectorAll('[data-format]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-format]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    format = btn.dataset.format;
  });
});
qualityEl.addEventListener('input', () => { qualityVal.textContent = parseFloat(qualityEl.value).toFixed(2); });

document.getElementById('clear-btn').addEventListener('click', () => {
  converted = []; resultsEl.innerHTML = '';
  resultsCard.style.display = 'none';
});

// ---- libheif lazy loader ----------------------------------------------------
let libheifPromise = null;
function getLibheif() {
  if (!libheifPromise) {
    libheifPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/shared/vendor/libheif/libheif-bundle-1.19.8.min.js';
      s.onload = resolve;
      s.onerror = () => reject(new Error('decoder failed to load'));
      document.head.appendChild(s);
    }).then(async () => {
      let m = window.libheif;
      if (typeof m === 'function') m = m();      // emscripten factory
      m = await Promise.resolve(m);              // possibly a thenable Module
      if (m && m.ready && typeof m.ready.then === 'function') {
        try { await m.ready; } catch (e) { /* some builds reject ready twice */ }
      }
      if (!m || typeof m.HeifDecoder !== 'function') throw new Error('decoder failed to initialise');
      return m;
    });
    libheifPromise.catch(() => { libheifPromise = null; }); // allow retry on load failure
  }
  return libheifPromise;
}

// ---- decode paths -----------------------------------------------------------
function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error('encoding failed')), type, quality);
  });
}

function drawToCanvas(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (format === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height); }
  draw(ctx);
  return canvas;
}

// Safari (17+) decodes HEIC in <img> natively; this also converts files that
// are actually JPEG/PNG renamed to .HEIC. Throws on Chrome/Firefox real HEICs.
async function decodeNative(file, quality) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const w = img.naturalWidth, h = img.naturalHeight;
    if (!w || !h) throw new Error('empty image');
    const canvas = drawToCanvas(w, h, (ctx) => ctx.drawImage(img, 0, 0));
    return await canvasToBlob(canvas, format, quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function decodeWasm(file, quality) {
  const libheif = await getLibheif();
  const buf = await file.arrayBuffer();
  const decoder = new libheif.HeifDecoder();
  const images = decoder.decode(buf);
  if (!images || !images.length) throw new Error('no image found in file');
  const image = images[0]; // primary image (bursts/aux images: first entry)
  try {
    const w = image.get_width(), h = image.get_height();
    const out = await new Promise((resolve, reject) => {
      image.display({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }, (d) => {
        d ? resolve(d) : reject(new Error('decode failed'));
      });
    });
    const imageData = new ImageData(new Uint8ClampedArray(out.data), w, h);
    const canvas = drawToCanvas(w, h, (ctx) => ctx.putImageData(imageData, 0, 0));
    if (format === 'image/jpeg') {
      // putImageData ignores the white underlay, so re-composite for JPEG.
      const flat = drawToCanvas(w, h, (ctx) => ctx.drawImage(canvas, 0, 0));
      return await canvasToBlob(flat, format, quality);
    }
    return await canvasToBlob(canvas, format, quality);
  } finally {
    images.forEach((im) => { try { im.free && im.free(); } catch (e) {} });
  }
}

async function convertFile(file, quality) {
  try {
    return await decodeNative(file, quality);
  } catch (e) {
    return await decodeWasm(file, quality);
  }
}

// ---- UI flow ----------------------------------------------------------------
async function processFiles(files) {
  const ext = format === 'image/jpeg' ? 'jpg' : 'png';
  const quality = parseFloat(qualityEl.value);
  resultsCard.style.display = '';
  for (const file of files) {
    const name = file.name.replace(/\.(heic|heif)$/i, '');
    const row = document.createElement('div');
    row.className = 'result busy';
    row.innerHTML = `
      <span class="result-name">${escapeHtml(file.name)}</span>
      <span class="result-status">Converting…</span>
    `;
    resultsEl.appendChild(row);
    try {
      const finalBlob = await convertFile(file, quality);
      converted.push({ name: `${name}.${ext}`, blob: finalBlob });
      const url = URL.createObjectURL(finalBlob);
      row.className = 'result done';
      row.innerHTML = `
        <span class="result-name">${escapeHtml(name)}.${ext}</span>
        <span class="result-status">${(finalBlob.size / 1024).toFixed(1)} KB</span>
        <a class="dl" href="${url}" download="${escapeAttr(name)}.${ext}">Download</a>
      `;
    } catch (err) {
      row.className = 'result error';
      row.innerHTML = `
        <span class="result-name">${escapeHtml(file.name)}</span>
        <span class="result-status">Failed: ${escapeHtml(err.message || 'could not decode')} — the file may be corrupted or use an unusual HEIF profile</span>
      `;
    }
  }
}

document.getElementById('dl-zip').addEventListener('click', async () => {
  if (!converted.length) return;
  if (typeof JSZip === 'undefined') { flash('ZIP library not loaded.', 'error'); return; }
  flash('Building ZIP…', 'busy');
  const zip = new JSZip();
  for (const item of converted) zip.file(item.name, item.blob);
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `heic-converted-${Date.now()}.zip`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ ZIP downloaded', 'ok');
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2500);
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function escapeAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }
