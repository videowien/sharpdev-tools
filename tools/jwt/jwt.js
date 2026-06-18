/**
 * JWT Decoder — SharpDev Tools
 */

const tokenEl = document.getElementById('token-input');
const coloredEl = document.getElementById('token-colored');
const headerOut = document.getElementById('header-out');
const payloadOut = document.getElementById('payload-out');
const signatureOut = document.getElementById('signature-out');
const errorBox = document.getElementById('error-box');
const claimsCard = document.getElementById('claims-card');
const claimsList = document.getElementById('claims-list');

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE5MDAwMDAwMDAsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJhdWQiOiJhcGkuZXhhbXBsZS5jb20iLCJqdGkiOiJhYmMxMjMifQ.DpDNFMXkGmZPFXCK1QKqNxGqSR5kKZc7hJ2YqP1u4Jg';

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  try {
    return decodeURIComponent(escape(atob(s)));
  } catch (e) {
    throw new Error('Invalid base64url encoding');
  }
}

function highlightToken(token) {
  const parts = token.split('.');
  if (parts.length < 1) { coloredEl.textContent = token; return; }
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    const cls = i === 0 ? 'tok-h' : i === 1 ? 'tok-p' : 'tok-s';
    if (i > 0) html += '<span class="tok-dot">.</span>';
    html += `<span class="${cls}">${escHtml(parts[i])}</span>`;
  }
  coloredEl.innerHTML = html;
}

function highlightJson(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"([^"\\]*(?:\\.[^"\\]*)*)"(\s*:)/g, '<span class="j-key">"$1"</span>$2')
    .replace(/:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g, ': <span class="j-str">"$1"</span>')
    .replace(/:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g, ': <span class="j-num">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="j-bool">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="j-null">$1</span>');
}

function showError(msg) {
  errorBox.innerHTML = `<strong>Error</strong>${escHtml(msg)}`;
  errorBox.style.display = 'block';
}
function hideError() { errorBox.style.display = 'none'; }

function clearOutputs() {
  headerOut.textContent = '—';
  payloadOut.textContent = '—';
  signatureOut.textContent = '—';
  claimsCard.style.display = 'none';
}

function fmtDate(ts) {
  const d = new Date(ts * 1000);
  if (isNaN(d)) return null;
  const pad = n => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}

function relTime(ts) {
  const now = Date.now() / 1000;
  const diff = ts - now;
  const abs = Math.abs(diff);
  let unit, val;
  if (abs < 60) { unit = 'second'; val = Math.round(abs); }
  else if (abs < 3600) { unit = 'minute'; val = Math.round(abs / 60); }
  else if (abs < 86400) { unit = 'hour'; val = Math.round(abs / 3600); }
  else if (abs < 86400 * 30) { unit = 'day'; val = Math.round(abs / 86400); }
  else if (abs < 86400 * 365) { unit = 'month'; val = Math.round(abs / (86400 * 30)); }
  else { unit = 'year'; val = Math.round(abs / (86400 * 365)); }
  const s = val !== 1 ? 's' : '';
  return diff >= 0 ? `in ${val} ${unit}${s}` : `${val} ${unit}${s} ago`;
}

const CLAIM_MEANINGS = {
  iat: 'Issued at',
  exp: 'Expires at',
  nbf: 'Not before',
  sub: 'Subject',
  iss: 'Issuer',
  aud: 'Audience',
  jti: 'JWT ID',
};

function renderClaims(payload) {
  const known = Object.keys(CLAIM_MEANINGS).filter(k => payload[k] !== undefined);
  if (!known.length) { claimsCard.style.display = 'none'; return; }
  let html = '';
  const now = Date.now() / 1000;
  for (const k of known) {
    const v = payload[k];
    let valueHtml;
    let sub = '';
    let cls = '';
    if (k === 'iat' || k === 'exp' || k === 'nbf') {
      if (typeof v === 'number') {
        valueHtml = escHtml(String(v));
        sub = fmtDate(v) + ' · ' + relTime(v);
        if (k === 'exp') cls = v < now ? 'claim-expired' : 'claim-ok';
        if (k === 'nbf') cls = v > now ? 'claim-expired' : 'claim-ok';
      } else {
        valueHtml = escHtml(JSON.stringify(v));
      }
    } else {
      valueHtml = escHtml(typeof v === 'string' ? v : JSON.stringify(v));
    }
    html += `<div class="claim">
      <div class="claim-name">${escHtml(k)} · ${escHtml(CLAIM_MEANINGS[k])}</div>
      <div class="claim-val ${cls}">${valueHtml}</div>
      ${sub ? `<div class="claim-sub ${cls}">${escHtml(sub)}</div>` : ''}
    </div>`;
  }
  claimsList.innerHTML = html;
  claimsCard.style.display = 'block';
}

function decode() {
  const raw = tokenEl.value.trim();
  highlightToken(raw);
  if (!raw) { hideError(); clearOutputs(); return; }
  const parts = raw.split('.');
  if (parts.length !== 3) {
    showError(`A JWT has exactly 3 parts separated by dots. Found ${parts.length} part${parts.length===1?'':'s'}.`);
    clearOutputs();
    return;
  }
  let header, payload;
  try {
    header = JSON.parse(b64urlDecode(parts[0]));
  } catch (e) {
    showError('Header is not valid JSON/base64url: ' + e.message);
    clearOutputs();
    return;
  }
  try {
    payload = JSON.parse(b64urlDecode(parts[1]));
  } catch (e) {
    showError('Payload is not valid JSON/base64url: ' + e.message);
    headerOut.innerHTML = highlightJson(header);
    payloadOut.textContent = '—';
    signatureOut.textContent = parts[2] || '(empty)';
    claimsCard.style.display = 'none';
    return;
  }
  hideError();
  headerOut.innerHTML = highlightJson(header);
  payloadOut.innerHTML = highlightJson(payload);
  signatureOut.textContent = parts[2] || '(empty)';
  renderClaims(payload);
}

function copyPanel(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.textContent);
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 900);
}

function loadSample() {
  tokenEl.value = SAMPLE;
  decode();
}

function clearAll() {
  tokenEl.value = '';
  hideError();
  clearOutputs();
  highlightToken('');
}

// Sync scroll of colored overlay with textarea
tokenEl.addEventListener('scroll', () => {
  coloredEl.scrollTop = tokenEl.scrollTop;
  coloredEl.scrollLeft = tokenEl.scrollLeft;
});

loadSample();
