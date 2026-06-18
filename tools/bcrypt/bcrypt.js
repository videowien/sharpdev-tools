/** Bcrypt hash + verify using bcryptjs */
const $ = id => document.getElementById(id);
const tabs = document.querySelectorAll('.tab-btn');
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
  $('tab-' + t.dataset.tab).style.display = 'block';
}));

// Hash
$('hash-btn').addEventListener('click', async () => {
  const pw = $('pw').value;
  const rounds = parseInt($('rounds').value, 10);
  $('hash-err').textContent = '';
  if (!pw) { $('hash-err').textContent = 'Enter a password.'; return; }
  if (rounds < 4 || rounds > 14) { $('hash-err').textContent = 'Rounds must be 4–14.'; return; }
  if (typeof dcodeIO === 'undefined' && typeof bcrypt === 'undefined') {
    $('hash-err').textContent = 'bcrypt library failed to load.'; return;
  }
  const bcryptLib = window.dcodeIO?.bcrypt || window.bcrypt;
  $('hash-btn').disabled = true;
  $('hash-btn').textContent = 'Hashing...';
  $('hash-out').textContent = '...';
  $('hash-out').classList.remove('empty');
  // Use async-ish: yield to UI
  setTimeout(() => {
    try {
      const salt = bcryptLib.genSaltSync(rounds);
      const hash = bcryptLib.hashSync(pw, salt);
      $('hash-out').textContent = hash;
    } catch (e) {
      $('hash-err').textContent = 'Failed: ' + e.message;
      $('hash-out').textContent = '—'; $('hash-out').classList.add('empty');
    } finally {
      $('hash-btn').disabled = false;
      $('hash-btn').textContent = 'Generate hash';
    }
  }, 10);
});

$('copy-hash').addEventListener('click', async () => {
  const v = $('hash-out').textContent;
  if (!v || v === '—') return;
  try {
    await navigator.clipboard.writeText(v);
    $('copy-hash').textContent = 'Copied';
    $('copy-hash').classList.add('copied');
    setTimeout(() => { $('copy-hash').textContent = 'Copy'; $('copy-hash').classList.remove('copied'); }, 1200);
  } catch {}
});

// Verify
$('verify-btn').addEventListener('click', () => {
  const pw = $('v-pw').value;
  const hash = $('v-hash').value.trim();
  $('verify-err').textContent = '';
  $('verdict').className = 'verdict';
  $('verdict').textContent = '';
  if (!pw || !hash) { $('verify-err').textContent = 'Password and hash required.'; return; }
  const bcryptLib = window.dcodeIO?.bcrypt || window.bcrypt;
  try {
    const ok = bcryptLib.compareSync(pw, hash);
    $('verdict').className = 'verdict ' + (ok ? 'match' : 'nomatch');
    $('verdict').textContent = ok ? '\u2713 Password matches the hash.' : '\u2717 Password does NOT match the hash.';
  } catch (e) {
    $('verify-err').textContent = 'Invalid hash format.';
  }
});
