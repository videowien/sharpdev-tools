/**
 * PDF Insert — insert one PDF into another at a specific position
 */

const statusMsg = document.getElementById('status-msg');
const editorCard = document.getElementById('editor-card');
const positionEl = document.getElementById('position');
const positionHint = document.getElementById('position-hint');
const rangeEl = document.getElementById('range');

const state = { base: null, insert: null };

setupSlot('base');
setupSlot('insert');

function setupSlot(name) {
  const input = document.getElementById('file-' + name);
  const area = document.querySelector(`[data-target="${name}"]`);
  const info = document.getElementById('info-' + name);
  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', (e) => {
    e.preventDefault(); area.classList.remove('dragover');
    if (e.dataTransfer.files.length) handle(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files.length) handle(input.files[0]); });

  async function handle(file) {
    if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Pick a PDF.', 'error'); return; }
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFLib.PDFDocument.load(bytes);
      state[name] = { bytes, name: file.name.replace(/\.pdf$/i, ''), pageCount: doc.getPageCount(), size: file.size };
      area.classList.add('loaded');
      info.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${doc.getPageCount()} pages`;
      checkReady();
    } catch (err) {
      flash('Failed to read ' + name + ': ' + err.message, 'error');
    }
  }
}

function checkReady() {
  if (state.base && state.insert) {
    editorCard.style.display = '';
    const max = state.base.pageCount;
    positionEl.max = max;
    if (parseInt(positionEl.value, 10) > max) positionEl.value = max;
    updateHint();
  }
}
positionEl.addEventListener('input', updateHint);
function updateHint() {
  const pos = parseInt(positionEl.value, 10) || 0;
  const total = state.base ? state.base.pageCount : 0;
  if (pos === 0) positionHint.textContent = '(at the very beginning)';
  else if (pos >= total) positionHint.textContent = '(at the very end — same as Merge)';
  else positionHint.textContent = `(after page ${pos}, before page ${pos + 1})`;
}

function parseRange(str, totalPages) {
  str = (str || '').trim();
  if (!str) return Array.from({ length: totalPages }, (_, i) => i);
  const out = new Set();
  for (const part of str.split(',')) {
    const trimmed = part.trim();
    const m = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const a = parseInt(m[1], 10), b = parseInt(m[2], 10);
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
        if (i >= 1 && i <= totalPages) out.add(i - 1);
      }
    } else {
      const n = parseInt(trimmed, 10);
      if (n >= 1 && n <= totalPages) out.add(n - 1);
    }
  }
  return [...out].sort((a, b) => a - b);
}

document.getElementById('insert-btn').addEventListener('click', async () => {
  if (!state.base || !state.insert) { flash('Pick both PDFs first.', 'error'); return; }
  const position = Math.max(0, Math.min(state.base.pageCount, parseInt(positionEl.value, 10) || 0));
  const rangeIndices = parseRange(rangeEl.value, state.insert.pageCount);
  if (rangeIndices.length === 0) { flash('Page range matches no pages.', 'error'); return; }

  flash('Inserting…', 'busy');
  try {
    const base = await PDFLib.PDFDocument.load(state.base.bytes);
    const insert = await PDFLib.PDFDocument.load(state.insert.bytes);

    // Build new PDF: pages 0..position from base, then range from insert, then position..end from base
    const out = await PDFLib.PDFDocument.create();
    const basePages = await out.copyPages(base, Array.from({ length: state.base.pageCount }, (_, i) => i));
    const insertPages = await out.copyPages(insert, rangeIndices);

    for (let i = 0; i < position; i++) out.addPage(basePages[i]);
    for (const p of insertPages) out.addPage(p);
    for (let i = position; i < basePages.length; i++) out.addPage(basePages[i]);

    const bytes = await out.save();
    download(bytes, `${state.base.name}-with-${state.insert.name}.pdf`);
    flash(`✓ Inserted ${rangeIndices.length} pages at position ${position}`, 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
});

document.getElementById('reset-btn').addEventListener('click', () => {
  state.base = null; state.insert = null;
  ['base', 'insert'].forEach(n => {
    document.getElementById('file-' + n).value = '';
    document.querySelector(`[data-target="${n}"]`).classList.remove('loaded');
    document.getElementById('info-' + n).textContent = '';
  });
  editorCard.style.display = 'none';
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
  if (cls === 'ok' || cls === 'error') setTimeout(() => { statusMsg.textContent = ''; }, 2500);
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
