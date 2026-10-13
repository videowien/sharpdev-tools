/**
 * TOTP Generator — RFC 6238
 */

const secretEl = document.getElementById('secret');
const digitsEl = document.getElementById('digits');
const periodEl = document.getElementById('period');
const algoEl = document.getElementById('algo');
const codeEl = document.getElementById('code');
const cdFill = document.getElementById('cd-fill');
const cdLabel = document.getElementById('cd-label');
const statusMsg = document.getElementById('status-msg');

function base32Decode(s) {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  s = s.toUpperCase().replace(/[\s=]/g, '');
  let bits = '';
  for (const ch of s) {
    const i = alpha.indexOf(ch);
    if (i < 0) throw new Error('Invalid base32 character: ' + ch);
    bits += i.toString(2).padStart(5, '0');
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
  }
  return bytes;
}

async function totp() {
  const secret = (secretEl.value || '').trim();
  if (!secret) { codeEl.textContent = '— — — — — —'; return; }
  let keyBytes;
  try { keyBytes = base32Decode(secret); }
  catch (e) { codeEl.textContent = 'Invalid base32'; return; }
  if (keyBytes.length === 0) { codeEl.textContent = 'Empty secret'; return; }

  const digits = parseInt(digitsEl.value, 10);
  const period = parseInt(periodEl.value, 10);
  const algo = algoEl.value;
  const counter = Math.floor(Date.now() / 1000 / period);

  // Build 8-byte big-endian counter
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(0, Math.floor(counter / 0x100000000), false);
  view.setUint32(4, counter & 0xffffffff, false);

  try {
    const key = await crypto.subtle.importKey('raw', keyBytes,
      { name: 'HMAC', hash: { name: algo } }, false, ['sign']);
    const hmac = new Uint8Array(await crypto.subtle.sign('HMAC', key, buf));
    const offset = hmac[hmac.length - 1] & 0xf;
    const binary = ((hmac[offset] & 0x7f) << 24)
      | ((hmac[offset + 1] & 0xff) << 16)
      | ((hmac[offset + 2] & 0xff) << 8)
      | (hmac[offset + 3] & 0xff);
    const code = (binary % Math.pow(10, digits)).toString().padStart(digits, '0');
    codeEl.textContent = code.match(/.{1,3}/g).join(' ');
  } catch (e) {
    codeEl.textContent = 'Error: ' + e.message;
  }
}

function tick() {
  const period = parseInt(periodEl.value, 10);
  const remaining = period - Math.floor(Date.now() / 1000) % period;
  const pct = (remaining / period) * 100;
  cdFill.style.width = pct + '%';
  cdLabel.textContent = remaining + 's remaining';
  if (remaining === period) totp(); // refresh code at boundary
}

[secretEl, digitsEl, periodEl, algoEl].forEach(el => el.addEventListener('input', totp));
[digitsEl, periodEl, algoEl].forEach(el => el.addEventListener('change', totp));

document.getElementById('copy-btn').addEventListener('click', async () => {
  const c = codeEl.textContent.replace(/\s/g, '');
  if (!c || c.length < 6 || /[a-z]/i.test(c.replace(/\d/g, ''))) return;
  await navigator.clipboard.writeText(c);
  statusMsg.textContent = '✓ Copied'; statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
});

totp();
setInterval(() => { totp(); }, 1000);
setInterval(tick, 250);
tick();
