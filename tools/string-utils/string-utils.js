(function(){
  const $ = id => document.getElementById(id);
  const input = $('input'), output = $('output');
  const pills = document.querySelectorAll('.op-pill');
  const panels = document.querySelectorAll('.op-panel');
  let activeOp = 'repeat';

  const SAMPLE = "The quick brown fox\njumps over the lazy dog\nThe quick brown fox jumps again";
  input.value = SAMPLE;

  // Segmented buttons
  document.querySelectorAll('.seg').forEach(seg => {
    seg.addEventListener('click', e => {
      const b = e.target.closest('.seg-btn');
      if (!b) return;
      seg.querySelectorAll('.seg-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      run();
    });
  });

  pills.forEach(p => p.addEventListener('click', () => {
    pills.forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    activeOp = p.dataset.op;
    panels.forEach(pn => pn.classList.toggle('active', pn.dataset.panel === activeOp));
    run();
  }));

  document.querySelectorAll('input, textarea').forEach(el => {
    if (el.id === 'output') return;
    el.addEventListener('input', run);
    el.addEventListener('change', run);
  });

  // Substring mode label update
  const subMode = document.getElementById('sub-mode');
  subMode.addEventListener('click', () => {
    const v = subMode.querySelector('.seg-btn.active').dataset.v;
    $('sub-lbl').textContent = v === 'len' ? 'Length' : 'End index';
  });

  function getSeg(id){ return document.querySelector('#' + id + ' .seg-btn.active').dataset.v; }
  function unescapeStr(s){ return s.replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\r/g,'\r'); }

  function repeatOp(s){
    const n = Math.max(0, parseInt($('repeat-count').value) || 0);
    const sep = unescapeStr($('repeat-sep').value);
    if (n === 0) return '';
    return Array(n).fill(s).join(sep);
  }

  function padOp(s){
    const L = Math.max(0, parseInt($('pad-len').value) || 0);
    const ch = $('pad-char').value || ' ';
    const side = getSeg('pad-side');
    if (s.length >= L) return s;
    const diff = L - s.length;
    if (side === 'left') return ch.repeat(Math.ceil(diff/ch.length)).slice(0,diff) + s;
    if (side === 'right') return s + ch.repeat(Math.ceil(diff/ch.length)).slice(0,diff);
    const left = Math.floor(diff/2), right = diff - left;
    return ch.repeat(Math.ceil(left/ch.length)).slice(0,left) + s + ch.repeat(Math.ceil(right/ch.length)).slice(0,right);
  }

  function reverseOp(s){
    const u = getSeg('reverse-unit');
    if (u === 'chars') return [...s].reverse().join('');
    if (u === 'words') return s.split(/(\s+)/).reverse().join('');
    return s.split('\n').reverse().join('\n');
  }

  function replaceOp(s){
    const f = $('replace-find').value;
    if (!f) return s;
    const w = $('replace-with').value;
    const cs = $('replace-cs').checked;
    const rg = $('replace-regex').checked;
    const all = $('replace-all').checked;
    try {
      let re;
      if (rg) re = new RegExp(f, (cs?'':'i') + (all?'g':''));
      else re = new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), (cs?'':'i') + (all?'g':''));
      return s.replace(re, w);
    } catch(e){ return '[regex error] ' + e.message; }
  }

  function splitJoinOp(s){
    const sp = unescapeStr($('sj-split').value);
    const jo = unescapeStr($('sj-join').value);
    const trim = $('sj-trim').checked;
    const keep = $('sj-empty').checked;
    let parts = sp === '' ? [...s] : s.split(sp);
    if (trim) parts = parts.map(p => p.trim());
    if (!keep) parts = parts.filter(p => p !== '');
    return parts.join(jo);
  }

  function wrapOp(s){
    const pre = $('wrap-pre').value, suf = $('wrap-suf').value;
    const mode = getSeg('wrap-mode');
    if (mode === 'once') return pre + s + suf;
    return s.split('\n').map(l => pre + l + suf).join('\n');
  }

  function truncOp(s){
    const L = Math.max(0, parseInt($('trunc-len').value) || 0);
    const ell = $('trunc-ell').value;
    const word = $('trunc-word').checked;
    if (s.length <= L) return s;
    let cut = s.slice(0, L);
    if (word) {
      const sp = cut.lastIndexOf(' ');
      if (sp > 0) cut = cut.slice(0, sp);
    }
    return cut + ell;
  }

  function countOp(s){
    const term = $('count-term').value;
    const box = $('count-results');
    if (!term) { box.innerHTML = '<span class="muted">Enter a search term to see count.</span>'; return s; }
    const cs = $('count-cs').checked, rg = $('count-regex').checked;
    try {
      let re;
      if (rg) re = new RegExp(term, 'g' + (cs?'':'i'));
      else re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'g' + (cs?'':'i'));
      const m = s.match(re) || [];
      const count = m.length;
      const pct = s.length ? ((m.join('').length / s.length) * 100).toFixed(2) : '0';
      box.innerHTML = '<strong>' + count + '</strong> occurrence' + (count===1?'':'s') +
        ' &middot; <span class="muted">' + pct + '% of input by character length</span>';
    } catch(e){ box.innerHTML = '<span class="muted">Regex error: ' + e.message + '</span>'; }
    return s;
  }

  function subOp(s){
    const st = parseInt($('sub-start').value) || 0;
    const v = parseInt($('sub-len').value) || 0;
    const mode = getSeg('sub-mode');
    if (mode === 'len') return s.substr(st < 0 ? Math.max(0, s.length + st) : st, v);
    return s.substring(st, v);
  }

  function run(){
    const s = input.value;
    let out = s;
    switch(activeOp){
      case 'repeat': out = repeatOp(s); break;
      case 'pad': out = padOp(s); break;
      case 'reverse': out = reverseOp(s); break;
      case 'replace': out = replaceOp(s); break;
      case 'splitjoin': out = splitJoinOp(s); break;
      case 'wrap': out = wrapOp(s); break;
      case 'truncate': out = truncOp(s); break;
      case 'count': out = countOp(s); break;
      case 'substring': out = subOp(s); break;
    }
    output.value = out;
    $('stats-in').textContent = s.length + ' chars · ' + s.split('\n').length + ' lines';
    $('stats-out').textContent = out.length + ' chars · ' + out.split('\n').length + ' lines';
  }

  $('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(output.value).then(() => {
      const b = $('copy-btn'); b.textContent = 'Copied'; b.classList.add('copied');
      setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('copied'); }, 1200);
    });
  });
  $('use-btn').addEventListener('click', () => { input.value = output.value; run(); });

  run();
})();
