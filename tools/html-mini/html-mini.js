/** HTML Minifier & Beautifier — simple tokenizer-based */
const inEl = document.getElementById('in');
const outEl = document.getElementById('out');
const minifyBtn = document.getElementById('minify-btn');
const beautifyBtn = document.getElementById('beautify-btn');
const copyBtn = document.getElementById('copy-btn');
const sizeLabel = document.getElementById('size-label');

const PRESERVE = new Set(['pre', 'code', 'textarea', 'script', 'style']);

function minifyHtml(src) {
  // Protect preserved regions
  const placeholders = [];
  src = src.replace(/<(pre|code|textarea|script|style)([^>]*)>([\s\S]*?)<\/\1>/gi, (m, tag, attrs, body) => {
    placeholders.push(`<${tag}${attrs}>${body}</${tag}>`);
    return `\u0001${placeholders.length - 1}\u0001`;
  });
  // Strip HTML comments (but keep conditional IE comments)
  src = src.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
  // Collapse whitespace between tags
  src = src.replace(/>\s+</g, '><');
  // Collapse internal whitespace runs
  src = src.replace(/[ \t]{2,}/g, ' ');
  // Trim lines
  src = src.replace(/^\s+|\s+$/gm, '');
  // Remove blank lines
  src = src.replace(/\n+/g, '');
  // Restore preserved
  src = src.replace(/\u0001(\d+)\u0001/g, (_, i) => placeholders[+i]);
  return src.trim();
}

function beautifyHtml(src) {
  // Prefer the battle-tested js-beautify HTML formatter (loaded from cdnjs).
  // Correctly handles void elements, inline vs block, and embedded JS/CSS.
  if (window.html_beautify) {
    return window.html_beautify(src, {
      indent_size: 2,
      wrap_line_length: 0,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      indent_inner_html: true,
    });
  }
  // Fallback: lightweight hand-rolled beautifier (used only if the CDN fails).
  // Protect preserved content first
  const placeholders = [];
  src = src.replace(/<(pre|code|textarea|script|style)([^>]*)>([\s\S]*?)<\/\1>/gi, (m, tag, attrs, body) => {
    placeholders.push(m);
    return `\u0001${placeholders.length - 1}\u0001`;
  });
  // Normalize whitespace between tags
  src = src.replace(/>\s+</g, '>\n<');
  // Indent
  const lines = src.split('\n');
  let depth = 0;
  const indent = '  ';
  const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr','!doctype','!DOCTYPE']);
  const out = [];
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    const closing = /^<\//.test(line);
    const selfClosing = /\/>$/.test(line) || /^<!/.test(line);
    const openMatch = line.match(/^<([a-zA-Z][\w:-]*)/);
    const tagName = openMatch ? openMatch[1].toLowerCase() : '';
    const isVoid = VOID.has(tagName);
    if (closing) depth = Math.max(0, depth - 1);
    out.push(indent.repeat(depth) + line);
    if (!closing && !selfClosing && !isVoid && openMatch && !/<\/[a-zA-Z][\w:-]*>$/.test(line)) {
      // opening tag without closing on same line
      depth++;
    }
  }
  let result = out.join('\n');
  result = result.replace(/\u0001(\d+)\u0001/g, (_, i) => placeholders[+i]);
  return result;
}

function updateSize(before, after) {
  const delta = before - after;
  const pct = before > 0 ? (delta / before * 100).toFixed(1) : 0;
  sizeLabel.innerHTML = `<span>${before.toLocaleString()} → ${after.toLocaleString()} bytes</span> &nbsp;<span class="delta">−${pct}%</span>`;
}

minifyBtn.addEventListener('click', () => {
  const src = inEl.value;
  const out = minifyHtml(src);
  outEl.value = out;
  updateSize(src.length, out.length);
});
beautifyBtn.addEventListener('click', () => {
  const src = inEl.value;
  const out = beautifyHtml(src);
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
