/**
 * HMAC Generator — SubtleCrypto, SHA-1/256/384/512, with hex/base64/base64url output
 */

const keyEl = document.getElementById('key');
const msgEl = document.getElementById('message');
const algoEl = document.getElementById('algorithm');
const out = document.getElementById('hmac-out');
const statusMsg = document.getElementById('status-msg');

let outputFmt = 'hex';
let keyEnc = 'utf8';

document.querySelectorAll('[data-output]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-output]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    outputFmt = btn.dataset.output;
    update();
  });
});
document.querySelectorAll('[data-keyenc]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-keyenc]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    keyEnc = btn.dataset.keyenc;
    update();
  });
});

[keyEl, msgEl, algoEl].forEach(el => el.addEventListener('input', update));

async function update() {
  const keyStr = keyEl.value;
  const msg = msgEl.value;
  const algo = algoEl.value;
  if (!keyStr) { out.textContent = '— (key required)'; return; }
  try {
    const keyBytes = decodeKey(keyStr, keyEnc);
    const msgBytes = new TextEncoder().encode(msg);
    const key = await crypto.subtle.importKey(
      'raw', keyBytes,
      { name: 'HMAC', hash: { name: algo } },
      false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, msgBytes);
    out.textContent = encodeOutput(new Uint8Array(sig), outputFmt);
    out.classList.remove('error');
  } catch (err) {
    out.textContent = 'Error: ' + err.message;
  }
}

function decodeKey(str, enc) {
  if (enc === 'utf8') return new TextEncoder().encode(str);
  if (enc === 'hex') {
    const clean = str.replace(/\s+/g, '');
    if (!/^[0-9a-fA-F]*$/.test(clean) || clean.length % 2) throw new Error('Invalid hex key');
    const arr = new Uint8Array(clean.length / 2);
    for (let i = 0; i < arr.length; i++) arr[i] = parseInt(clean.substr(i * 2, 2), 16);
    return arr;
  }
  if (enc === 'base64') {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
    const bin = atob(padded + '='.repeat((4 - padded.length % 4) % 4));
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }
  return new TextEncoder().encode(str);
}

function encodeOutput(bytes, fmt) {
  if (fmt === 'hex') {
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }
  if (fmt === 'base64' || fmt === 'base64url') {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const b64 = btoa(bin);
    return fmt === 'base64url' ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64;
  }
  return '';
}

document.getElementById('copy-btn').addEventListener('click', async () => {
  if (!out.textContent || out.textContent.startsWith('—')) return;
  await navigator.clipboard.writeText(out.textContent);
  statusMsg.textContent = '✓ Copied';
  statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
});

update();
