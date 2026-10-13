/**
 * PDF to Text — SharpDev Tools
 * Extracts text from PDF files entirely in the browser using PDF.js.
 * No file upload to any server.
 */

// Import PDF.js
const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const uploadArea = document.getElementById('upload-area');
const uploadContent = document.getElementById('upload-content');
const fileInput = document.getElementById('file-input');
const progressArea = document.getElementById('progress-area');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const resultArea = document.getElementById('result-area');
const resultText = document.getElementById('result-text');
const fileNameEl = document.getElementById('file-name');
const pageCountEl = document.getElementById('page-count');
const wordCountEl = document.getElementById('word-count');
const copyMsg = document.getElementById('copy-msg');

let extractedText = '';
let currentFileName = '';

// Upload handlers
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) processFile(fileInput.files[0]);
});
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
});

async function processFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    alert('Please select a PDF file.');
    return;
  }

  currentFileName = file.name;
  resultArea.style.display = 'none';
  progressArea.style.display = 'block';
  uploadContent.style.display = 'none';
  progressBar.style.width = '0%';
  progressText.textContent = 'Loading PDF...';

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;

    progressText.textContent = `Extracting text from ${totalPages} page${totalPages !== 1 ? 's' : ''}...`;

    const pageTexts = [];

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      pageTexts.push(strings.join(' '));

      progressBar.style.width = ((i / totalPages) * 100) + '%';
      progressText.textContent = `Page ${i} of ${totalPages}...`;
    }

    extractedText = pageTexts.join('\n\n');

    if (!extractedText.trim()) {
      progressArea.style.display = 'none';
      uploadContent.style.display = 'block';
      alert('No text found in this PDF. It may contain scanned images instead of text. Try an OCR tool for scanned documents.');
      return;
    }

    // Show result
    progressArea.style.display = 'none';
    resultArea.style.display = 'block';
    fileNameEl.textContent = file.name;
    pageCountEl.textContent = `${totalPages} page${totalPages !== 1 ? 's' : ''}`;
    resultText.textContent = extractedText;

    const words = extractedText.trim().split(/\s+/).length;
    const chars = extractedText.length;
    wordCountEl.textContent = `${words.toLocaleString()} words \u2022 ${chars.toLocaleString()} characters`;

  } catch (e) {
    console.error(e);
    progressArea.style.display = 'none';
    uploadContent.style.display = 'block';
    alert('Failed to read this PDF. It may be encrypted or corrupted.');
  }
}

window.copyText = function() {
  if (!extractedText) return;
  navigator.clipboard.writeText(extractedText).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = extractedText;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
  copyMsg.textContent = 'Copied!';
  setTimeout(() => { copyMsg.textContent = ''; }, 2000);
};

window.downloadTxt = function() {
  if (!extractedText) return;
  const blob = new Blob([extractedText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = currentFileName.replace(/\.pdf$/i, '') + '.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

window.resetTool = function() {
  resultArea.style.display = 'none';
  progressArea.style.display = 'none';
  uploadContent.style.display = 'block';
  extractedText = '';
  currentFileName = '';
  fileInput.value = '';
};
