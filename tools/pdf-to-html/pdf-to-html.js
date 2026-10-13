/**
 * PDF → HTML — pdf.js, two output modes
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const resultCard = document.getElementById('result-card');
const output = document.getElementById('output');
const statusMsg = document.getElementById('status-msg');
const wrapFull = document.getElementById('wrap-full');

let pdfBytes = null;
let pdfName = '';
let mode = 'semantic';

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-mode]').forEach(x => x.classList.remove('active'));
  b.classList.add('active'); mode = b.dataset.mode;
  if (pdfBytes) convert();
}));
wrapFull.addEventListener('change', () => { if (pdfBytes) convert(); });

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; pdfName = '';
  resultCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  resultCard.style.display = '';
  await convert();
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

async function convert() {
  flash('Converting…', 'busy');
  try {
    const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;

    let body = '';
    if (mode === 'semantic') {
      body = await semantic(pdf);
    } else {
      body = await positioned(pdf);
    }

    if (wrapFull.checked) {
      output.value = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${esc(pdfName)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 720px; margin: 40px auto; padding: 0 16px; line-height: 1.6; color: #222; }
  h1, h2, h3 { margin-top: 1.5em; }
  p { margin: 0.6em 0; }
  ${mode === 'positioned' ? '.pdf-page { position: relative; background: #fff; border: 1px solid #ddd; margin: 16px auto; } .pdf-page > div { position: absolute; white-space: nowrap; }' : ''}
</style>
</head>
<body>
${body}
</body>
</html>`;
    } else {
      output.value = body;
    }
    flash('✓ Done', 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
}

async function semantic(pdf) {
  const sizes = [];
  const allItems = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const txt = await page.getTextContent();
    allItems.push(txt.items);
    for (const it of txt.items) if (it.height) sizes.push(it.height);
  }
  if (sizes.length === 0) return '<p>(no text found)</p>';
  const hist = new Map();
  for (const s of sizes) { const r = Math.round(s * 10) / 10; hist.set(r, (hist.get(r) || 0) + 1); }
  let body = sizes[0], max = 0;
  for (const [s, c] of hist) if (c > max) { max = c; body = s; }

  let html = '';
  for (const items of allItems) {
    // Group by line
    const lines = [];
    let cur = [], curY = null;
    for (const it of items) {
      if (!it.str) continue;
      const y = Math.round(it.transform[5]);
      if (curY === null || Math.abs(y - curY) < 2) { cur.push(it); curY = y; }
      else { if (cur.length) lines.push({ y: curY, items: cur }); cur = [it]; curY = y; }
    }
    if (cur.length) lines.push({ y: curY, items: cur });
    lines.sort((a, b) => b.y - a.y);
    for (const line of lines) {
      line.items.sort((a, b) => a.transform[4] - b.transform[4]);
      const text = line.items.map(i => i.str).join('').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      const maxSize = Math.max(...line.items.map(i => i.height || body));
      const ratio = maxSize / body;
      let tag = 'p';
      if (ratio >= 1.7) tag = 'h1';
      else if (ratio >= 1.4) tag = 'h2';
      else if (ratio >= 1.2) tag = 'h3';
      html += `<${tag}>${esc(text)}</${tag}>\n`;
    }
    html += '\n';
  }
  return html.trim();
}

async function positioned(pdf) {
  let html = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    const txt = await page.getTextContent();
    html += `<div class="pdf-page" style="width:${vp.width}px;height:${vp.height}px">\n`;
    for (const it of txt.items) {
      if (!it.str || !it.str.trim()) continue;
      const x = it.transform[4];
      const y = vp.height - it.transform[5] - (it.height || 12);
      const size = it.height || 12;
      const safe = esc(it.str);
      html += `  <div style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;font-size:${size.toFixed(1)}px">${safe}</div>\n`;
    }
    html += '</div>\n';
  }
  return html;
}

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.value);
  flash('✓ Copied', 'ok');
});
document.getElementById('dl-btn').addEventListener('click', () => {
  const blob = new Blob([output.value], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${pdfName}.html`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2200);
}
