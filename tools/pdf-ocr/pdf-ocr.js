/**
 * PDF OCR — render each page as image, OCR with Tesseract, build searchable PDF
 *
 * Strategy:
 *   1. Render each PDF page to canvas via pdf.js
 *   2. Tesseract.recognize on the canvas — returns words with bounding boxes
 *   3. Build a new PDF: draw the rasterized image, then add invisible white text
 *      positioned at each word's bbox. Searchable + visually identical.
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const langEl = document.getElementById('lang');
const dpiEl = document.getElementById('dpi');
const progressLabel = document.getElementById('progress-label');
const progressFill = document.getElementById('progress-fill');
const statusMsg = document.getElementById('status-msg');

let pdfBytes = null;
let pdfName = '';
let pageCount = 0;

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
  editorCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    pageCount = doc.getPageCount();
    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${pageCount} pages · ${(file.size / 1024).toFixed(1)} KB`;
    editorCard.style.display = '';
    progressLabel.textContent = 'Ready to start OCR — click the button below';
    progressFill.style.width = '0%';
  } catch (err) {
    flash('Could not read PDF: ' + err.message, 'error');
  }
}

document.getElementById('ocr-btn').addEventListener('click', async () => {
  if (!pdfBytes) return;
  const lang = langEl.value;
  const dpi = parseInt(dpiEl.value, 10);
  const renderScale = dpi / 72;

  flash('Initializing…', 'busy');
  progressLabel.textContent = 'Loading PDF.js + Tesseract…';
  progressFill.style.width = '0%';

  try {
    const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

    const pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;
    const out = await PDFLib.PDFDocument.create();
    const helv = await out.embedFont(PDFLib.StandardFonts.Helvetica);

    progressLabel.textContent = 'Loading Tesseract worker + language data (first run may take ~30s)…';
    const worker = await Tesseract.createWorker(lang, 1, {
      logger: (m) => {
        // Worker progress events — ignore "recognizing text" inner progress
      },
    });

    for (let i = 1; i <= pdf.numPages; i++) {
      const overallPct = ((i - 1) / pdf.numPages) * 100;
      progressLabel.textContent = `Rendering + OCR page ${i} of ${pdf.numPages}…`;
      progressFill.style.width = overallPct.toFixed(0) + '%';

      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale: renderScale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;

      // OCR with bounding boxes
      const result = await worker.recognize(canvas, {}, { blocks: false });
      // Tesseract v5 returns words with bbox in pixel coords of the input image
      const words = (result.data.words || []);

      // Convert canvas → JPEG → embed in out PDF
      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.85));
      const jpgBytes = new Uint8Array(await blob.arrayBuffer());
      const img = await out.embedJpg(jpgBytes);

      // New page at original PDF size (72 DPI)
      const ptSize = page.getViewport({ scale: 1 });
      const newPage = out.addPage([ptSize.width, ptSize.height]);
      newPage.drawImage(img, { x: 0, y: 0, width: ptSize.width, height: ptSize.height });

      // Draw invisible text behind image (well, on top with opacity 0)
      // Actually pdf-lib doesn't support text rendering mode directly. Use opacity 0.
      for (const w of words) {
        if (!w.text || !w.bbox) continue;
        const word = w.text.trim();
        if (!word) continue;
        const conf = w.confidence || 0;
        if (conf < 30) continue; // skip very low confidence
        const { x0, y0, x1, y1 } = w.bbox;
        // bbox is in pixels of the rendered canvas. Convert to PDF points.
        const xPdf = (x0 / canvas.width) * ptSize.width;
        const yPdfTop = (y0 / canvas.height) * ptSize.height;
        const wPx = (x1 - x0) / canvas.width * ptSize.width;
        const hPx = (y1 - y0) / canvas.height * ptSize.height;
        // PDF Y origin is bottom — convert
        const yPdf = ptSize.height - yPdfTop - hPx;
        // Font size to match height
        const fontSize = Math.max(4, hPx);
        try {
          newPage.drawText(word, {
            x: xPdf, y: yPdf,
            size: fontSize,
            font: helv,
            color: PDFLib.rgb(1, 1, 1),
            opacity: 0,
          });
        } catch (e) {
          // Skip words that can't be drawn (e.g. unsupported chars)
        }
      }
    }

    await worker.terminate();

    progressLabel.textContent = 'Writing searchable PDF…';
    const bytes = await out.save();
    download(bytes, `${pdfName}-searchable.pdf`);
    progressFill.style.width = '100%';
    progressLabel.textContent = `✓ Done — ${pdf.numPages} page${pdf.numPages === 1 ? '' : 's'} OCR'd`;
    flash('✓ Done', 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
    progressLabel.textContent = 'Failed: ' + err.message;
  }
});

function download(bytes, name) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 3000);
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
