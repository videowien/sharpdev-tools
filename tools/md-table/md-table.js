(function(){
  const $ = id => document.getElementById(id);
  const editor = $('editor');

  let headers = ['Name','Age','City'];
  let aligns = ['left','left','left'];
  let rows = [
    ['Alex','32','Berlin'],
    ['Jess','30','Oslo'],
    ['Sam','34','Tokyo']
  ];
  let sortState = { col: -1, dir: 1 };

  function alignSymbol(a){
    if (a === 'center') return ':-:';
    if (a === 'right') return '--:';
    return ':--';
  }
  function cycleAlign(a){
    if (a === 'left') return 'center';
    if (a === 'center') return 'right';
    return 'left';
  }

  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function render(){
    let html = '<thead><tr>';
    headers.forEach((h, i) => {
      html += '<th><div class="th-wrap">' +
        '<span class="align-indicator" data-col="'+i+'" title="Cycle alignment">'+alignSymbol(aligns[i])+'</span>' +
        '<div contenteditable="true" data-row="-1" data-col="'+i+'">'+esc(h)+'</div>' +
        '<button class="sort-btn" data-sort="'+i+'" title="Sort">&#8645;</button>' +
        '</div></th>';
    });
    html += '</tr></thead><tbody>';
    rows.forEach((r, ri) => {
      html += '<tr>';
      for (let ci = 0; ci < headers.length; ci++) {
        html += '<td><div contenteditable="true" data-row="'+ri+'" data-col="'+ci+'">'+esc(r[ci]||'')+'</div></td>';
      }
      html += '</tr>';
    });
    html += '</tbody>';
    editor.innerHTML = html;
    wire();
    buildMD();
  }

  function wire(){
    editor.querySelectorAll('[contenteditable]').forEach(d => {
      d.addEventListener('input', () => {
        const r = parseInt(d.dataset.row), c = parseInt(d.dataset.col);
        const val = d.textContent;
        if (r === -1) headers[c] = val;
        else { if (!rows[r]) rows[r] = []; rows[r][c] = val; }
        buildMD();
      });
      d.addEventListener('keydown', e => {
        const r = parseInt(d.dataset.row), c = parseInt(d.dataset.col);
        if (e.key === 'Tab') {
          e.preventDefault();
          const dir = e.shiftKey ? -1 : 1;
          moveFocus(r, c, dir);
        } else if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (r >= 0 && r === rows.length - 1) {
            rows.push(new Array(headers.length).fill(''));
            render();
            setTimeout(() => focusCell(rows.length - 1, c), 0);
          } else if (r >= 0) {
            focusCell(r + 1, c);
          }
        }
      });
    });
    editor.querySelectorAll('.align-indicator').forEach(a => {
      a.addEventListener('click', e => {
        const c = parseInt(a.dataset.col);
        aligns[c] = cycleAlign(aligns[c]);
        render();
      });
    });
    editor.querySelectorAll('.sort-btn').forEach(b => {
      b.addEventListener('click', e => {
        const c = parseInt(b.dataset.sort);
        if (sortState.col === c) sortState.dir *= -1;
        else { sortState.col = c; sortState.dir = 1; }
        sortRows(c, sortState.dir);
        render();
      });
    });
  }

  function moveFocus(r, c, dir){
    let nr = r, nc = c + dir;
    if (nc >= headers.length) { nc = 0; nr = r + 1; }
    else if (nc < 0) { nc = headers.length - 1; nr = r - 1; }
    if (nr === -1 && dir > 0) nr = 0;
    if (nr < -1) nr = -1;
    if (nr >= rows.length) {
      rows.push(new Array(headers.length).fill(''));
      render();
    }
    focusCell(nr, nc);
  }
  function focusCell(r, c){
    const el = editor.querySelector('[data-row="'+r+'"][data-col="'+c+'"]');
    if (el) { el.focus();
      const range = document.createRange(); range.selectNodeContents(el); range.collapse(false);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
    }
  }

  function sortRows(col, dir){
    rows.sort((a,b) => {
      const av = a[col] || '', bv = b[col] || '';
      const an = parseFloat(av), bn = parseFloat(bv);
      if (!isNaN(an) && !isNaN(bn)) return (an - bn) * dir;
      return av.localeCompare(bv) * dir;
    });
  }

  function mdEscape(s){ return String(s||'').replace(/\|/g,'\\|').replace(/\n/g,' '); }

  function buildMD(){
    // column widths
    const cols = headers.length;
    const widths = [];
    for (let c = 0; c < cols; c++) {
      let w = String(headers[c]||'').length;
      rows.forEach(r => { w = Math.max(w, String(r[c]||'').length); });
      // min width for alignment marker
      const minA = alignSymbol(aligns[c]).length;
      w = Math.max(w, minA);
      widths.push(w);
    }
    function padCell(s, w, a){
      s = mdEscape(s);
      const d = w - s.length;
      if (d <= 0) return s;
      if (a === 'right') return ' '.repeat(d) + s;
      if (a === 'center') { const l = Math.floor(d/2); return ' '.repeat(l) + s + ' '.repeat(d - l); }
      return s + ' '.repeat(d);
    }
    function sepCell(w, a){
      if (a === 'center') return ':' + '-'.repeat(Math.max(1, w - 2)) + ':';
      if (a === 'right') return '-'.repeat(Math.max(1, w - 1)) + ':';
      return ':' + '-'.repeat(Math.max(1, w - 1));
    }
    let out = '| ' + headers.map((h,i) => padCell(h, widths[i], aligns[i])).join(' | ') + ' |\n';
    out += '| ' + widths.map((w,i) => sepCell(w, aligns[i])).join(' | ') + ' |\n';
    rows.forEach(r => {
      out += '| ' + headers.map((_,i) => padCell(r[i]||'', widths[i], aligns[i])).join(' | ') + ' |\n';
    });
    $('md-out').value = out;
  }

  // Buttons
  $('add-row').addEventListener('click', () => { rows.push(new Array(headers.length).fill('')); render(); });
  $('add-col').addEventListener('click', () => {
    headers.push('Column ' + (headers.length + 1));
    aligns.push('left');
    rows.forEach(r => r.push(''));
    render();
  });
  $('rm-row').addEventListener('click', () => { if (rows.length > 1) { rows.pop(); render(); } });
  $('rm-col').addEventListener('click', () => {
    if (headers.length > 1) {
      headers.pop(); aligns.pop();
      rows.forEach(r => r.pop());
      render();
    }
  });
  $('clear-btn').addEventListener('click', () => {
    headers = ['Column 1','Column 2','Column 3'];
    aligns = ['left','left','left'];
    rows = [['','',''],['','',''],['','','']];
    render();
  });

  $('copy-md').addEventListener('click', () => {
    navigator.clipboard.writeText($('md-out').value).then(() => {
      const b = $('copy-md'); b.classList.add('copied'); const o = b.textContent; b.textContent = 'Copied';
      setTimeout(()=>{b.textContent = o; b.classList.remove('copied');}, 1200);
    });
  });
  $('dl-md').addEventListener('click', () => download('table.md', $('md-out').value));
  $('dl-csv').addEventListener('click', () => {
    const esc = s => '"' + String(s||'').replace(/"/g,'""') + '"';
    const lines = [headers.map(esc).join(',')];
    rows.forEach(r => lines.push(headers.map((_,i) => esc(r[i]||'')).join(',')));
    download('table.csv', lines.join('\n'));
  });
  function download(name, content){
    const blob = new Blob([content], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  }

  // Import modal
  $('import-btn').addEventListener('click', () => { $('import-modal').style.display = 'flex'; $('import-txt').value = ''; $('import-txt').focus(); });
  $('import-cancel').addEventListener('click', () => $('import-modal').style.display = 'none');
  $('import-do').addEventListener('click', () => {
    const txt = $('import-txt').value.trim();
    if (!txt) return;
    // Try JSON
    try {
      const j = JSON.parse(txt);
      if (Array.isArray(j) && j.length > 0 && typeof j[0] === 'object') {
        const keys = [];
        j.forEach(o => Object.keys(o||{}).forEach(k => { if (!keys.includes(k)) keys.push(k); }));
        headers = keys;
        aligns = keys.map(()=>'left');
        rows = j.map(o => keys.map(k => o[k] == null ? '' : String(o[k])));
        $('import-modal').style.display = 'none'; render(); return;
      }
    } catch(e){}
    // CSV/TSV detect
    const firstLine = txt.split(/\r?\n/)[0] || '';
    const delim = firstLine.includes('\t') ? '\t' : (firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',');
    const parsed = parseDelim(txt, delim);
    if (parsed.length === 0) return;
    headers = parsed[0];
    aligns = headers.map(()=>'left');
    rows = parsed.slice(1).map(r => { while (r.length < headers.length) r.push(''); return r; });
    if (rows.length === 0) rows = [new Array(headers.length).fill('')];
    $('import-modal').style.display = 'none'; render();
  });

  function parseDelim(txt, d){
    const out = []; let row = []; let cur = ''; let inQ = false;
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      if (inQ) {
        if (c === '"' && txt[i+1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === d) { row.push(cur); cur = ''; }
        else if (c === '\n') { row.push(cur); out.push(row); row = []; cur = ''; }
        else if (c === '\r') { /* skip */ }
        else cur += c;
      }
    }
    if (cur !== '' || row.length) { row.push(cur); out.push(row); }
    return out;
  }

  render();
})();
