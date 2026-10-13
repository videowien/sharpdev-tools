/**
 * AES-GCM Encrypt / Decrypt with PBKDF2 key derivation
 */

const PBKDF2_ITERS = 100000;
const SALT_LEN = 16;
const IV_LEN = 12;

let mode = 'encrypt';
const pwEl = document.getElementById('password');
const togglePw = document.getElementById('toggle-pw');
const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const runBtn = document.getElementById('run-btn');
const statusMsg = document.getElementById('status-msg');
const inputLabel = document.getElementById('input-label');
const outputLabel = document.getElementById('output-label');

togglePw.addEventListener('click', () => {
  pwEl.type = pwEl.type === 'password' ? 'text' : 'password';
  togglePw.textContent = pwEl.type === 'password' ? 'Show' : 'Hide';
});

document.querySelectorAll('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    runBtn.textContent = mode === 'encrypt' ? 'Encrypt' : 'Decrypt';
    inputLabel.textContent = mode === 'encrypt' ? 'Plaintext to encrypt' : 'Ciphertext to decrypt (base64)';
    outputLabel.textContent = mode === 'encrypt' ? 'Output (base64)' : 'Plaintext output';
    // Swap input/output if both have content
    const i = inputEl.value, o = outputEl.value;
    if (i && o) { inputEl.value = o; outputEl.value = ''; }
  });
});

runBtn.addEventListener('click', async () => {
  if (!pwEl.value || !inputEl.value) { flash('Password and input required.', 'error'); return; }
  flash('Working…', 'busy');
  try {
    if (mode === 'encrypt') outputEl.value = await encrypt(pwEl.value, inputEl.value);
    else outputEl.value = await decrypt(pwEl.value, inputEl.value);
    flash('✓ Done', 'ok');
  } catch (err) {
    flash('Failed: ' + (err.message || 'wrong password or corrupted data'), 'error');
  }
});

document.getElementById('copy-btn').addEventListener('click', async () => {
  if (!outputEl.value) return;
  await navigator.clipboard.writeText(outputEl.value);
  flash('✓ Copied', 'ok');
});

document.getElementById('clear-btn').addEventListener('click', () => {
  inputEl.value = ''; outputEl.value = '';
});

async function deriveKey(password, salt) {
  const enc = new TextEncoder().encode(password);
  const baseKey = await crypto.subtle.importKey('raw', enc, { name: 'PBKDF2' }, false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(password, plaintext) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const key = await deriveKey(password, salt);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
  // Pack: salt || iv || ciphertext, then base64
  const combined = new Uint8Array(salt.length + iv.length + cipher.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(cipher), salt.length + iv.length);
  return b64encode(combined);
}

async function decrypt(password, b64ciphertext) {
  const combined = b64decode(b64ciphertext.replace(/\s+/g, ''));
  const salt = combined.slice(0, SALT_LEN);
  const iv = combined.slice(SALT_LEN, SALT_LEN + IV_LEN);
  const cipher = combined.slice(SALT_LEN + IV_LEN);
  const key = await deriveKey(password, salt);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return new TextDecoder().decode(plain);
}

function b64encode(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
function b64decode(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2800);
}
