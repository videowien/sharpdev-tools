/**
 * HTML to PDF — SharpDev Tools
 * Sandboxed iframe renders user HTML; jsPDF + html2canvas captures it.
 * Fully client-side.
 */

const { jsPDF } = window.jspdf;

const htmlInput = document.getElementById('html-input');
const previewPane = document.getElementById('preview-pane');
const pageSize = document.getElementById('page-size');
const marginSel = document.getElementById('margin');
const downloadBtn = document.getElementById('download-btn');
const openBtn = document.getElementById('open-btn');
const sampleBtn = document.getElementById('sample-btn');
const fileInput = document.getElementById('file-input');
const statusMsg = document.getElementById('status-msg');

const SAMPLE = `<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #222; line-height: 1.5; }
  h1 { color: #c00; border-bottom: 2px solid #c00; padding-bottom: 6px; }
  .box { background: #f4f4f4; border-left: 4px solid #c00; padding: 10px 14px; margin: 14px 0; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
  th { background: #eee; }
</style>

<h1>Quarterly Report</h1>
<p>An example HTML document showing what this converter can do.</p>

<div class="box">
  <strong>Key takeaway:</strong> Revenue is up 23% quarter-over-quarter.
</div>

<h2>By region</h2>
<table>
  <thead>
    <tr><th>Region</th><th>Q1 Revenue</th><th>QoQ Change</th></tr>
  </thead>
  <tbody>
    <tr><td>EMEA</td><td>€420,000</td><td>+18%</td></tr>
    <tr><td>NA</td><td>$580,000</td><td>+27%</td></tr>
    <tr><td>APAC</td><td>$240,000</td><td>+12%</td></tr>
  </tbody>
</table>

<p style="color: #666; font-size: 11px;">Generated locally — never uploaded anywhere.</p>`;

function updatePreview() {
  const html = htmlInput.value;
  const doc = previewPane.contentDocument;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`);
  doc.close();
}

htmlInput.addEventListener('input', () => {
  clearTimeout(updatePreview._t);
  updatePreview._t = setTimeout(updatePreview, 150);
});

sampleBtn.addEventListener('click', () => {
  htmlInput.value = SAMPLE;
  updatePreview();
});

openBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  if (!fileInput.files.length) return;
  htmlInput.value = await fileInput.files[0].text();
  updatePreview();
  fileInput.value = '';
});

downloadBtn.addEventListener('click', async () => {
  if (!htmlInput.value.trim()) {
    alert('Paste some HTML first.');
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
    container.style.cssText = `
      position: fixed; left: -10000px; top: 0;
      width: ${pw - 2 * margin}px;
      padding: 0; background: #fff;
    `;
    container.innerHTML = htmlInput.value;
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

    pdf.save(`html-${new Date().toISOString().slice(0, 10)}.pdf`);
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

// Start with the sample
htmlInput.value = SAMPLE;
updatePreview();
