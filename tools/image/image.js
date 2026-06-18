(function () {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const list = document.getElementById('list');
  const btnProcess = document.getElementById('btn-process');
  const btnZip = document.getElementById('btn-zip');
  const btnClear = document.getElementById('btn-clear');
  const qVal = document.getElementById('q-val');
  const qSlider = document.getElementById('opt-quality');
  const optTarget = document.getElementById('opt-target');
  const qRow = document.getElementById('quality-row');
  const tRow = document.getElementById('target-row');
  const segBtns = document.querySelectorAll('.seg-btn');
  const compareBox = document.getElementById('compare');
  const origImg = document.getElementById('orig-img');
  const newImg = document.getElementById('new-img');
  const origSize = document.getElementById('orig-size');
  const newSize = document.getElementById('new-size');

  let mode = 'quality';
  let items = []; // { id, file, origUrl, origBytes, outBlob, outUrl, status }
  let nextId = 1;
  let selectedId = null;

  function fmtKB(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(2) + ' MB';
  }

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault(); dropZone.classList.remove('dragover');
    addFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', () => addFiles(fileInput.files));

  segBtns.forEach(b => b.addEventListener('click', () => {
    segBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    mode = b.dataset.mode;
    qRow.style.display = mode === 'quality' ? '' : 'none';
    tRow.style.display = mode === 'target' ? '' : 'none';
  }));

  qSlider.addEventListener('input', () => { qVal.textContent = qSlider.value; });

  btnClear.addEventListener('click', () => {
    items.forEach(it => {
      if (it.origUrl) URL.revokeObjectURL(it.origUrl);
      if (it.outUrl) URL.revokeObjectURL(it.outUrl);
    });
    items = [];
    selectedId = null;
    render();
    compareBox.style.display = 'none';
    btnProcess.disabled = true; btnZip.disabled = true;
  });

  function addFiles(fileList) {
    for (const f of fileList) {
      if (!f.type.startsWith('image/')) continue;
      const it = {
        id: nextId++, file: f,
        origUrl: URL.createObjectURL(f),
        origBytes: f.size,
        outBlob: null, outUrl: null,
        status: 'pending'
      };
      items.push(it);
    }
    render();
    btnProcess.disabled = items.length === 0;
  }

  function render() {
    list.innerHTML = '';
    items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'row' + (it.id === selectedId ? ' selected' : '');
      const newBytes = it.outBlob ? it.outBlob.size : null;
      const reduction = newBytes != null ? Math.round((1 - newBytes / it.origBytes) * 100) : null;
      row.innerHTML =
        '<img class="thumb" src="' + it.origUrl + '" alt="">' +
        '<div class="meta">' +
          '<div class="fname">' + escapeHtml(it.file.name) + '</div>' +
          '<div class="info">' + fmtKB(it.origBytes) +
          (newBytes != null ? '  \u2192  ' + fmtKB(newBytes) : '') + '</div>' +
        '</div>' +
        '<div class="status">' + it.status + '</div>' +
        '<div class="reduction ' + (reduction != null && reduction < 0 ? 'neg' : '') + '">' +
          (reduction != null ? (reduction >= 0 ? '-' : '+') + Math.abs(reduction) + '%' : '') +
        '</div>' +
        (it.outBlob ? '<button class="dl-btn" data-dl="' + it.id + '">Download</button>' : '<span></span>');
      row.addEventListener('click', (e) => {
        if (e.target.dataset.dl) return;
        selectedId = it.id;
        renderCompare();
        render();
      });
      const dl = row.querySelector('.dl-btn');
      if (dl) dl.addEventListener('click', (e) => { e.stopPropagation(); downloadSingle(it); });
      list.appendChild(row);
    });
  }

  function renderCompare() {
    const it = items.find(x => x.id === selectedId);
    if (!it || !it.outBlob) { compareBox.style.display = 'none'; return; }
    compareBox.style.display = '';
    origImg.src = it.origUrl;
    newImg.src = it.outUrl;
    origSize.textContent = '(' + fmtKB(it.origBytes) + ')';
    newSize.textContent = '(' + fmtKB(it.outBlob.size) + ')';
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  btnProcess.addEventListener('click', async () => {
    btnProcess.disabled = true;
    for (const it of items) {
      it.status = 'processing';
      render();
      try {
        await processOne(it);
        it.status = 'done';
      } catch (e) {
        console.error(e);
        it.status = 'error';
      }
      render();
    }
    btnProcess.disabled = false;
    btnZip.disabled = !items.some(x => x.outBlob);
    if (!selectedId && items.length) {
      selectedId = items[0].id;
      renderCompare();
      render();
    }
  });

  async function processOne(it) {
    const maxW = parseInt(document.getElementById('opt-w').value) || 0;
    const maxH = parseInt(document.getElementById('opt-h').value) || 0;
    const keepAspect = document.getElementById('opt-aspect').checked;
    const fmt = document.getElementById('opt-format').value;

    const img = await loadImage(it.origUrl);
    let w = img.naturalWidth, h = img.naturalHeight;

    if (maxW || maxH) {
      if (keepAspect) {
        const wr = maxW ? maxW / w : Infinity;
        const hr = maxH ? maxH / h : Infinity;
        const r = Math.min(wr, hr, 1);
        w = Math.round(w * r); h = Math.round(h * r);
      } else {
        if (maxW) w = Math.min(w, maxW);
        if (maxH) h = Math.min(h, maxH);
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);

    let outMime = fmt === 'keep' ? (it.file.type || 'image/jpeg') : fmt;
    if (outMime === 'image/png') outMime = 'image/png'; // png ignores quality

    let blob;
    if (mode === 'quality') {
      const q = parseInt(qSlider.value) / 100;
      blob = await canvasToBlob(canvas, outMime, q);
    } else {
      // Target size binary search
      const targetBytes = parseInt(optTarget.value) * 1024;
      if (outMime === 'image/png') {
        // PNG doesn't support quality — just produce at current size
        blob = await canvasToBlob(canvas, outMime, 1);
      } else {
        let lo = 0.1, hi = 0.95, best = null;
        for (let i = 0; i < 8; i++) {
          const q = (lo + hi) / 2;
          const b = await canvasToBlob(canvas, outMime, q);
          if (b.size > targetBytes) hi = q;
          else { best = b; lo = q; }
        }
        blob = best || await canvasToBlob(canvas, outMime, 0.1);
      }
    }

    if (it.outUrl) URL.revokeObjectURL(it.outUrl);
    it.outBlob = blob;
    it.outUrl = URL.createObjectURL(blob);
    it.outName = suggestName(it.file.name, outMime);
  }

  function suggestName(origName, mime) {
    const base = origName.replace(/\.[^.]+$/, '');
    const ext = mime === 'image/jpeg' ? 'jpg'
      : mime === 'image/png' ? 'png'
      : mime === 'image/webp' ? 'webp'
      : 'img';
    return base + '.' + ext;
  }

  function canvasToBlob(c, mime, q) {
    return new Promise((res) => c.toBlob(b => res(b), mime, q));
  }

  function loadImage(url) {
    return new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
  }

  function downloadSingle(it) {
    const a = document.createElement('a');
    a.href = it.outUrl;
    a.download = it.outName;
    a.click();
  }

  btnZip.addEventListener('click', async () => {
    const ready = items.filter(x => x.outBlob);
    if (!ready.length) return;
    const files = [];
    for (const it of ready) {
      const buf = new Uint8Array(await it.outBlob.arrayBuffer());
      files.push({ name: it.outName, data: buf });
    }
    const blob = SDZip.create(files);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'images.zip'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
