/**
 * Markdown <-> HTML Converter — SharpDev Tools
 */

const leftEl = document.getElementById('left');
const rightEl = document.getElementById('right');
const leftLabel = document.getElementById('left-label');
const rightLabel = document.getElementById('right-label');
let direction = 'md2html';

const SAMPLE_MD = `# Sample Document

This is **bold**, this is *italic*, and this is ~~struck~~.

## Lists

- Apple
- Banana
- Cherry

1. First
2. Second
3. Third

## Code

Inline: \`const x = 42;\`

\`\`\`js
function greet(name) {
  return "Hello, " + name;
}
\`\`\`

> A wise quote here.

[Visit SharpDev](https://sharpdev.tools)

![SharpDev.Tools logo](/og-image.png)

| Name | Score |
| --- | --- |
| Alice | 92 |
| Bob | 87 |

---
`;

// =============== MD -> HTML (ported from markdown preview) ===============

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseInline(text) {
  text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, alt, url, title) => `<img src="${url}" alt="${alt}"${title ? ` title="${title}"` : ''}>`);
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, t, url, title) => `<a href="${url}"${title ? ` title="${title}"` : ''}>${t}</a>`);
  text = text.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2">$2</a>');
  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  text = text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  text = text.replace(/(^|[^\*])\*([^\*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  text = text.replace(/(^|[^_\w])_([^_\n]+)_(?!_|\w)/g, '$1<em>$2</em>');
  text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return text;
}

function mdToHtml(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;
  let paraBuf = [];
  const flushPara = () => {
    if (paraBuf.length) {
      out.push('<p>' + parseInline(paraBuf.join(' ')) + '</p>');
      paraBuf = [];
    }
  };

  while (i < lines.length) {
    const raw = lines[i];
    const fence = raw.match(/^```\s*(\S*)\s*$/);
    if (fence) {
      flushPara();
      const lang = fence[1];
      i++;
      const cl = [];
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { cl.push(lines[i]); i++; }
      i++;
      out.push('<pre><code' + (lang ? ' class="language-' + escHtml(lang) + '"' : '') + '>' + escHtml(cl.join('\n')) + '</code></pre>');
      continue;
    }
    if (/^\s*$/.test(raw)) { flushPara(); i++; continue; }
    if (/^(\s*)(-{3,}|\*{3,}|_{3,})\s*$/.test(raw)) { flushPara(); out.push('<hr>'); i++; continue; }
    const h = raw.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (h) { flushPara(); out.push(`<h${h[1].length}>${parseInline(escHtml(h[2]))}</h${h[1].length}>`); i++; continue; }
    if (/^>\s?/.test(raw)) {
      flushPara();
      const qLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { qLines.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push('<blockquote>' + mdToHtml(qLines.join('\n')) + '</blockquote>');
      continue;
    }
    if (/^(\s*)[-*+]\s+/.test(raw)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^(\s*)[-*+]\s+/.test(lines[i])) { items.push(lines[i].replace(/^(\s*)[-*+]\s+/, '')); i++; }
      out.push('<ul>' + items.map(x => `<li>${parseInline(escHtml(x))}</li>`).join('') + '</ul>');
      continue;
    }
    if (/^(\s*)\d+\.\s+/.test(raw)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^(\s*)\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^(\s*)\d+\.\s+/, '')); i++; }
      out.push('<ol>' + items.map(x => `<li>${parseInline(escHtml(x))}</li>`).join('') + '</ol>');
      continue;
    }
    if (/^\s*\|?.+\|.+/.test(raw) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]+/.test(lines[i+1])) {
      flushPara();
      const splitRow = r => r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(s => s.trim());
      const headers = splitRow(lines[i]); i++; i++;
      const rows = [];
      while (i < lines.length && /\|/.test(lines[i]) && !/^\s*$/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
      let tbl = '<table><thead><tr>' + headers.map(h => `<th>${parseInline(escHtml(h))}</th>`).join('') + '</tr></thead><tbody>';
      for (const r of rows) tbl += '<tr>' + r.map(c => `<td>${parseInline(escHtml(c))}</td>`).join('') + '</tr>';
      tbl += '</tbody></table>';
      out.push(tbl);
      continue;
    }
    paraBuf.push(escHtml(raw)); i++;
  }
  flushPara();
  return out.join('\n');
}

// =============== HTML -> MD ===============

function htmlToMd(src) {
  const doc = new DOMParser().parseFromString('<!DOCTYPE html><html><body>' + src + '</body></html>', 'text/html');
  // strip scripts/styles
  doc.querySelectorAll('script, style, noscript').forEach(n => n.remove());
  return walk(doc.body).replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function walk(node) {
  let out = '';
  for (const child of node.childNodes) {
    out += nodeToMd(child);
  }
  return out;
}

function inlineText(node) {
  // Process children for inline elements, returning inline markdown
  let out = '';
  for (const child of node.childNodes) {
    out += nodeToMd(child);
  }
  return out;
}

function nodeToMd(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.replace(/\s+/g, ' ');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const tag = node.tagName.toLowerCase();
  switch (tag) {
    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
      const level = +tag[1];
      return '\n\n' + '#'.repeat(level) + ' ' + inlineText(node).trim() + '\n\n';
    }
    case 'p':
      return '\n\n' + inlineText(node).trim() + '\n\n';
    case 'strong': case 'b':
      return '**' + inlineText(node) + '**';
    case 'em': case 'i':
      return '*' + inlineText(node) + '*';
    case 'del': case 's': case 'strike':
      return '~~' + inlineText(node) + '~~';
    case 'code': {
      // pre > code handled by pre
      if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
        return node.textContent;
      }
      return '`' + node.textContent + '`';
    }
    case 'pre': {
      const code = node.querySelector('code');
      let lang = '';
      if (code) {
        const cls = code.getAttribute('class') || '';
        const m = cls.match(/language-([\w-]+)/);
        if (m) lang = m[1];
      }
      const txt = (code || node).textContent.replace(/\n+$/, '');
      return '\n\n```' + lang + '\n' + txt + '\n```\n\n';
    }
    case 'blockquote': {
      const inner = walk(node).trim();
      return '\n\n' + inner.split('\n').map(l => '> ' + l).join('\n') + '\n\n';
    }
    case 'ul': {
      let s = '\n';
      for (const li of node.children) {
        if (li.tagName.toLowerCase() === 'li') {
          s += '- ' + inlineText(li).trim().replace(/\n/g, '\n  ') + '\n';
        }
      }
      return s + '\n';
    }
    case 'ol': {
      let s = '\n';
      let n = 1;
      for (const li of node.children) {
        if (li.tagName.toLowerCase() === 'li') {
          s += n + '. ' + inlineText(li).trim().replace(/\n/g, '\n   ') + '\n';
          n++;
        }
      }
      return s + '\n';
    }
    case 'a': {
      const href = node.getAttribute('href') || '';
      return '[' + inlineText(node) + '](' + href + ')';
    }
    case 'img': {
      const alt = node.getAttribute('alt') || '';
      const src = node.getAttribute('src') || '';
      return '![' + alt + '](' + src + ')';
    }
    case 'hr':
      return '\n\n---\n\n';
    case 'br':
      return '  \n';
    case 'table': {
      const rows = node.querySelectorAll('tr');
      if (!rows.length) return '';
      let out = '\n\n';
      const headerCells = rows[0].querySelectorAll('th,td');
      const headers = [];
      headerCells.forEach(c => headers.push(inlineText(c).trim()));
      out += '| ' + headers.join(' | ') + ' |\n';
      out += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
      for (let r = 1; r < rows.length; r++) {
        const cells = rows[r].querySelectorAll('th,td');
        const vals = [];
        cells.forEach(c => vals.push(inlineText(c).trim()));
        out += '| ' + vals.join(' | ') + ' |\n';
      }
      return out + '\n';
    }
    default:
      return walk(node);
  }
}

// =============== Wire up ===============

let timer = null;
function schedule() {
  clearTimeout(timer);
  timer = setTimeout(convert, 200);
}

function convert() {
  const src = leftEl.value;
  if (direction === 'md2html') {
    rightEl.value = mdToHtml(src);
  } else {
    rightEl.value = htmlToMd(src);
  }
}

function setDirection(d) {
  if (d === direction) return;
  direction = d;
  document.querySelectorAll('.dir-btn').forEach(b => b.classList.toggle('active', b.dataset.dir === d));
  if (d === 'md2html') {
    leftLabel.textContent = 'Markdown';
    rightLabel.textContent = 'HTML';
    leftEl.placeholder = 'Write Markdown here...';
  } else {
    leftLabel.textContent = 'HTML';
    rightLabel.textContent = 'Markdown';
    leftEl.placeholder = 'Paste HTML here...';
  }
  // Swap left/right contents to keep the flow
  const tmp = leftEl.value;
  leftEl.value = rightEl.value;
  rightEl.value = '';
  convert();
}

document.querySelectorAll('.dir-btn').forEach(b => {
  b.addEventListener('click', () => setDirection(b.dataset.dir));
});
leftEl.addEventListener('input', schedule);

function copyLeft() {
  navigator.clipboard.writeText(leftEl.value);
  flash(event.target);
}
function copyRight() {
  navigator.clipboard.writeText(rightEl.value);
  flash(event.target);
}
function flash(btn) {
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = orig, 900);
}

function downloadBlob(content, name, type) {
  const blob = new Blob([content], { type: type + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function downloadLeft() {
  if (direction === 'md2html') downloadBlob(leftEl.value, 'input.md', 'text/markdown');
  else downloadBlob(leftEl.value, 'input.html', 'text/html');
}
function downloadRight() {
  if (direction === 'md2html') downloadBlob(rightEl.value, 'output.html', 'text/html');
  else downloadBlob(rightEl.value, 'output.md', 'text/markdown');
}

function loadSample() {
  if (direction === 'md2html') leftEl.value = SAMPLE_MD;
  else leftEl.value = mdToHtml(SAMPLE_MD);
  convert();
}

loadSample();
