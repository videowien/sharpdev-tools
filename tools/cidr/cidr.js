(function(){
  const cidrInput = document.getElementById('cidr');
  const ipInput = document.getElementById('ip');
  const prefixInput = document.getElementById('prefix');
  const prefixVal = document.getElementById('prefix-val');
  const errEl = document.getElementById('err');
  const results = document.getElementById('results');
  const binRow = document.getElementById('bin-row');
  const splitPrefix = document.getElementById('split-prefix');
  const splitPrefixVal = document.getElementById('split-prefix-val');
  const splitMeta = document.getElementById('split-meta');
  const splitList = document.getElementById('split-list');

  function parseIp(str) {
    if (typeof str !== 'string') return null;
    const parts = str.trim().split('.');
    if (parts.length !== 4) return null;
    const octets = [];
    for (const p of parts) {
      if (!/^\d+$/.test(p)) return null;
      const n = parseInt(p, 10);
      if (n < 0 || n > 255) return null;
      octets.push(n);
    }
    return octets;
  }
  function ipToLong(oct) {
    return (oct[0] * 16777216 + oct[1] * 65536 + oct[2] * 256 + oct[3]) >>> 0;
  }
  function longToIp(n) {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  }
  function maskFromPrefix(p) {
    if (p === 0) return 0;
    return (0xFFFFFFFF << (32 - p)) >>> 0;
  }
  function ipClass(first) {
    if (first < 128) return 'A';
    if (first < 192) return 'B';
    if (first < 224) return 'C';
    if (first < 240) return 'D';
    return 'E';
  }
  function ipType(oct) {
    const a = oct[0], b = oct[1];
    if (a === 10) return 'Private';
    if (a === 172 && b >= 16 && b <= 31) return 'Private';
    if (a === 192 && b === 168) return 'Private';
    if (a === 127) return 'Loopback';
    if (a === 169 && b === 254) return 'Link-local';
    if (a >= 224 && a <= 239) return 'Multicast';
    if (a >= 240) return 'Reserved';
    if (a === 0) return 'Reserved';
    if (a === 100 && b >= 64 && b <= 127) return 'Shared (CGNAT)';
    return 'Public';
  }

  let current = null;
  let syncing = false;

  function calc() {
    const oct = parseIp(ipInput.value);
    const prefix = parseInt(prefixInput.value, 10);
    if (!oct || isNaN(prefix) || prefix < 0 || prefix > 32) {
      showError('Invalid IP or prefix');
      return;
    }
    showError('');
    const ipLong = ipToLong(oct);
    const mask = maskFromPrefix(prefix);
    const wildcard = (~mask) >>> 0;
    const network = (ipLong & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const total = prefix === 32 ? 1 : (prefix === 31 ? 2 : Math.pow(2, 32 - prefix));
    let firstHost, lastHost, usable;
    if (prefix >= 31) {
      firstHost = network;
      lastHost = broadcast;
      usable = prefix === 32 ? 1 : 2;
    } else {
      firstHost = (network + 1) >>> 0;
      lastHost = (broadcast - 1) >>> 0;
      usable = total - 2;
    }
    const netOct = [(network >>> 24) & 255, (network >>> 16) & 255, (network >>> 8) & 255, network & 255];
    const cls = ipClass(netOct[0]);
    const type = ipType(netOct);

    current = { ipLong, prefix, mask, wildcard, network, broadcast, firstHost, lastHost, total, usable, cls, type, netOct };
    renderResults();
    renderBinary();
    updateSplitBounds();
    renderSplit();
  }

  function showError(msg) {
    errEl.textContent = msg;
    if (msg) cidrInput.classList.add('invalid');
    else cidrInput.classList.remove('invalid');
  }

  function renderResults() {
    const c = current;
    const fmt = n => n.toLocaleString('en-US');
    const items = [
      { label: 'Network Address', val: longToIp(c.network), accent: true },
      { label: 'Broadcast Address', val: longToIp(c.broadcast) },
      { label: 'CIDR Notation', val: longToIp(c.network) + '/' + c.prefix, accent: true },
      { label: 'First Usable Host', val: c.prefix >= 31 ? '—' : longToIp(c.firstHost) },
      { label: 'Last Usable Host', val: c.prefix >= 31 ? '—' : longToIp(c.lastHost) },
      { label: 'Subnet Mask', val: longToIp(c.mask) },
      { label: 'Wildcard Mask', val: longToIp(c.wildcard) },
      { label: 'Total Addresses', val: fmt(c.total) },
      { label: 'Usable Hosts', val: fmt(c.usable) },
      { label: 'Class', val: c.cls + ' <span class="class-badge class-' + c.cls + '">Class ' + c.cls + '</span>', html: true },
      { label: 'Type', val: c.type },
      { label: 'IP Range', val: longToIp(c.network) + ' – ' + longToIp(c.broadcast) },
    ];
    results.innerHTML = items.map(it => {
      const val = it.html ? it.val : escapeHtml(it.val);
      return '<div class="stat-card" data-copy="' + escapeAttr(it.html ? stripTags(it.val) : it.val) + '">' +
        '<div class="stat-label">' + it.label + '</div>' +
        '<div class="stat-val' + (it.accent ? ' accent' : '') + '">' + val + '</div></div>';
    }).join('');
    results.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('click', () => copyToClipboard(card.dataset.copy, card));
    });
  }

  function renderBinary() {
    const c = current;
    const oct = c.netOct;
    const pieces = [];
    let bitIdx = 0;
    for (let i = 0; i < 4; i++) {
      const bits = oct[i].toString(2).padStart(8, '0');
      let octHtml = '';
      for (let j = 0; j < 8; j++) {
        const cls = bitIdx < c.prefix ? 'net' : 'host';
        octHtml += '<span class="bit ' + cls + '">' + bits[j] + '</span>';
        bitIdx++;
      }
      pieces.push('<span class="bin-octet">' + octHtml + '</span>');
    }
    binRow.innerHTML = pieces.join('<span class="bin-sep">.</span>');
  }

  function updateSplitBounds() {
    const min = current.prefix;
    splitPrefix.min = min;
    if (parseInt(splitPrefix.value, 10) < min) splitPrefix.value = min;
    splitPrefixVal.textContent = splitPrefix.value;
  }

  function renderSplit() {
    const c = current;
    const newPrefix = parseInt(splitPrefix.value, 10);
    splitPrefixVal.textContent = newPrefix;
    if (newPrefix < c.prefix) {
      splitMeta.textContent = 'Choose a prefix longer than /' + c.prefix;
      splitList.innerHTML = '';
      return;
    }
    if (newPrefix === c.prefix) {
      splitMeta.textContent = '1 subnet (same as current)';
      splitList.innerHTML = '';
      return;
    }
    const count = Math.pow(2, newPrefix - c.prefix);
    const size = Math.pow(2, 32 - newPrefix);
    const shown = Math.min(count, 64);
    splitMeta.textContent = count.toLocaleString('en-US') + ' subnets of ' + size.toLocaleString('en-US') + ' addresses each' + (count > 64 ? ' — showing first 64' : '');
    let html = '';
    for (let i = 0; i < shown; i++) {
      const net = (c.network + i * size) >>> 0;
      const bcast = (net + size - 1) >>> 0;
      const cidr = longToIp(net) + '/' + newPrefix;
      html += '<div class="split-item" data-copy="' + cidr + '">' +
        '<div>' + cidr + '</div>' +
        '<div class="range">' + longToIp(net) + ' – ' + longToIp(bcast) + '</div></div>';
    }
    splitList.innerHTML = html;
    splitList.querySelectorAll('.split-item').forEach(it => {
      it.addEventListener('click', () => copyToClipboard(it.dataset.copy, it));
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }
  function stripTags(s) { return String(s).replace(/<[^>]+>/g, ''); }

  function copyToClipboard(text, el) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => flash(el));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch(e){}
      document.body.removeChild(ta);
      flash(el);
    }
  }
  function flash(el) {
    el.classList.add('copied');
    setTimeout(() => el.classList.remove('copied'), 800);
  }

  // Sync CIDR <-> IP+prefix
  cidrInput.addEventListener('input', () => {
    if (syncing) return;
    const val = cidrInput.value.trim();
    const m = val.match(/^([\d.]+)\/(\d+)$/);
    if (!m) {
      showError('Use format: 192.168.1.0/24');
      return;
    }
    const oct = parseIp(m[1]);
    const p = parseInt(m[2], 10);
    if (!oct) { showError('Invalid IP address'); return; }
    if (p < 0 || p > 32) { showError('Prefix must be 0-32'); return; }
    syncing = true;
    ipInput.value = m[1];
    prefixInput.value = p;
    prefixVal.textContent = '/' + p;
    syncing = false;
    calc();
  });

  function syncCidrFromParts() {
    if (syncing) return;
    const oct = parseIp(ipInput.value);
    const p = parseInt(prefixInput.value, 10);
    prefixVal.textContent = '/' + p;
    if (!oct) { showError('Invalid IP address'); return; }
    syncing = true;
    cidrInput.value = ipInput.value.trim() + '/' + p;
    syncing = false;
    calc();
  }
  ipInput.addEventListener('input', syncCidrFromParts);
  prefixInput.addEventListener('input', syncCidrFromParts);
  splitPrefix.addEventListener('input', renderSplit);

  calc();
})();
