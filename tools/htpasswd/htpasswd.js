/** .htpasswd entry generator (bcrypt) */
const $ = id => document.getElementById(id);
$('gen-btn').addEventListener('click', () => {
  $('err').textContent = '';
  const user = $('user').value.trim();
  const pass = $('pass').value;
  const cost = parseInt($('cost').value, 10);
  if (!user) { $('err').textContent = 'Username required.'; return; }
  if (!pass) { $('err').textContent = 'Password required.'; return; }
  if (/[\s:]/.test(user)) { $('err').textContent = 'Username cannot contain spaces or colons.'; return; }
  if (cost < 4 || cost > 14) { $('err').textContent = 'Cost must be 4–14.'; return; }
  const bcryptLib = window.dcodeIO?.bcrypt || window.bcrypt;
  if (!bcryptLib) { $('err').textContent = 'bcrypt library failed to load.'; return; }
  $('gen-btn').disabled = true;
  $('gen-btn').textContent = 'Hashing...';
  $('out').textContent = '...'; $('out').classList.remove('empty');
  setTimeout(() => {
    try {
      const salt = bcryptLib.genSaltSync(cost);
      // htpasswd uses the $2y$ variant (Apache-specific, functionally identical to $2a$)
      let hash = bcryptLib.hashSync(pass, salt);
      hash = hash.replace(/^\$2a\$/, '$2y$');
      $('out').textContent = `${user}:${hash}`;
    } catch (e) {
      $('err').textContent = 'Failed: ' + e.message;
      $('out').textContent = '—'; $('out').classList.add('empty');
    } finally {
      $('gen-btn').disabled = false;
      $('gen-btn').textContent = 'Generate entry';
    }
  }, 10);
});
$('copy-btn').addEventListener('click', async () => {
  const v = $('out').textContent;
  if (!v || v === '—' || v === '...') return;
  try {
    await navigator.clipboard.writeText(v);
    $('copy-btn').textContent = 'Copied'; $('copy-btn').classList.add('copied');
    setTimeout(() => { $('copy-btn').textContent = 'Copy'; $('copy-btn').classList.remove('copied'); }, 1200);
  } catch {}
});
