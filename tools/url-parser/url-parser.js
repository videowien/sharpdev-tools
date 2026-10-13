/** URL Parser using the URL Web API */
const inp = document.getElementById('url-in');
const err = document.getElementById('err');
const partsEl = document.getElementById('up-parts');
const paramsPanel = document.getElementById('up-params');
const paramsList = document.getElementById('up-params-list');

function row(k, v) {
  const d = document.createElement('div');
  d.className = 'up-part';
  const kEl = document.createElement('span');
  kEl.className = 'k';
  kEl.textContent = k;
  const vEl = document.createElement('span');
  vEl.className = 'v' + (v ? '' : ' empty');
  vEl.textContent = v || '(empty)';
  d.append(kEl, vEl);
  return d;
}

function upGo() {
  err.textContent = '';
  const raw = inp.value.trim();
  partsEl.innerHTML = '';
  paramsPanel.style.display = 'none';
  if (!raw) return;
  let u;
  try { u = new URL(raw); }
  catch { err.textContent = 'Not a valid URL. Try including the protocol (https://…).'; return; }
  partsEl.append(
    row('Protocol', u.protocol.replace(':', '')),
    row('Host', u.host),
    row('Hostname', u.hostname),
    row('Port', u.port),
    row('Pathname', u.pathname),
    row('Search', u.search),
    row('Hash', u.hash),
    row('Origin', u.origin),
  );
  // Query params
  paramsList.innerHTML = '';
  const entries = [...u.searchParams.entries()];
  if (entries.length > 0) {
    paramsPanel.style.display = 'block';
    entries.forEach(([k, v]) => {
      const p = document.createElement('div');
      p.className = 'up-param';
      p.innerHTML = `<span class="pk"></span><span class="pv"></span>`;
      p.querySelector('.pk').textContent = k;
      p.querySelector('.pv').textContent = v || '(empty)';
      paramsList.appendChild(p);
    });
  }
}
window.upGo = upGo;
