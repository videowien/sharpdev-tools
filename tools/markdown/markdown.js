/**
 * Markdown Preview — SharpDev Tools
 * Inline minimal Markdown parser (subset of GFM).
 */

const inputEl = document.getElementById('md-input');
const previewEl = document.getElementById('preview');
const statsEl = document.getElementById('stats-src');

const SAMPLE = `# Markdown Preview

A **live preview** of your *Markdown* — type on the left, see HTML on the right. Supports ~~most~~ all common GFM basics.

## Text formatting

**Bold**, *italic*, ~~strikethrough~~, and inline \`code\` all work. Combine **bold _italic_** freely.

## Lists

Unordered:

- First item
- Second item
- Third item

Ordered:

1. One
2. Two
3. Three

## Code

Inline: \`const x = 42;\`

Block:

\`\`\`
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

## Blockquote

> "The best way to predict the future is to invent it."
> — Alan Kay

## Links & images

Visit [SharpDev.Tools](https://sharpdev.tools) for more. Autolinks also work: https://example.com

![SharpDev.Tools](/og-image.png)

## Table

| Tool | Category | Status |
| --- | --- | --- |
| JSON Formatter | Data | Ready |
| JWT Decoder | Data | Ready |
| Markdown | Text | Ready |

---

That's it. Enjoy.`;

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseInline(text) {
  // text is already HTML-escaped
  // Extract inline code spans first so their contents aren't mangled by
  // bold/italic/link/etc. regexes. Replace each with a placeholder, restore at end.
  const codeSpans = [];
  text = text.replace(/`([^`]+)`/g, (_, c) => {
    const token = '\x00CODE' + codeSpans.length + '\x00';
    codeSpans.push(`<code>${c}</code>`);
    return token;
  });
  // Images: ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, alt, url, title) => `<img src="${url}" alt="${alt}"${title ? ` title="${title}"` : ''}>`);
  // Links: [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, t, url, title) => `<a href="${url}"${title ? ` title="${title}"` : ''}>${t}</a>`);
  // Autolinks
  text = text.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2">$2</a>');
  // Bold **x** or __x__
  text = text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // Italic *x* or _x_
  text = text.replace(/(^|[^\*])\*([^\*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  text = text.replace(/(^|[^_\w])_([^_\n]+)_(?!_|\w)/g, '$1<em>$2</em>');
  // Strikethrough
  text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  // Restore code spans
  text = text.replace(/\x00CODE(\d+)\x00/g, (_, i) => codeSpans[+i]);
  return text;
}

function parseMarkdown(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;

  const flushPara = (buf) => {
    if (buf.length) {
      out.push('<p>' + parseInline(buf.join(' ')) + '</p>');
      buf.length = 0;
    }
  };

  let paraBuf = [];

  while (i < lines.length) {
    let line = lines[i];
    const raw = line;
    // Fenced code block
    const fence = raw.match(/^```\s*(\S*)\s*$/);
    if (fence) {
      flushPara(paraBuf);
      const lang = fence[1];
      i++;
      const codeLines = [];
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]); i++;
      }
      i++; // skip closing
      out.push(`<pre><code${lang ? ` class="lang-${escHtml(lang)}"` : ''}>${escHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    // Blank line
    if (/^\s*$/.test(raw)) {
      flushPara(paraBuf); i++; continue;
    }

    // Horizontal rule
    if (/^(\s*)(-{3,}|\*{3,}|_{3,})\s*$/.test(raw)) {
      flushPara(paraBuf); out.push('<hr>'); i++; continue;
    }

    // Heading
    const h = raw.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (h) {
      flushPara(paraBuf);
      const level = h[1].length;
      out.push(`<h${level}>${parseInline(escHtml(h[2]))}</h${level}>`);
      i++; continue;
    }

    // Blockquote
    if (/^>\s?/.test(raw)) {
      flushPara(paraBuf);
      const qLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        qLines.push(lines[i].replace(/^>\s?/, '')); i++;
      }
      out.push('<blockquote>' + parseMarkdown(qLines.join('\n')) + '</blockquote>');
      continue;
    }

    // Unordered list
    if (/^(\s*)[-*+]\s+/.test(raw)) {
      flushPara(paraBuf);
      const items = [];
      while (i < lines.length && /^(\s*)[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*)[-*+]\s+/, '')); i++;
      }
      out.push('<ul>' + items.map(x => `<li>${parseInline(escHtml(x))}</li>`).join('') + '</ul>');
      continue;
    }

    // Ordered list
    if (/^(\s*)\d+\.\s+/.test(raw)) {
      flushPara(paraBuf);
      const items = [];
      while (i < lines.length && /^(\s*)\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*)\d+\.\s+/, '')); i++;
      }
      out.push('<ol>' + items.map(x => `<li>${parseInline(escHtml(x))}</li>`).join('') + '</ol>');
      continue;
    }

    // Table (pipe syntax)
    if (/^\s*\|?.+\|.+/.test(raw) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]+/.test(lines[i+1])) {
      flushPara(paraBuf);
      const splitRow = (r) => r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(s => s.trim());
      const headers = splitRow(lines[i]); i++;
      i++; // skip separator
      const rows = [];
      while (i < lines.length && /\|/.test(lines[i]) && !/^\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i])); i++;
      }
      let tbl = '<table><thead><tr>' +
        headers.map(h => `<th>${parseInline(escHtml(h))}</th>`).join('') +
        '</tr></thead><tbody>';
      for (const r of rows) {
        tbl += '<tr>' + r.map(c => `<td>${parseInline(escHtml(c))}</td>`).join('') + '</tr>';
      }
      tbl += '</tbody></table>';
      out.push(tbl);
      continue;
    }

    // Paragraph line
    paraBuf.push(escHtml(raw)); i++;
  }
  flushPara(paraBuf);
  return out.join('\n');
}

function render() {
  const src = inputEl.value;
  previewEl.innerHTML = parseMarkdown(src);
  const chars = src.length;
  const words = src.trim() ? src.trim().split(/\s+/).length : 0;
  statsEl.textContent = `${chars.toLocaleString()} chars · ${words.toLocaleString()} words`;
}

function copyHtml() {
  navigator.clipboard.writeText(previewEl.innerHTML);
  flashButton(event.target, 'Copied!');
}

function flashButton(btn, text) {
  const orig = btn.textContent;
  btn.textContent = text;
  setTimeout(() => { btn.textContent = orig; }, 900);
}

function downloadHtml() {
  const body = previewEl.innerHTML;
  const full = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Markdown export</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 760px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.6; }
h1, h2, h3, h4, h5, h6 { line-height: 1.3; }
h1 { border-bottom: 1px solid #ddd; padding-bottom: 8px; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: 'SF Mono', Monaco, monospace; }
pre { background: #f4f4f4; padding: 14px; border-radius: 6px; overflow-x: auto; }
pre code { background: transparent; padding: 0; }
blockquote { border-left: 4px solid #ddd; padding: 4px 14px; color: #666; margin: 0 0 14px; }
table { border-collapse: collapse; margin-bottom: 14px; }
th, td { padding: 8px 12px; border: 1px solid #ddd; }
th { background: #f4f4f4; }
a { color: #0066cc; }
img { max-width: 100%; }
hr { border: 0; border-top: 1px solid #ddd; }
</style>
</head>
<body>
${body}
</body>
</html>`;
  downloadBlob(full, 'markdown.html', 'text/html');
}

function downloadMd() {
  downloadBlob(inputEl.value, 'markdown.md', 'text/markdown');
}

function downloadBlob(content, name, type) {
  const blob = new Blob([content], { type: type + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function loadSample() {
  inputEl.value = SAMPLE;
  render();
}

function clearAll() {
  inputEl.value = '';
  render();
}

function setTab(t) {
  document.querySelectorAll('.tab').forEach(el => el.classList.toggle('active', el.dataset.tab === t));
  document.querySelector('.col-write').classList.toggle('tab-active', t === 'write');
  document.querySelector('.col-preview').classList.toggle('tab-active', t === 'preview');
}

// Default: show write tab on mobile
setTab('write');
loadSample();
