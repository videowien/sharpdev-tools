/**
 * Markdown to PDF — SharpDev Tools
 * marked parses MD → HTML; jsPDF + html2canvas capture the rendered
 * preview into a paginated PDF. All client-side, no upload.
 */

const { jsPDF } = window.jspdf;

const mdInput = document.getElementById('md-input');
const previewPane = document.getElementById('preview-pane');
const pageSize = document.getElementById('page-size');
const marginSel = document.getElementById('margin');
const downloadBtn = document.getElementById('download-btn');
const openBtn = document.getElementById('open-btn');
const sampleBtn = document.getElementById('sample-btn');
const fileInput = document.getElementById('file-input');
const statusMsg = document.getElementById('status-msg');

const SAMPLE = `# My Document

A short paragraph showing how **Markdown to PDF** renders. *Italic* and ~~strikethrough~~ also work.

## Lists

- First item
- Second item
- Nested:
  - sub-item one
  - sub-item two

## Code

Inline \`example\` and a fenced block:

\`\`\`js
function hello(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table

| Tool | Use case |
|---|---|
| Markdown to PDF | Notes, reports, READMEs |
| PDF Merge | Combining multi-source docs |
| PDF Split | Extracting specific pages |

## Quote

> Anything worth doing is worth doing well.

[Link to SharpDev.tools](https://sharpdev.tools)
`;

// Live preview
function render() {
  const md = mdInput.value;
  previewPane.innerHTML = marked.parse(md, { breaks: true, gfm: true });
}
mdInput.addEventListener('input', () => {
  clearTimeout(render._t);
  render._t = setTimeout(render, 120);
});

sampleBtn.addEventListener('click', () => {
  mdInput.value = SAMPLE;
  render();
});

openBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  if (!fileInput.files.length) return;
  const file = fileInput.files[0];
  mdInput.value = await file.text();
  render();
  fileInput.value = '';
});

downloadBtn.addEventListener('click', async () => {
  if (!mdInput.value.trim()) {
    alert('Add some Markdown first.');
    return;
  }
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Building PDF...';
  statusMsg.textContent = '';
  statusMsg.className = 'status-msg';

  try {
    const size = pageSize.value;
    const margin = parseInt(marginSel.value, 10);
    const pdf = new jsPDF({ unit: 'pt', format: size, orientation: 'portrait' });
    const pw = pdf.internal.pageSize.getWidth();

    // Build an offscreen render container we control fully
    const container = document.createElement('div');
    container.className = 'pdf-render-host';
    container.innerHTML = previewPane.innerHTML;
    container.style.cssText = `
      position: fixed; left: -10000px; top: 0;
      width: ${pw - 2 * margin}px;
      padding: 0; background: #fff; color: #111;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12pt; line-height: 1.55;
    `;
    document.body.appendChild(container);

    await pdf.html(container, {
      x: margin,
      y: margin,
      margin: [margin, margin, margin, margin],
      width: pw - 2 * margin,
      windowWidth: pw - 2 * margin,
      autoPaging: 'text',
      html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true },
    });

    document.body.removeChild(container);

    pdf.save(`markdown-${new Date().toISOString().slice(0, 10)}.pdf`);
    statusMsg.textContent = '✓ PDF saved';
    statusMsg.className = 'status-msg ok';
  } catch (e) {
    statusMsg.textContent = 'Error: ' + (e.message || e);
    statusMsg.className = 'status-msg err';
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download PDF';
  }
});

// Start with the sample so the page isn't empty
mdInput.value = SAMPLE;
render();
