/**
 * PDF Form Fill — iterate AcroForm fields, build UI, save
 */

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const editorCard = document.getElementById('editor-card');
const fileInfo = document.getElementById('file-info');
const fieldsEl = document.getElementById('fields');
const statusMsg = document.getElementById('status-msg');

let pdfBytes = null;
let pdfName = '';
// fieldValues: Map<fieldName, value> — text strings, booleans (checkbox), strings (radio/dropdown), arrays (optionlist)
let fieldValues = new Map();
let fieldMeta = []; // [{ name, type, options? }]

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
  fieldValues = new Map(); fieldMeta = [];
});

async function loadFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { flash('Please pick a PDF.', 'error'); return; }
  pdfBytes = new Uint8Array(await file.arrayBuffer());
  pdfName = file.name.replace(/\.pdf$/i, '');
  fieldValues = new Map(); fieldMeta = [];

  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = doc.getForm();
    const fields = form.getFields();
    if (fields.length === 0) {
      fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · <span style="color:#ffa726">⚠ No form fields detected.</span>`;
      editorCard.style.display = '';
      fieldsEl.innerHTML = '<p style="color:#888;font-size:13px">This PDF has no fillable AcroForm fields. Use the PDF Sign tool to overlay text or signature images at any position.</p>';
      return;
    }
    fileInfo.innerHTML = `<span class="filename">${escapeHtml(file.name)}</span> · ${doc.getPageCount()} pages · ${fields.length} field${fields.length === 1 ? '' : 's'}`;

    fieldsEl.innerHTML = '';
    for (const f of fields) {
      const name = f.getName();
      const klass = f.constructor.name;
      let typeName = klass.replace('PDF', '');
      let initial;
      let options;
      try {
        if (klass === 'PDFTextField') { initial = f.getText() || ''; }
        else if (klass === 'PDFCheckBox') { initial = f.isChecked(); }
        else if (klass === 'PDFDropdown') { options = f.getOptions(); initial = (f.getSelected() || [''])[0]; }
        else if (klass === 'PDFRadioGroup') { options = f.getOptions(); initial = f.getSelected() || ''; }
        else if (klass === 'PDFOptionList') { options = f.getOptions(); initial = f.getSelected() || []; }
      } catch (_) { initial = ''; }
      fieldMeta.push({ name, type: klass, options });
      fieldValues.set(name, initial);

      const div = document.createElement('div');
      div.className = 'field';
      div.innerHTML = `<div class="field-label">${escapeHtml(name)} <span class="field-type">${typeName}</span></div>`;
      if (klass === 'PDFTextField') {
        const inp = document.createElement('input');
        inp.type = 'text'; inp.value = initial;
        inp.addEventListener('input', () => { fieldValues.set(name, inp.value); });
        div.appendChild(inp);
      } else if (klass === 'PDFCheckBox') {
        const row = document.createElement('div'); row.className = 'check-row';
        const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!initial;
        cb.addEventListener('change', () => { fieldValues.set(name, cb.checked); });
        const label = document.createElement('label'); label.textContent = 'Checked'; label.style.cursor = 'pointer'; label.style.fontSize = '13px'; label.style.color = '#ccc';
        label.prepend(cb);
        row.appendChild(label);
        div.appendChild(row);
      } else if (klass === 'PDFDropdown') {
        const sel = document.createElement('select');
        for (const o of options) {
          const opt = document.createElement('option');
          opt.value = o; opt.textContent = o;
          if (o === initial) opt.selected = true;
          sel.appendChild(opt);
        }
        sel.addEventListener('change', () => { fieldValues.set(name, sel.value); });
        div.appendChild(sel);
      } else if (klass === 'PDFRadioGroup') {
        const row = document.createElement('div'); row.className = 'radio-row';
        for (const o of options) {
          const lbl = document.createElement('label');
          const rb = document.createElement('input'); rb.type = 'radio'; rb.name = name; rb.value = o; if (o === initial) rb.checked = true;
          rb.addEventListener('change', () => { if (rb.checked) fieldValues.set(name, o); });
          lbl.appendChild(rb); lbl.appendChild(document.createTextNode(' ' + o));
          row.appendChild(lbl);
        }
        div.appendChild(row);
      } else if (klass === 'PDFOptionList') {
        const sel = document.createElement('select'); sel.multiple = true; sel.size = Math.min(6, options.length);
        for (const o of options) {
          const opt = document.createElement('option'); opt.value = o; opt.textContent = o;
          if (Array.isArray(initial) && initial.includes(o)) opt.selected = true;
          sel.appendChild(opt);
        }
        sel.addEventListener('change', () => { fieldValues.set(name, [...sel.selectedOptions].map(o => o.value)); });
        div.appendChild(sel);
      } else {
        const note = document.createElement('div'); note.className = 'empty-note';
        note.textContent = `(${typeName} not editable in this tool)`;
        div.appendChild(note);
      }
      fieldsEl.appendChild(div);
    }
    editorCard.style.display = '';
  } catch (err) {
    flash('Could not read form: ' + err.message, 'error');
  }
}

async function buildAndSave(flatten) {
  if (!pdfBytes) return;
  flash('Saving…', 'busy');
  try {
    const doc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = doc.getForm();
    for (const meta of fieldMeta) {
      const v = fieldValues.get(meta.name);
      try {
        if (meta.type === 'PDFTextField') form.getTextField(meta.name).setText(String(v ?? ''));
        else if (meta.type === 'PDFCheckBox') v ? form.getCheckBox(meta.name).check() : form.getCheckBox(meta.name).uncheck();
        else if (meta.type === 'PDFDropdown' && v) form.getDropdown(meta.name).select(v);
        else if (meta.type === 'PDFRadioGroup' && v) form.getRadioGroup(meta.name).select(v);
        else if (meta.type === 'PDFOptionList' && Array.isArray(v) && v.length) form.getOptionList(meta.name).select(v);
      } catch (e) { /* skip field if setter fails */ }
    }
    if (flatten) form.flatten();
    const out = await doc.save();
    download(out, `${pdfName}${flatten ? '-filled-flattened' : '-filled'}.pdf`);
    flash(`✓ Downloaded`, 'ok');
  } catch (err) {
    flash('Failed: ' + err.message, 'error');
  }
}

document.getElementById('save-btn').addEventListener('click', () => buildAndSave(false));
document.getElementById('save-flat-btn').addEventListener('click', () => buildAndSave(true));

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
