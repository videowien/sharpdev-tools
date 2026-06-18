/** CSS Minifier & Beautifier */
const inEl = document.getElementById('in');
const outEl = document.getElementById('out');
const minifyBtn = document.getElementById('minify-btn');
const beautifyBtn = document.getElementById('beautify-btn');
const copyBtn = document.getElementById('copy-btn');
const sizeLabel = document.getElementById('size-label');

function minifyCss(src) {
  src = src.replace(/\/\*[\s\S]*?\*\//g, '');          // comments
  src = src.replace(/\s*([{}:;,>+~])\s*/g, '$1');       // whitespace around structural
  src = src.replace(/;}/g, '}');                         // trailing semicolon before }
  src = src.replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/gm, '').replace(/\n/g, '');
  return src.trim();
}

function beautifyCss(src) {
  // Prefer the battle-tested js-beautify CSS formatter (loaded from cdnjs).
  // Handles media queries, nesting, selectors and at-rules correctly.
  if (window.css_beautify) {
    return window.css_beautify(src, {
      indent_size: 2,
      selector_separator_newline: true,
      newline_between_rules: true,
    });
  }
  // Fallback: lightweight hand-rolled beautifier (used only if the CDN fails).
  // Stash comments by index so we don't lose them during whitespace collapse.
  // Using btoa would crash on non-Latin1 chars (emoji, CJK, accented), so
  // we just use an indexed placeholder.
  const comments = [];
  src = src.replace(/\/\*[\s\S]*?\*\//g, m => {
    comments.push(m);
    return '\u0001' + (comments.length - 1) + '\u0001';
  });
  src = src.replace(/\s+/g, ' ').trim();
  let out = '';
  let depth = 0;
  const indent = '  ';
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') {
      out = out.replace(/\s+$/, '') + ' {\n';
      depth++;
      out += indent.repeat(depth);
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1);
      out = out.replace(/\s+$/, '') + '\n' + indent.repeat(depth) + '}\n' + indent.repeat(depth);
    } else if (ch === ';') {
      out += ';\n' + indent.repeat(depth);
    } else if (ch === ',' && depth === 0) {
      out += ',\n' + indent.repeat(depth);
    } else {
      out += ch;
    }
  }
  out = out.replace(/\n{3,}/g, '\n\n').replace(/^\s+|\s+$/g, '');
  out = out.replace(/\u0001(\d+)\u0001/g, (_, i) => comments[+i]);
  return out;
}

function updateSize(before, after) {
  const delta = before - after;
  const pct = before > 0 ? (delta / before * 100).toFixed(1) : 0;
  sizeLabel.innerHTML = `<span>${before.toLocaleString()} → ${after.toLocaleString()} bytes</span> &nbsp;<span class="delta">${delta >= 0 ? '−' : '+'}${Math.abs(pct)}%</span>`;
}

minifyBtn.addEventListener('click', () => {
  const src = inEl.value;
  const out = minifyCss(src);
  outEl.value = out;
  updateSize(src.length, out.length);
});
beautifyBtn.addEventListener('click', () => {
  const src = inEl.value;
  const out = beautifyCss(src);
  outEl.value = out;
  updateSize(src.length, out.length);
});
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(outEl.value);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});
