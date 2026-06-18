/**
 * Hash Generator — SharpDev Tools
 * MD5 implementation is public-domain (adapted from Joseph Myers' md5.js, 2004).
 */

// ---------- MD5 (public domain, operates on Uint8Array) ----------
function md5(bytes) {
  const n = bytes.length;
  // Build 32-bit little-endian state array
  const state = new Int32Array(((n + 8) >> 6) + 1 << 4);
  for (let i = 0; i < n; i++) state[i >> 2] |= bytes[i] << ((i % 4) << 3);
  state[n >> 2] |= 0x80 << ((n % 4) << 3);
  state[state.length - 2] = n << 3;
  state[state.length - 1] = (n >>> 29);

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;

  function add32(x, y) { return (x + y) | 0; }
  function rol(x, n) { return (x << n) | (x >>> (32 - n)); }
  function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32(rol(a, s), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }

  for (let i = 0; i < state.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d;

    a = ff(a, b, c, d, state[i + 0], 7, -680876936);
    d = ff(d, a, b, c, state[i + 1], 12, -389564586);
    c = ff(c, d, a, b, state[i + 2], 17, 606105819);
    b = ff(b, c, d, a, state[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, state[i + 4], 7, -176418897);
    d = ff(d, a, b, c, state[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, state[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, state[i + 7], 22, -45705983);
    a = ff(a, b, c, d, state[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, state[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, state[i + 10], 17, -42063);
    b = ff(b, c, d, a, state[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, state[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, state[i + 13], 12, -40341101);
    c = ff(c, d, a, b, state[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, state[i + 15], 22, 1236535329);

    a = gg(a, b, c, d, state[i + 1], 5, -165796510);
    d = gg(d, a, b, c, state[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, state[i + 11], 14, 643717713);
    b = gg(b, c, d, a, state[i + 0], 20, -373897302);
    a = gg(a, b, c, d, state[i + 5], 5, -701558691);
    d = gg(d, a, b, c, state[i + 10], 9, 38016083);
    c = gg(c, d, a, b, state[i + 15], 14, -660478335);
    b = gg(b, c, d, a, state[i + 4], 20, -405537848);
    a = gg(a, b, c, d, state[i + 9], 5, 568446438);
    d = gg(d, a, b, c, state[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, state[i + 3], 14, -187363961);
    b = gg(b, c, d, a, state[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, state[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, state[i + 2], 9, -51403784);
    c = gg(c, d, a, b, state[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, state[i + 12], 20, -1926607734);

    a = hh(a, b, c, d, state[i + 5], 4, -378558);
    d = hh(d, a, b, c, state[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, state[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, state[i + 14], 23, -35309556);
    a = hh(a, b, c, d, state[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, state[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, state[i + 7], 16, -155497632);
    b = hh(b, c, d, a, state[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, state[i + 13], 4, 681279174);
    d = hh(d, a, b, c, state[i + 0], 11, -358537222);
    c = hh(c, d, a, b, state[i + 3], 16, -722521979);
    b = hh(b, c, d, a, state[i + 6], 23, 76029189);
    a = hh(a, b, c, d, state[i + 9], 4, -640364487);
    d = hh(d, a, b, c, state[i + 12], 11, -421815835);
    c = hh(c, d, a, b, state[i + 15], 16, 530742520);
    b = hh(b, c, d, a, state[i + 2], 23, -995338651);

    a = ii(a, b, c, d, state[i + 0], 6, -198630844);
    d = ii(d, a, b, c, state[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, state[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, state[i + 5], 21, -57434055);
    a = ii(a, b, c, d, state[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, state[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, state[i + 10], 15, -1051523);
    b = ii(b, c, d, a, state[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, state[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, state[i + 15], 10, -30611744);
    c = ii(c, d, a, b, state[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, state[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, state[i + 4], 6, -145523070);
    d = ii(d, a, b, c, state[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, state[i + 2], 15, 718787259);
    b = ii(b, c, d, a, state[i + 9], 21, -343485551);

    a = add32(a, olda);
    b = add32(b, oldb);
    c = add32(c, oldc);
    d = add32(d, oldd);
  }

  // Output hex (little-endian)
  const words = [a, b, c, d];
  let out = '';
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    for (let j = 0; j < 4; j++) {
      const byte = (w >>> (j * 8)) & 0xff;
      out += byte.toString(16).padStart(2, '0');
    }
  }
  return out;
}

// ---------- State & DOM ----------
let mode = 'text';
let currentFile = null;
let lastHashes = { md5: '', sha1: '', sha256: '', sha512: '' };
let hashTimer = null;

const inputEl = document.getElementById('input');
const statsIn = document.getElementById('stats-in');
const fileZone = document.getElementById('file-zone');
const fileInput = document.getElementById('file-input');
const fileInfoEl = document.getElementById('file-info');
const progressBox = document.getElementById('progress');
const progressFill = document.getElementById('progress-fill');

function setMode(m) {
  mode = m;
  document.getElementById('mode-text').classList.toggle('active', m === 'text');
  document.getElementById('mode-file').classList.toggle('active', m === 'file');
  document.getElementById('text-pane').style.display = m === 'text' ? 'block' : 'none';
  document.getElementById('file-pane').style.display = m === 'file' ? 'block' : 'none';
  clearHashes();
  if (m === 'text') scheduleHash();
}

function clearHashes() {
  lastHashes = { md5: '', sha1: '', sha256: '', sha512: '' };
  renderHashes();
}

function scheduleHash() {
  clearTimeout(hashTimer);
  hashTimer = setTimeout(hashText, 80);
  statsIn.textContent = `${inputEl.value.length.toLocaleString()} chars`;
}

async function hashText() {
  const s = inputEl.value;
  if (!s) { clearHashes(); return; }
  const bytes = new TextEncoder().encode(s);
  await computeHashes(bytes);
}

async function computeHashes(bytes) {
  lastHashes.md5 = md5(bytes);
  const [h1, h256, h512] = await Promise.all([
    crypto.subtle.digest('SHA-1', bytes),
    crypto.subtle.digest('SHA-256', bytes),
    crypto.subtle.digest('SHA-512', bytes),
  ]);
  lastHashes.sha1 = bufToHex(h1);
  lastHashes.sha256 = bufToHex(h256);
  lastHashes.sha512 = bufToHex(h512);
  renderHashes();
}

function bufToHex(buf) {
  const arr = new Uint8Array(buf);
  let out = '';
  for (let i = 0; i < arr.length; i++) out += arr[i].toString(16).padStart(2, '0');
  return out;
}

function renderHashes() {
  const upper = document.getElementById('opt-upper').checked;
  const fmt = (h) => upper ? h.toUpperCase() : h;
  document.getElementById('out-md5').value = fmt(lastHashes.md5);
  document.getElementById('out-sha1').value = fmt(lastHashes.sha1);
  document.getElementById('out-sha256').value = fmt(lastHashes.sha256);
  document.getElementById('out-sha512').value = fmt(lastHashes.sha512);
}

function copyHash(key) {
  const map = { md5: 'out-md5', sha1: 'out-sha1', sha256: 'out-sha256', sha512: 'out-sha512' };
  const el = document.getElementById(map[key]);
  if (!el.value) return;
  navigator.clipboard.writeText(el.value);
  const btn = el.parentElement.querySelector('.copy-btn');
  btn.classList.add('copied');
  setTimeout(() => btn.classList.remove('copied'), 900);
}

// ---------- File mode ----------
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) loadFile(e.target.files[0]);
});
fileZone.addEventListener('dragover', (e) => { e.preventDefault(); fileZone.classList.add('dragging'); });
fileZone.addEventListener('dragleave', () => fileZone.classList.remove('dragging'));
fileZone.addEventListener('drop', (e) => {
  e.preventDefault();
  fileZone.classList.remove('dragging');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

function loadFile(f) {
  currentFile = f;
  fileInfoEl.textContent = `${f.name} — ${fmtBytes(f.size)}`;
  const showProgress = f.size > 5 * 1024 * 1024;
  progressBox.style.display = showProgress ? 'block' : 'none';
  progressFill.style.width = '10%';

  const reader = new FileReader();
  reader.onprogress = (e) => {
    if (e.lengthComputable) {
      const pct = Math.round((e.loaded / e.total) * 70);
      progressFill.style.width = (10 + pct) + '%';
    }
  };
  reader.onload = async () => {
    progressFill.style.width = '85%';
    const bytes = new Uint8Array(reader.result);
    try {
      await computeHashes(bytes);
      progressFill.style.width = '100%';
      setTimeout(() => { progressBox.style.display = 'none'; progressFill.style.width = '0%'; }, 400);
    } catch (e) {
      progressBox.style.display = 'none';
    }
  };
  reader.onerror = () => { progressBox.style.display = 'none'; };
  reader.readAsArrayBuffer(f);
}

function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + ' MB';
  return (n / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

// Initial
scheduleHash();
