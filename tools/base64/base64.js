/**
 * Base64 Encoder/Decoder — SharpDev Tools
 */

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const statsIn = document.getElementById('stats-in');
const statsOut = document.getElementById('stats-out');
const errorBox = document.getElementById('error-box');
const hintBox = document.getElementById('hint-box');
const fileZone = document.getElementById('file-zone');
const fileInput = document.getElementById('file-input');
const fileInfoEl = document.getElementById('file-info');

let currentFile = null;

function urlSafe() { return document.getElementById('opt-urlsafe').checked; }

function toUrlSafe(s) { return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); }
function fromUrlSafe(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return s;
}

function encodeText(text) {
  const b64 = btoa(unescape(encodeURIComponent(text)));
  return urlSafe() ? toUrlSafe(b64) : b64;
}

function decodeText(b64) {
  let s = b64.replace(/\s+/g, '');
  if (urlSafe() || /[-_]/.test(s)) s = fromUrlSafe(s);
  return decodeURIComponent(escape(atob(s)));
}

function showError(msg) {
  errorBox.innerHTML = `<strong>Error</strong>${escHtml(msg)}`;
  errorBox.style.display = 'block';
}
function hideError() { errorBox.style.display = 'none'; }

function doEncode() {
  const str = inputEl.value;
  if (!str) { outputEl.value = ''; updateStats(); return; }
  try {
    hideError();
    outputEl.value = encodeText(str);
    updateStats();
  } catch (e) { showError(e.message); }
}

function doDecode() {
  const str = inputEl.value.trim();
  if (!str) { outputEl.value = ''; updateStats(); return; }
  try {
    hideError();
    outputEl.value = decodeText(str);
    updateStats();
  } catch (e) { showError('Input is not valid Base64: ' + e.message); }
}

function swap() {
  const t = inputEl.value;
  inputEl.value = outputEl.value;
  outputEl.value = t;
  updateStats();
  onInputChanged();
}

function clearAll() {
  inputEl.value = '';
  outputEl.value = '';
  currentFile = null;
  fileInfoEl.textContent = 'No file selected.';
  hideError();
  hintBox.style.display = 'none';
  updateStats();
}

function onOptionsChanged() {
  // Nothing automatic; user will re-click encode/decode.
  onInputChanged();
}

function onInputChanged() {
  updateStats();
  const v = inputEl.value.trim();
  if (!v) { hintBox.style.display = 'none'; return; }
  // Auto-detect base64
  const re = /^[A-Za-z0-9+/=_-]+$/;
  const clean = v.replace(/\s+/g, '');
  const looksB64 = re.test(clean) && clean.length >= 4 && (clean.replace(/-/g, '+').replace(/_/g, '/').length % 4 <= 2 || clean.length % 4 === 0);
  if (looksB64) {
    hintBox.textContent = 'Looks like Base64 — try Decode.';
    hintBox.style.display = 'block';
  } else {
    hintBox.style.display = 'none';
  }
}

function copyOutput() {
  if (!outputEl.value) return;
  navigator.clipboard.writeText(outputEl.value);
  const btn = document.querySelectorAll('.small-btn')[0];
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 900);
}

function useAsInput() {
  if (!outputEl.value) return;
  inputEl.value = outputEl.value;
  outputEl.value = '';
  updateStats();
  onInputChanged();
}

function updateStats() {
  statsIn.textContent = `${inputEl.value.length.toLocaleString()} chars`;
  statsOut.textContent = `${outputEl.value.length.toLocaleString()} chars`;
}

function onFileModeToggle() {
  const on = document.getElementById('opt-file').checked;
  fileZone.style.display = on ? 'block' : 'none';
}

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) {
    currentFile = e.target.files[0];
    fileInfoEl.textContent = `${currentFile.name} — ${fmtBytes(currentFile.size)}`;
  }
});

fileZone.addEventListener('dragover', (e) => { e.preventDefault(); fileZone.classList.add('dragging'); });
fileZone.addEventListener('dragleave', () => fileZone.classList.remove('dragging'));
fileZone.addEventListener('drop', (e) => {
  e.preventDefault();
  fileZone.classList.remove('dragging');
  if (e.dataTransfer.files.length) {
    currentFile = e.dataTransfer.files[0];
    fileInfoEl.textContent = `${currentFile.name} — ${fmtBytes(currentFile.size)}`;
  }
});

function encodeFile() {
  if (!currentFile) { showError('No file selected.'); return; }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      hideError();
      const bytes = new Uint8Array(reader.result);
      let binary = '';
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
      }
      let b64 = btoa(binary);
      if (urlSafe()) b64 = toUrlSafe(b64);
      outputEl.value = b64;
      updateStats();
    } catch (e) { showError(e.message); }
  };
  reader.onerror = () => showError('Failed to read file.');
  reader.readAsArrayBuffer(currentFile);
}

function decodeToFile() {
  const str = inputEl.value.trim();
  if (!str) { showError('No base64 input to decode.'); return; }
  try {
    hideError();
    let clean = str.replace(/\s+/g, '');
    if (urlSafe() || /[-_]/.test(clean)) clean = fromUrlSafe(clean);
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decoded.bin';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e) { showError('Input is not valid Base64: ' + e.message); }
}

function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + ' MB';
  return (n / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

updateStats();
