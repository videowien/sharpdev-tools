/** JWT Signer — HMAC via Web Crypto API */
const headerEl = document.getElementById('header');
const payloadEl = document.getElementById('payload');
const secretEl = document.getElementById('secret');
const algEl = document.getElementById('alg');
const signBtn = document.getElementById('sign-btn');
const out = document.getElementById('jwt-output');
const err = document.getElementById('err');
const copyBtn = document.getElementById('copy-btn');

const HASH_MAP = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' };

function base64urlEncode(bytes) {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function strToBase64url(s) {
  return base64urlEncode(new TextEncoder().encode(s));
}

async function sign() {
  err.textContent = '';
  let header, payload;
  try { header = JSON.parse(headerEl.value); } catch { err.textContent = 'Invalid JSON in header.'; return; }
  try { payload = JSON.parse(payloadEl.value); } catch { err.textContent = 'Invalid JSON in payload.'; return; }
  const alg = algEl.value;
  header.alg = alg; header.typ = header.typ || 'JWT';
  const secret = secretEl.value;
  if (!secret) { err.textContent = 'Secret is required.'; return; }

  const headerB = strToBase64url(JSON.stringify(header));
  const payloadB = strToBase64url(JSON.stringify(payload));
  const signingInput = headerB + '.' + payloadB;
  try {
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: HASH_MAP[alg] }, false, ['sign']
    );
    const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
    const sigB = base64urlEncode(sigBuf);
    const jwt = signingInput + '.' + sigB;
    out.classList.remove('empty');
    out.innerHTML =
      `<span class="h">${headerB}</span>.<span class="p">${payloadB}</span>.<span class="s">${sigB}</span>`;
    out.dataset.raw = jwt;
  } catch (e) {
    err.textContent = 'Signing failed: ' + e.message;
  }
}

signBtn.addEventListener('click', sign);
[headerEl, payloadEl, secretEl, algEl].forEach(el => el.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sign();
}));

copyBtn.addEventListener('click', async () => {
  if (!out.dataset.raw) return;
  try {
    await navigator.clipboard.writeText(out.dataset.raw);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});
