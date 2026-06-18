(function () {
  const inBin = document.getElementById('in-bin');
  const inOct = document.getElementById('in-oct');
  const inDec = document.getElementById('in-dec');
  const inHex = document.getElementById('in-hex');
  const errBin = document.getElementById('err-bin');
  const errOct = document.getElementById('err-oct');
  const errDec = document.getElementById('err-dec');
  const errHex = document.getElementById('err-hex');
  const fields = {
    bin: { input: inBin, err: errBin, base: 2, re: /^[01]+$/ },
    oct: { input: inOct, err: errOct, base: 8, re: /^[0-7]+$/ },
    dec: { input: inDec, err: errDec, base: 10, re: /^[0-9]+$/ },
    hex: { input: inHex, err: errHex, base: 16, re: /^[0-9a-fA-F]+$/ },
  };
  const bitsEl = document.getElementById('bits');
  const asciiEl = document.getElementById('ascii');

  const MAX = (1n << 64n) - 1n;

  let current = 0n;
  let suppress = false;

  function clean(str, base) {
    let s = str.trim().replace(/[_ ]/g, '');
    if (base === 16 && s.toLowerCase().startsWith('0x')) s = s.slice(2);
    else if (base === 2 && s.toLowerCase().startsWith('0b')) s = s.slice(2);
    else if (base === 8 && s.toLowerCase().startsWith('0o')) s = s.slice(2);
    return s;
  }

  function parse(str, base) {
    const s = clean(str, base);
    if (!s) return { ok: true, val: 0n, empty: true };
    if (!fields[baseKey(base)].re.test(s)) return { ok: false, err: 'Invalid digit for base ' + base };
    try {
      let prefix = base === 2 ? '0b' : base === 8 ? '0o' : base === 16 ? '0x' : '';
      const v = BigInt(prefix + s);
      if (v > MAX) return { ok: false, err: 'Exceeds 64-bit range' };
      return { ok: true, val: v };
    } catch (e) {
      return { ok: false, err: 'Parse error' };
    }
  }

  function baseKey(b) {
    return b === 2 ? 'bin' : b === 8 ? 'oct' : b === 10 ? 'dec' : 'hex';
  }

  function clearErrors() {
    for (const k in fields) {
      fields[k].err.textContent = '';
      fields[k].input.parentElement.classList.remove('error');
    }
  }

  function setError(key, msg) {
    fields[key].err.textContent = msg;
    fields[key].input.parentElement.classList.add('error');
  }

  function updateFromField(key) {
    if (suppress) return;
    const f = fields[key];
    const r = parse(f.input.value, f.base);
    clearErrors();
    if (!r.ok) {
      setError(key, r.err);
      return;
    }
    current = r.val;
    renderAll(key);
  }

  function renderAll(skipKey) {
    suppress = true;
    for (const k in fields) {
      if (k === skipKey) continue;
      fields[k].input.value = current.toString(fields[k].base).toUpperCase();
    }
    // decimal as lowercase digits (no difference) & hex as uppercase already
    // Re-lowercase binary/oct/dec since toString produces lowercase for non-hex (no letters anyway)
    fields.bin.input.value = current.toString(2);
    fields.oct.input.value = current.toString(8);
    fields.dec.input.value = current.toString(10);
    fields.hex.input.value = current.toString(16).toUpperCase();
    if (skipKey) fields[skipKey].input.value = fields[skipKey].input.value; // keep user's exact chars
    suppress = false;
    renderBits();
    renderAscii();
  }

  function renderBits() {
    const bitsEl = document.getElementById('bits');
    bitsEl.innerHTML = '';
    // 4 groups of 16 bits = 64 bits total, MSB first
    for (let g = 0; g < 4; g++) {
      const group = document.createElement('div');
      group.className = 'bit-group';
      for (let i = 0; i < 16; i++) {
        const bitIndex = 63 - (g * 16 + i);
        const on = ((current >> BigInt(bitIndex)) & 1n) === 1n;
        const b = document.createElement('div');
        b.className = 'bit' + (on ? ' on' : '');
        b.textContent = on ? '1' : '0';
        b.title = 'bit ' + bitIndex;
        b.addEventListener('click', () => {
          current = current ^ (1n << BigInt(bitIndex));
          renderAll();
        });
        group.appendChild(b);
      }
      bitsEl.appendChild(group);
    }
  }

  function renderAscii() {
    if (current < 0n || current > 0x10FFFFn) {
      asciiEl.innerHTML = '<span class="meta">Out of Unicode range</span>';
      return;
    }
    const cp = Number(current);
    let out;
    if (cp < 32 || cp === 127) {
      out = '\\x' + cp.toString(16).toUpperCase().padStart(2, '0');
    } else if (cp >= 32 && cp < 127) {
      out = String.fromCodePoint(cp);
    } else {
      out = String.fromCodePoint(cp);
    }
    const hex = cp <= 0xFFFF ? 'U+' + cp.toString(16).toUpperCase().padStart(4, '0') : 'U+' + cp.toString(16).toUpperCase();
    asciiEl.innerHTML = '<span>' + escapeHtml(out) + '</span><span class="meta">' + hex + ' &middot; dec ' + cp + '</span>';
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  for (const k in fields) {
    fields[k].input.addEventListener('input', () => updateFromField(k));
  }

  document.querySelectorAll('.preset').forEach(p => {
    p.addEventListener('click', () => {
      current = BigInt(p.dataset.val);
      clearErrors();
      renderAll();
    });
  });

  // init
  current = 42n;
  renderAll();
})();
