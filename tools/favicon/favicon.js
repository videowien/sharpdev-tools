(function () {
  const SIZES = [16, 32, 48, 64, 128, 180, 192, 256, 512];
  const EMOJIS = ['\u2B50', '\uD83D\uDD25', '\u26A1', '\uD83D\uDE80', '\uD83D\uDCA1', '\uD83C\uDFAF', '\uD83D\uDCCA', '\uD83D\uDCDD', '\uD83D\uDD27', '\uD83C\uDF1F', '\u2764\uFE0F', '\u2705', '\uD83D\uDD12', '\uD83C\uDFA8', '\uD83D\uDCBB', '\uD83D\uDCF1'];

  let mode = 'emoji';
  let currentImage = null; // HTMLImage for image tab

  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    t.classList.add('active');
    mode = t.dataset.tab;
    document.getElementById('panel-' + mode).classList.add('active');
    render();
  }));

  // Emoji picker
  const picker = document.getElementById('emoji-picker');
  EMOJIS.forEach(e => {
    const el = document.createElement('div');
    el.className = 'epill'; el.textContent = e;
    el.addEventListener('click', () => { document.getElementById('emoji-input').value = e; render(); });
    picker.appendChild(el);
  });

  // Shape buttons
  let shape = 'square';
  document.querySelectorAll('.seg-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      shape = b.dataset.shape;
      render();
    });
  });

  // Image upload
  document.getElementById('image-input').addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => { currentImage = img; URL.revokeObjectURL(url); render(); };
    img.src = url;
  });
  document.getElementById('image-circle').addEventListener('change', render);

  // All inputs
  ['emoji-input', 'text-input', 'text-font', 'text-size', 'text-color', 'text-bg'].forEach(id => {
    document.getElementById(id).addEventListener('input', render);
  });

  function drawTo(canvas, size) {
    const ctx = canvas.getContext('2d');
    canvas.width = size; canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    if (mode === 'emoji') {
      const emoji = document.getElementById('emoji-input').value || '\u2B50';
      ctx.font = (size * 0.82) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, size / 2, size / 2 + size * 0.03);
      return;
    }

    if (mode === 'text') {
      const txt = document.getElementById('text-input').value || 'SD';
      const font = document.getElementById('text-font').value;
      const fontSize = parseInt(document.getElementById('text-size').value);
      const color = document.getElementById('text-color').value;
      const bg = document.getElementById('text-bg').value;

      const fontFamilies = {
        system: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        serif: 'Georgia, "Times New Roman", serif',
        monospace: '"SF Mono", Monaco, "Cascadia Code", monospace',
        cursive: '"Brush Script MT", cursive',
      };

      // Background / shape
      ctx.fillStyle = bg;
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === 'rounded') {
        const r = size * 0.2;
        roundRect(ctx, 0, 0, size, size, r);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, size, size);
      }

      ctx.fillStyle = color;
      ctx.font = '700 ' + (size * fontSize / 100) + 'px ' + fontFamilies[font];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, size / 2, size / 2 + size * 0.04);
      return;
    }

    if (mode === 'image') {
      if (!currentImage) return;
      const circle = document.getElementById('image-circle').checked;
      ctx.save();
      if (circle) {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
      }
      // Square center-crop
      const iw = currentImage.naturalWidth;
      const ih = currentImage.naturalHeight;
      const s = Math.min(iw, ih);
      const sx = (iw - s) / 2;
      const sy = (ih - s) / 2;
      ctx.drawImage(currentImage, sx, sy, s, s, 0, 0, size, size);
      ctx.restore();
      return;
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function render() {
    drawTo(document.getElementById('prev-16'), 16);
    drawTo(document.getElementById('prev-32'), 32);
    drawTo(document.getElementById('prev-256'), 256);
    renderSizeList();
    renderSnippet();
    renderSvg();
  }

  function renderSizeList() {
    const list = document.getElementById('size-list');
    list.innerHTML = '';
    SIZES.forEach(sz => {
      const b = document.createElement('button');
      b.className = 'size-btn';
      b.textContent = sz + 'x' + sz + '.png';
      b.addEventListener('click', () => downloadSize(sz));
      list.appendChild(b);
    });
  }

  async function renderBlob(size) {
    const c = document.createElement('canvas');
    drawTo(c, size);
    return await new Promise(res => c.toBlob(res, 'image/png'));
  }

  async function downloadSize(sz) {
    const blob = await renderBlob(sz);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favicon-' + sz + 'x' + sz + '.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  document.getElementById('btn-zip').addEventListener('click', async () => {
    const files = [];
    for (const sz of SIZES) {
      const blob = await renderBlob(sz);
      const buf = new Uint8Array(await blob.arrayBuffer());
      files.push({ name: 'favicon-' + sz + 'x' + sz + '.png', data: buf });
    }
    // SVG (for emoji/text)
    if (mode !== 'image') {
      const svg = buildSvg();
      files.push({ name: 'favicon.svg', data: new TextEncoder().encode(svg) });
    }
    const zip = SDZip.create(files);
    const url = URL.createObjectURL(zip);
    const a = document.createElement('a');
    a.href = url; a.download = 'favicons.zip'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  function renderSnippet() {
    const lines = [
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
      '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
      '<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">',
      '<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">',
      '<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">',
    ];
    if (mode !== 'image') lines.unshift('<link rel="icon" type="image/svg+xml" href="/favicon.svg">');
    document.getElementById('snippet').value = lines.join('\n');
  }

  function buildSvg() {
    if (mode === 'emoji') {
      const emoji = document.getElementById('emoji-input').value || '\u2B50';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<text x="50" y="70" font-size="78" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">' + escXml(emoji) + '</text>' +
        '</svg>';
    }
    if (mode === 'text') {
      const txt = document.getElementById('text-input').value || 'SD';
      const font = document.getElementById('text-font').value;
      const fontSize = parseInt(document.getElementById('text-size').value);
      const color = document.getElementById('text-color').value;
      const bg = document.getElementById('text-bg').value;
      const fontFamilies = {
        system: 'system-ui, -apple-system, Segoe UI, sans-serif',
        serif: 'Georgia, Times New Roman, serif',
        monospace: 'SF Mono, Monaco, Consolas, monospace',
        cursive: 'Brush Script MT, cursive',
      };
      let shapeSvg;
      if (shape === 'circle') shapeSvg = '<circle cx="50" cy="50" r="50" fill="' + bg + '"/>';
      else if (shape === 'rounded') shapeSvg = '<rect x="0" y="0" width="100" height="100" rx="20" ry="20" fill="' + bg + '"/>';
      else shapeSvg = '<rect x="0" y="0" width="100" height="100" fill="' + bg + '"/>';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' + shapeSvg +
        '<text x="50" y="54" font-size="' + fontSize + '" text-anchor="middle" dominant-baseline="middle" font-weight="700" font-family="' + fontFamilies[font] + '" fill="' + color + '">' + escXml(txt) + '</text>' +
        '</svg>';
    }
    return '';
  }

  function renderSvg() {
    const svg = buildSvg();
    const el = document.getElementById('svg-out');
    const card = document.getElementById('svg-card');
    if (!svg) { card.style.display = 'none'; return; }
    card.style.display = '';
    el.value = svg;
  }

  function escXml(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  document.getElementById('btn-copy-snippet').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('snippet').value).catch(() => {});
  });
  document.getElementById('btn-copy-svg').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('svg-out').value).catch(() => {});
  });

  // Init
  document.getElementById('emoji-input').value = '\u2B50';
  render();
})();
