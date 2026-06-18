/**
 * Image Format Converter — SharpDev Tools
 * PNG / JPG / WebP via Canvas.
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const optionsCard = document.getElementById('options-card');
const infoStrip = document.getElementById('info-strip');
const qualityEl = document.getElementById('quality');
const qualityDisplay = document.getElementById('quality-display');
const qualityGroup = document.getElementById('quality-group');
const convertBtn = document.getElementById('convert-btn');
const statusMsg = document.getElementById('status-msg');

let sourceImg = null;
let sourceName = '';

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) loadFile(fileInput.files[0]);
});
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

async function loadFile(file) {
  if (!file.type.startsWith('image/')) { alert('Please pick an image file.'); return; }
  sourceName = file.name.replace(/\.[^.]+$/, '');
  const dataUrl = await readAsDataUrl(file);
  sourceImg = await loadImageElement(dataUrl);
  const sizeKb = Math.round(file.size / 1024);
  infoStrip.textContent =
    `${file.name} · ${file.type.replace('image/', '').toUpperCase()} · ${sourceImg.naturalWidth} × ${sourceImg.naturalHeight} · ${sizeKb} KB`;
  optionsCard.style.display = '';
}

function readAsDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
function loadImageElement(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

document.querySelectorAll('input[name="fmt"]').forEach((r) => {
  r.addEventListener('change', () => {
    const fmt = document.querySelector('input[name="fmt"]:checked').value;
    // Quality only matters for lossy formats
    qualityGroup.style.opacity = fmt === 'png' ? 0.4 : 1;
    qualityEl.disabled = fmt === 'png';
  });
});

qualityEl.addEventListener('input', () => { qualityDisplay.textContent = qualityEl.value; });

convertBtn.addEventListener('click', () => {
  if (!sourceImg) return;
  const fmt = document.querySelector('input[name="fmt"]:checked').value;
  const quality = parseInt(qualityEl.value, 10) / 100;
  const mime = 'image/' + fmt;
  const ext = fmt === 'jpeg' ? 'jpg' : fmt;

  const canvas = document.createElement('canvas');
  canvas.width = sourceImg.naturalWidth;
  canvas.height = sourceImg.naturalHeight;
  const ctx = canvas.getContext('2d');
  // For JPG: white background under image (no transparency support)
  if (fmt === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(sourceImg, 0, 0);

  canvas.toBlob((blob) => {
    if (!blob) {
      statusMsg.textContent = 'Conversion failed (browser may not support this format)';
      statusMsg.className = 'status-msg err';
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sourceName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    const sizeKb = Math.round(blob.size / 1024);
    statusMsg.textContent = `✓ ${ext.toUpperCase()} saved (${sizeKb} KB)`;
    statusMsg.className = 'status-msg ok';
  }, mime, fmt === 'png' ? undefined : quality);
});
