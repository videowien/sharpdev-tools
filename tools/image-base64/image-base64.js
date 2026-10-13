(function(){
  const drop = document.getElementById('drop');
  const file = document.getElementById('file');
  const result = document.getElementById('result');
  const preview = document.getElementById('preview');
  const previewInfo = document.getElementById('preview-info');
  const stats = document.getElementById('stats');
  const output = document.getElementById('output');
  const warnBig = document.getElementById('warn-big');
  const copyBtn = document.getElementById('copy-btn');
  const dlBtn = document.getElementById('dl-btn');

  const encodePanel = document.getElementById('encode-panel');
  const decodePanel = document.getElementById('decode-panel');
  const decodeIn = document.getElementById('decode-in');
  const decodeCard = document.getElementById('decode-preview-card');
  const decodePreview = document.getElementById('decode-preview');
  const decodeInfo = document.getElementById('decode-info');
  const decodeDl = document.getElementById('decode-dl');

  let originalDataUrl = '';
  let originalBytes = 0;
  let origType = '';
  let origName = 'image';
  let currentDataUrl = '';
  let currentWidth = 0;
  let currentHeight = 0;

  function fmtBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024*1024) return (n/1024).toFixed(1) + ' KB';
    return (n/1024/1024).toFixed(2) + ' MB';
  }

  function handleFile(f) {
    if (!f || !f.type.startsWith('image/')) {
      alert('Please provide an image file');
      return;
    }
    origName = (f.name || 'image').replace(/\.[^.]+$/, '');
    origType = f.type;
    originalBytes = f.size;
    const reader = new FileReader();
    reader.onload = e => {
      originalDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        currentWidth = img.width;
        currentHeight = img.height;
        renderPreview(originalDataUrl, img.width, img.height);
        applyReencode();
      };
      img.src = originalDataUrl;
    };
    reader.readAsDataURL(f);
  }

  function renderPreview(dataUrl, w, h) {
    preview.src = dataUrl;
    previewInfo.innerHTML =
      '<div><strong>Type:</strong> ' + escapeHtml(origType) + '</div>' +
      '<div><strong>Dimensions:</strong> ' + w + ' × ' + h + ' px</div>' +
      '<div><strong>Original size:</strong> ' + fmtBytes(originalBytes) + '</div>';
    result.style.display = 'block';
  }

  function applyReencode() {
    const fmt = document.querySelector('input[name="fmt"]:checked').value;
    if (fmt === 'orig') {
      setCurrent(originalDataUrl);
      return;
    }
    const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/webp';
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (fmt === 'jpg') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      try {
        const d = canvas.toDataURL(mime, 0.85);
        setCurrent(d);
      } catch(e) {
        alert('Re-encode failed: ' + e.message);
      }
    };
    img.src = originalDataUrl;
  }

  function setCurrent(dataUrl) {
    currentDataUrl = dataUrl;
    preview.src = dataUrl;
    const base64Len = dataUrl.length;
    const bytes = approxBytes(dataUrl);
    const overhead = originalBytes ? ((base64Len - originalBytes) / originalBytes * 100) : 0;
    stats.innerHTML =
      '<div class="stat"><div class="label">Original</div><div class="val">' + fmtBytes(originalBytes) + '</div></div>' +
      '<div class="stat"><div class="label">Data URL</div><div class="val">' + fmtBytes(base64Len) + '</div></div>' +
      '<div class="stat"><div class="label">Overhead</div><div class="val">' + (overhead >= 0 ? '+' : '') + overhead.toFixed(1) + '%</div></div>' +
      '<div class="stat"><div class="label">Dimensions</div><div class="val">' + currentWidth + '×' + currentHeight + '</div></div>';
    warnBig.style.display = base64Len > 100 * 1024 ? 'block' : 'none';
    void bytes;
    renderOutput();
  }

  function approxBytes(s) { return s.length; }

  function renderOutput() {
    const fmt = document.querySelector('input[name="outfmt"]:checked').value;
    let v = '';
    switch (fmt) {
      case 'data': v = currentDataUrl; break;
      case 'css': v = 'background-image: url("' + currentDataUrl + '");'; break;
      case 'html': v = '<img src="' + currentDataUrl + '" alt="">'; break;
      case 'cssvar': v = '--img: url("' + currentDataUrl + '");'; break;
      case 'json': v = JSON.stringify(currentDataUrl); break;
    }
    output.value = v;
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // Drop zone
  drop.addEventListener('click', () => file.click());
  file.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
  drop.addEventListener('drop', e => {
    e.preventDefault();
    drop.classList.remove('drag');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  // Paste
  window.addEventListener('paste', e => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const it of items) {
      if (it.type.startsWith('image/')) {
        handleFile(it.getAsFile());
        e.preventDefault();
        return;
      }
    }
  });

  document.querySelectorAll('input[name="fmt"]').forEach(r => r.addEventListener('change', applyReencode));
  document.querySelectorAll('input[name="outfmt"]').forEach(r => r.addEventListener('change', renderOutput));

  copyBtn.addEventListener('click', () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = orig; }, 1000);
    });
  });
  dlBtn.addEventListener('click', () => {
    if (!output.value) return;
    const blob = new Blob([output.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = origName + '-data-url.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Mode toggle
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.mode === 'encode') {
        encodePanel.style.display = ''; decodePanel.style.display = 'none';
      } else {
        encodePanel.style.display = 'none'; decodePanel.style.display = '';
      }
    });
  });

  // Decode mode
  decodeIn.addEventListener('input', () => {
    const v = decodeIn.value.trim();
    if (!v.startsWith('data:image/')) { decodeCard.style.display = 'none'; return; }
    const img = new Image();
    img.onload = () => {
      decodePreview.src = v;
      decodeCard.style.display = '';
      decodeInfo.innerHTML =
        '<div><strong>Dimensions:</strong> ' + img.width + ' × ' + img.height + ' px</div>' +
        '<div><strong>Data URL size:</strong> ' + fmtBytes(v.length) + '</div>';
    };
    img.onerror = () => { decodeCard.style.display = 'none'; };
    img.src = v;
  });
  decodeDl.addEventListener('click', () => {
    const v = decodeIn.value.trim();
    if (!v.startsWith('data:')) return;
    const m = v.match(/^data:([^;]+)/);
    const mime = m ? m[1] : 'image/png';
    const ext = mime.split('/')[1] || 'png';
    const a = document.createElement('a');
    a.href = v; a.download = 'decoded.' + ext;
    a.click();
  });
})();
