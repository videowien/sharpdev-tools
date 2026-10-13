/**
 * HTML to Plain Text — DOMParser-based stripper
 */

const BLOCK = new Set(['ADDRESS','ARTICLE','ASIDE','BLOCKQUOTE','BR','DD','DETAILS','DIALOG','DIV','DL','DT','FIELDSET','FIGCAPTION','FIGURE','FOOTER','FORM','H1','H2','H3','H4','H5','H6','HEADER','HR','LI','MAIN','NAV','OL','P','PRE','SECTION','TABLE','THEAD','TBODY','TFOOT','TR','TD','TH','UL']);

const inputEl = document.getElementById('input');
const preserveLinks = document.getElementById('preserve-links');
const bulletPrefix = document.getElementById('bullet-prefix');
const collapseEl = document.getElementById('collapse');
const output = document.getElementById('output');
const stat = document.getElementById('stat');
const statusMsg = document.getElementById('status-msg');

function walk(node, out, ctx) {
  if (!node) return;
  if (node.nodeType === 3) {
    // Text node
    out.text += node.textContent;
    return;
  }
  if (node.nodeType !== 1) return; // skip comments etc
  const tag = node.tagName;
  if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'IFRAME' || tag === 'IMG' || tag === 'SVG' || tag === 'PICTURE' || tag === 'VIDEO' || tag === 'AUDIO') return;
  // For lists, prefix items
  if (tag === 'LI' && bulletPrefix.checked) {
    if (ctx.listType === 'ol') {
      ctx.olCounter++;
      out.text += `\n${ctx.olCounter}. `;
    } else {
      out.text += '\n• ';
    }
  } else if (tag === 'BR') {
    out.text += '\n';
  } else if (BLOCK.has(tag)) {
    if (out.text && !out.text.endsWith('\n')) out.text += '\n';
  }
  // Track list type
  const oldCtx = { listType: ctx.listType, olCounter: ctx.olCounter };
  if (tag === 'OL') { ctx.listType = 'ol'; ctx.olCounter = 0; }
  if (tag === 'UL') { ctx.listType = 'ul'; }

  // Children
  for (const child of node.childNodes) walk(child, out, ctx);

  // Restore list context
  ctx.listType = oldCtx.listType;
  ctx.olCounter = oldCtx.olCounter;

  // Append link URL
  if (tag === 'A' && preserveLinks.checked) {
    const href = node.getAttribute('href');
    if (href && !out.text.endsWith(' ')) out.text += ' (' + href + ')';
  }

  // Block-level newline after
  if (BLOCK.has(tag) && tag !== 'BR') {
    if (out.text && !out.text.endsWith('\n')) out.text += '\n';
  }
}

function strip() {
  try {
    const html = inputEl.value;
    // Wrap in body so DOMParser handles fragments
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
    const out = { text: '' };
    walk(doc.body, out, { listType: null, olCounter: 0 });
    let text = out.text;
    if (collapseEl.checked) {
      text = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    } else {
      text = text.trim();
    }
    output.textContent = text || '—';
    const chars = text.length;
    const words = (text.trim().match(/\S+/g) || []).length;
    stat.textContent = `${chars.toLocaleString()} chars · ${words.toLocaleString()} words`;
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
}

[inputEl, preserveLinks, bulletPrefix, collapseEl].forEach(el => el.addEventListener('input', strip));
preserveLinks.addEventListener('change', strip);
bulletPrefix.addEventListener('change', strip);
collapseEl.addEventListener('change', strip);

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent);
  flash('✓ Copied');
});
document.getElementById('download-btn').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'stripped.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ Downloaded');
});
function flash(msg) { statusMsg.textContent = msg; statusMsg.className = 'status-msg ok'; setTimeout(() => { statusMsg.textContent = ''; }, 1500); }

strip();
