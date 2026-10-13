/**
 * PDF → Markdown — pdf.js + heading detection via font-size clustering
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const resultCard = document.getElementById('result-card');
const output = document.getElementById('output');
const statusMsg = document.getElementById('status-msg');
const detectBold = document.getElementById('detect-bold');
const detectLists = document.getElementById('detect-lists');

let pdfBytes = null;
let pdfName = '';
let lastRender = '';

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; pdfName = '';
  resultCard.style.display = 'none';
  fileInput.value = '';
});

[detectBold, detectLists].forEach(el => el.addEventListener('change', () => { if (pdfBytes) convert(); }));

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  resultCard.style.display = '';
  await convert();
}

async function convert() {
  flash('Converting…', 'busy');
  try {
    const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;

    // First pass — collect all font sizes to find body-text mode
    const allSizes = [];
    const pageItems = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const txt = await page.getTextContent();
      pageItems.push(txt.items);
      for (const it of txt.items) {
        if (it.height) allSizes.push(it.height);
      }
    }

    if (allSizes.length === 0) {
      output.value = '(No text found — this PDF may be image-only. Try the OCR tool.)';
      flash('', '');
      return;
    }

    // Find the most common (modal) font size = body text
    const histogram = new Map();
    for (const s of allSizes) {
      const rounded = Math.round(s * 10) / 10;
      histogram.set(rounded, (histogram.get(rounded) || 0) + 1);
    }
    let bodySize = allSizes[0], maxCount = 0;
    for (const [s, c] of histogram) if (c > maxCount) { maxCount = c; bodySize = s; }

    let md = '';
    let prevY = null;
    let prevSize = null;
    let listMode = false;
    for (let p = 0; p < pageItems.length; p++) {
      const items = pageItems[p];
      // Group items by line (Y-coordinate proximity)
      const lines = [];
      let currentLine = [];
      let currentY = null;
      for (const it of items) {
        if (!it.str) continue;
        const y = Math.round(it.transform[5]);
        if (currentY === null || Math.abs(y - currentY) < 2) {
          currentLine.push(it);
          currentY = y;
        } else {
          if (currentLine.length) lines.push({ y: currentY, items: currentLine });
          currentLine = [it]; currentY = y;
        }
      }
      if (currentLine.length) lines.push({ y: currentY, items: currentLine });

      // Sort by Y descending (PDF Y is bottom-origin)
      lines.sort((a, b) => b.y - a.y);

      for (const line of lines) {
        // Sort items within line by X
        line.items.sort((a, b) => a.transform[4] - b.transform[4]);
        const text = line.items.map(i => i.str).join('').replace(/\s+/g, ' ').trim();
        if (!text) continue;
        const sizes = line.items.map(i => i.height || bodySize);
        const maxSize = Math.max(...sizes);
        const ratio = maxSize / bodySize;

        // Detect bullet-list line
        const isBullet = detectLists.checked && /^([•·●○▪▫●◦*\-])\s+/.test(text);
        // Detect heading by size ratio
        let prefix = '';
        if (ratio >= 1.7) prefix = '# ';
        else if (ratio >= 1.4) prefix = '## ';
        else if (ratio >= 1.2) prefix = '### ';
        else if (ratio >= 1.1) prefix = '#### ';

        let line_out = text;
        if (isBullet) {
          line_out = '- ' + text.replace(/^([•·●○▪▫●◦*\-])\s+/, '');
        }

        // Detect bold via font name (heuristic)
        if (detectBold.checked && !prefix) {
          const allBold = line.items.every(i => /bold|black|heavy/i.test(i.fontName || ''));
          if (allBold && line.items.length === 1) line_out = `**${line_out}**`;
        }

        // Add blank line between paragraphs/sections
        if (prefix) md += '\n' + prefix + line_out + '\n';
        else if (isBullet) md += line_out + '\n';
        else md += line_out + '\n';
      }
      md += '\n'; // page break = blank line
    }

    // Cleanup: collapse 3+ blank lines into 2
    md = md.replace(/\n{3,}/g, '\n\n').trim();
    lastRender = md;
    output.value = md;
    flash('✓ Done', 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
}

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.value);
  flash('✓ Copied', 'ok');
});
document.getElementById('dl-btn').addEventListener('click', () => {
  const blob = new Blob([output.value], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${pdfName}.md`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2200);
}
