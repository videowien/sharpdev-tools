/**
 * PDF → Word (.docx)
 *
 * Approach:
 *   1. Use pdf.js to extract text + font sizes per item
 *   2. Cluster sizes to detect heading levels (same logic as pdf-to-md)
 *   3. Write a minimal valid .docx using JSZip
 *
 * .docx structure (OOXML):
 *   [Content_Types].xml
 *   _rels/.rels
 *   word/_rels/document.xml.rels
 *   word/document.xml
 *   word/styles.xml
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const resultCard = document.getElementById('result-card');
const fileInfo = document.getElementById('file-info');
const preview = document.getElementById('preview');
const statusMsg = document.getElementById('status-msg');

let pdfBytes = null;
let pdfName = '';
let blocks = []; // [{ type: 'h1' | 'h2' | 'h3' | 'p' | 'li', text }]

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  pdfBytes = null; pdfName = ''; blocks = [];
  resultCard.style.display = 'none';
  fileInput.value = '';
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  flash('Parsing PDF…', 'busy');
  try {
    const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;

    // Collect font sizes and items
    const allSizes = [];
    const pageItems = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const txt = await page.getTextContent();
      pageItems.push(txt.items);
      for (const it of txt.items) if (it.height) allSizes.push(it.height);
    }
    if (allSizes.length === 0) {
      flash('No text in PDF — try OCR first.', 'error');
      return;
    }
    const hist = new Map();
    for (const s of allSizes) { const r = Math.round(s * 10) / 10; hist.set(r, (hist.get(r) || 0) + 1); }
    let body = allSizes[0], maxC = 0;
    for (const [s, c] of hist) if (c > maxC) { maxC = c; body = s; }

    blocks = [];
    for (const items of pageItems) {
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
        let type = 'p';
        if (ratio >= 1.7) type = 'h1';
        else if (ratio >= 1.4) type = 'h2';
        else if (ratio >= 1.2) type = 'h3';
        // List detection
        if (/^([•·●○▪▫●◦*\-])\s+/.test(text)) {
          type = 'li';
        }
        const cleanText = type === 'li' ? text.replace(/^([•·●○▪▫●◦*\-])\s+/, '') : text;
        blocks.push({ type, text: cleanText });
      }
    }

    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${pdf.numPages} pages · ${blocks.length} text blocks (${blocks.filter(b => b.type === 'h1').length} H1, ${blocks.filter(b => b.type === 'h2').length} H2, ${blocks.filter(b => b.type === 'p').length} paragraphs)`;
    preview.textContent = blocks.slice(0, 30).map(b => {
      if (b.type === 'h1') return '# ' + b.text;
      if (b.type === 'h2') return '## ' + b.text;
      if (b.type === 'h3') return '### ' + b.text;
      if (b.type === 'li') return '- ' + b.text;
      return b.text;
    }).join('\n');
    resultCard.style.display = '';
    flash('✓ Ready', 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
}

document.getElementById('dl-btn').addEventListener('click', async () => {
  if (!blocks.length) return;
  flash('Building .docx…', 'busy');
  try {
    if (typeof JSZip === 'undefined') throw new Error('JSZip not loaded');
    const blob = await buildDocx(blocks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${pdfName}.docx`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flash('✓ Downloaded', 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
});

async function buildDocx(blocks) {
  const zip = new JSZip();

  // [Content_Types].xml
  zip.file('[Content_Types].xml',
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`);

  // _rels/.rels
  zip.folder('_rels').file('.rels',
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

  // word/_rels/document.xml.rels
  zip.folder('word').folder('_rels').file('document.xml.rels',
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`);

  // word/styles.xml
  zip.folder('word').file('styles.xml',
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:sz w:val="22"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:outlineLvl w:val="0"/><w:spacing w:before="240" w:after="120"/></w:pPr><w:rPr><w:b/><w:sz w:val="40"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:outlineLvl w:val="1"/><w:spacing w:before="200" w:after="100"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:outlineLvl w:val="2"/><w:spacing w:before="160" w:after="80"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr></w:style>
</w:styles>`);

  // Build word/document.xml
  const paras = blocks.map(b => {
    const t = xmlEscape(b.text);
    if (b.type === 'h1') return `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t xml:space="preserve">${t}</w:t></w:r></w:p>`;
    if (b.type === 'h2') return `<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t xml:space="preserve">${t}</w:t></w:r></w:p>`;
    if (b.type === 'h3') return `<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:t xml:space="preserve">${t}</w:t></w:r></w:p>`;
    if (b.type === 'li') return `<w:p><w:pPr><w:pStyle w:val="ListBullet"/></w:pPr><w:r><w:t xml:space="preserve">• ${t}</w:t></w:r></w:p>`;
    return `<w:p><w:r><w:t xml:space="preserve">${t}</w:t></w:r></w:p>`;
  }).join('\n  ');

  zip.folder('word').file('document.xml',
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
  ${paras}
  <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>
</w:body>
</w:document>`);

  return await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg' + (cls ? ' ' + cls : '');
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2500);
}
