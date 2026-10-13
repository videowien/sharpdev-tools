/** JS Minifier & Beautifier — conservative, string/regex-aware */
const inEl = document.getElementById('in');
const outEl = document.getElementById('out');
const minifyBtn = document.getElementById('minify-btn');
const beautifyBtn = document.getElementById('beautify-btn');
const copyBtn = document.getElementById('copy-btn');
const sizeLabel = document.getElementById('size-label');

// Tokenize to protect strings / template literals / regex / comments
function tokenize(src) {
  const tokens = []; // { type: 'code' | 'string' | 'comment', text }
  let i = 0;
  let buf = '';
  function flushCode() { if (buf) { tokens.push({ type: 'code', text: buf }); buf = ''; } }
  while (i < src.length) {
    const ch = src[i], next = src[i + 1];
    // Single line comment
    if (ch === '/' && next === '/') {
      flushCode();
      const end = src.indexOf('\n', i);
      const to = end === -1 ? src.length : end;
      tokens.push({ type: 'comment', text: src.slice(i, to) });
      i = to;
      continue;
    }
    // Block comment
    if (ch === '/' && next === '*') {
      flushCode();
      const end = src.indexOf('*/', i + 2);
      const to = end === -1 ? src.length : end + 2;
      tokens.push({ type: 'comment', text: src.slice(i, to) });
      i = to;
      continue;
    }
    // String / template
    if (ch === '"' || ch === "'" || ch === '`') {
      flushCode();
      const quote = ch;
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === quote) { j++; break; }
        // Template literal can contain ${...} — naive: we don't recurse expressions
        j++;
      }
      tokens.push({ type: 'string', text: src.slice(i, j) });
      i = j;
      continue;
    }
    // Regex (heuristic): / preceded by common tokens
    if (ch === '/') {
      const prev = (buf + '').trimEnd();
      const lastCh = prev[prev.length - 1] || '';
      const canBeRegex = !lastCh || /[=(,;:!&|?{}^~+\-*/]/.test(lastCh) ||
        /\b(return|typeof|in|instanceof|new|delete|void|throw|case|do|else|yield|await)$/.test(prev);
      if (canBeRegex) {
        flushCode();
        let j = i + 1, inClass = false;
        while (j < src.length) {
          const c2 = src[j];
          if (c2 === '\\') { j += 2; continue; }
          if (c2 === '[') inClass = true;
          else if (c2 === ']') inClass = false;
          else if (c2 === '/' && !inClass) { j++; while (j < src.length && /[a-z]/.test(src[j])) j++; break; }
          else if (c2 === '\n') break;
          j++;
        }
        tokens.push({ type: 'string', text: src.slice(i, j) });
        i = j;
        continue;
      }
    }
    buf += ch; i++;
  }
  flushCode();
  return tokens;
}

function minifyJs(src) {
  const tokens = tokenize(src);
  let out = '';
  for (const tok of tokens) {
    if (tok.type === 'comment') continue;
    if (tok.type === 'string') { out += tok.text; continue; }
    let t = tok.text;
    // Collapse whitespace
    t = t.replace(/[ \t]+/g, ' ');
    // Remove newlines that are safe to remove (keep after certain keywords / punctuators as-is for safety we just collapse)
    t = t.replace(/\s*\n\s*/g, '\n');
    // Remove spaces around non-identifier punctuators
    t = t.replace(/\s*([=+\-*/%<>!&|^~?:;,(){}\[\]])\s*/g, '$1');
    // Collapse multiple newlines
    t = t.replace(/\n{2,}/g, '\n');
    out += t;
  }
  // Remove leading/trailing whitespace on lines and empty lines
  out = out.replace(/^\s+|\s+$/gm, '').replace(/\n+/g, '\n').trim();
  return out;
}

function beautifyJs(src) {
  // Prefer the battle-tested js-beautify library (loaded from cdnjs).
  // Handles for-loops, ternaries, chains, template literals, etc. correctly.
  if (window.js_beautify) {
    return window.js_beautify(src, {
      indent_size: 2,
      space_in_empty_paren: true,
      preserve_newlines: true,
      max_preserve_newlines: 2,
    });
  }
  // Fallback: lightweight hand-rolled beautifier (used only if the CDN fails).
  const tokens = tokenize(src);
  const indent = '  ';
  let depth = 0;
  let out = '';
  let atLineStart = true;
  function write(s) {
    if (atLineStart) { out += indent.repeat(depth); atLineStart = false; }
    out += s;
  }
  function newline() { out += '\n'; atLineStart = true; }
  for (const tok of tokens) {
    if (tok.type === 'comment') { write(tok.text); newline(); continue; }
    if (tok.type === 'string') { write(tok.text); continue; }
    const chars = tok.text;
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (ch === '{') { write(' {'); newline(); depth++; }
      else if (ch === '}') {
        depth = Math.max(0, depth - 1);
        // ensure on own line
        if (!out.endsWith('\n')) newline();
        write('}'); // closing; next char may be ; or , etc
      }
      else if (ch === ';') { write(';'); newline(); }
      else if (ch === ' ' || ch === '\t' || ch === '\n') {
        if (!atLineStart && !out.endsWith(' ') && !out.endsWith('\n')) out += ' ';
      }
      else { write(ch); }
    }
  }
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

function updateSize(before, after) {
  const delta = before - after;
  const pct = before > 0 ? (delta / before * 100).toFixed(1) : 0;
  sizeLabel.innerHTML = `<span>${before.toLocaleString()} → ${after.toLocaleString()} bytes</span> &nbsp;<span class="delta">${delta >= 0 ? '−' : '+'}${Math.abs(pct)}%</span>`;
}

minifyBtn.addEventListener('click', () => {
  const src = inEl.value;
  const out = minifyJs(src);
  outEl.value = out;
  updateSize(src.length, out.length);
});
beautifyBtn.addEventListener('click', () => {
  const src = inEl.value;
  const out = beautifyJs(src);
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
