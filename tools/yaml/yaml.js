// YAML <-> JSON Converter
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const inputEl = $('input');
  const outputEl = $('output');
  const statsIn = $('stats-in');
  const statsOut = $('stats-out');
  const errBox = $('error-box');
  const okBox = $('success-box');
  const indentSel = $('opt-indent');

  /* ================= YAML PARSER ================= */
  function parseYAML(src) {
    src = src.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // split documents
    const docs = splitDocs(src);
    const parsed = docs.map(lines => parseDoc(lines));
    return parsed.length === 1 ? parsed[0] : parsed;
  }

  function splitDocs(src) {
    const lines = src.split('\n');
    const docs = [];
    let cur = [];
    for (const ln of lines) {
      if (/^---\s*$/.test(ln) || /^---\s+/.test(ln)) {
        if (cur.length) docs.push(cur);
        cur = [];
      } else if (/^\.\.\.\s*$/.test(ln)) {
        if (cur.length) docs.push(cur);
        cur = [];
      } else {
        cur.push(ln);
      }
    }
    if (cur.length) docs.push(cur);
    if (docs.length === 0) docs.push([]);
    return docs;
  }

  function stripComment(line) {
    // remove trailing comment not inside string
    let inS = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inS) {
        if (c === '\\' && inS === '"') { i++; continue; }
        if (c === inS) inS = null;
      } else {
        if (c === '"' || c === "'") inS = c;
        else if (c === '#' && (i === 0 || /\s/.test(line[i - 1]))) {
          return line.slice(0, i).replace(/\s+$/, '');
        }
      }
    }
    return line.replace(/\s+$/, '');
  }

  function indentOf(line) {
    let i = 0;
    while (i < line.length && line[i] === ' ') i++;
    return i;
  }

  function parseDoc(lines) {
    // Preserve line numbers but strip comments
    const cleaned = [];
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      if (/^\s*#/.test(raw) || /^\s*$/.test(raw)) {
        cleaned.push({ line: i + 1, raw, text: null });
      } else {
        cleaned.push({ line: i + 1, raw, text: stripComment(raw) });
      }
    }
    const anchors = {};
    const ctx = { lines: cleaned, i: 0, anchors };
    // skip blanks
    skipBlank(ctx);
    if (ctx.i >= ctx.lines.length) return null;
    const node = parseNode(ctx, 0);
    return node;
  }

  function skipBlank(ctx) {
    while (ctx.i < ctx.lines.length && ctx.lines[ctx.i].text === null) ctx.i++;
  }

  function parseNode(ctx, minIndent) {
    skipBlank(ctx);
    if (ctx.i >= ctx.lines.length) return null;
    const ln = ctx.lines[ctx.i];
    const ind = indentOf(ln.text);
    if (ind < minIndent) return null;
    const body = ln.text.slice(ind);

    // Sequence
    if (body === '-' || body.startsWith('- ')) {
      return parseSeq(ctx, ind);
    }
    // Flow
    if (body[0] === '[' || body[0] === '{') {
      return parseFlowAtLine(ctx);
    }
    // Block scalar at top (rare)
    if (body === '|' || body === '>' || /^[|>][+\-]?\d*\s*$/.test(body)) {
      return parseBlockScalar(ctx, ind, body);
    }
    // Mapping or plain scalar
    // Check if it's a mapping: key: value
    if (isMappingLine(body)) {
      return parseMap(ctx, ind);
    }
    // Plain scalar (single line or multi-line folded implicit)
    const val = scanScalar(body, ctx, ind);
    return val;
  }

  function isMappingLine(body) {
    // find unquoted ':' followed by space or eol
    let inS = null;
    let depth = 0;
    for (let i = 0; i < body.length; i++) {
      const c = body[i];
      if (inS) {
        if (c === '\\' && inS === '"') { i++; continue; }
        if (c === inS) inS = null;
      } else {
        if (c === '"' || c === "'") inS = c;
        else if (c === '[' || c === '{') depth++;
        else if (c === ']' || c === '}') depth--;
        else if (c === ':' && depth === 0) {
          if (i === body.length - 1 || body[i + 1] === ' ' || body[i + 1] === '\t') return true;
        }
      }
    }
    return false;
  }

  function parseSeq(ctx, indent) {
    const arr = [];
    while (ctx.i < ctx.lines.length) {
      skipBlank(ctx);
      if (ctx.i >= ctx.lines.length) break;
      const ln = ctx.lines[ctx.i];
      const ind = indentOf(ln.text);
      if (ind < indent) break;
      if (ind > indent) throw new Error(`Unexpected indent at line ${ln.line}`);
      const body = ln.text.slice(ind);
      if (body !== '-' && !body.startsWith('- ')) break;
      const rest = body === '-' ? '' : body.slice(2);
      if (rest === '') {
        ctx.i++;
        skipBlank(ctx);
        // nested node at greater indent
        if (ctx.i < ctx.lines.length && indentOf(ctx.lines[ctx.i].text) > indent) {
          arr.push(parseNode(ctx, indentOf(ctx.lines[ctx.i].text)));
        } else {
          arr.push(null);
        }
      } else if (isMappingLine(rest)) {
        // inline mapping entry: "- key: value"
        // treat this line as a mapping starting at indent+2
        const fakeLines = [{ line: ln.line, raw: ' '.repeat(indent + 2) + rest, text: ' '.repeat(indent + 2) + rest }];
        // replace current line with fake so we can parse as map
        ctx.lines[ctx.i] = fakeLines[0];
        arr.push(parseMap(ctx, indent + 2));
      } else if (rest[0] === '[' || rest[0] === '{') {
        ctx.lines[ctx.i] = { line: ln.line, raw: ' '.repeat(indent + 2) + rest, text: ' '.repeat(indent + 2) + rest };
        arr.push(parseFlowAtLine(ctx));
      } else {
        // scalar
        const v = scanScalar(rest, ctx, indent + 2);
        arr.push(v);
        // scanScalar may have advanced ctx.i if block scalar; otherwise advance
        if (ctx.i < ctx.lines.length && ctx.lines[ctx.i].raw === ln.raw) ctx.i++;
      }
    }
    return arr;
  }

  function parseMap(ctx, indent) {
    const obj = {};
    const mergeSources = [];
    while (ctx.i < ctx.lines.length) {
      skipBlank(ctx);
      if (ctx.i >= ctx.lines.length) break;
      const ln = ctx.lines[ctx.i];
      const ind = indentOf(ln.text);
      if (ind < indent) break;
      if (ind > indent) throw new Error(`Unexpected indent at line ${ln.line}`);
      const body = ln.text.slice(ind);
      if (body.startsWith('- ') || body === '-') break;
      // parse key: value
      const kv = splitKV(body);
      if (!kv) throw new Error(`Expected "key: value" at line ${ln.line}`);
      let key = parseScalarValue(kv.key);
      let valStr = kv.val;
      // Anchor / alias / tag on value
      let anchor = null;
      if (valStr && valStr.startsWith('&')) {
        const m = valStr.match(/^&(\S+)\s*(.*)$/);
        if (m) { anchor = m[1]; valStr = m[2]; }
      }
      // Merge key
      const isMerge = key === '<<';
      ctx.i++;
      let value;
      if (valStr === '' || valStr === undefined) {
        // nested
        skipBlank(ctx);
        if (ctx.i < ctx.lines.length && indentOf(ctx.lines[ctx.i].text) > indent) {
          value = parseNode(ctx, indentOf(ctx.lines[ctx.i].text));
        } else {
          value = null;
        }
      } else if (valStr === '|' || valStr === '>' || /^[|>][+\-]?\d*$/.test(valStr)) {
        value = parseBlockScalar(ctx, indent, valStr);
      } else if (valStr[0] === '[' || valStr[0] === '{') {
        value = parseFlow(valStr, ctx);
      } else if (valStr[0] === '*') {
        const name = valStr.slice(1).trim();
        if (!(name in ctx.anchors)) throw new Error(`Unknown alias *${name} at line ${ln.line}`);
        value = ctx.anchors[name];
      } else {
        value = parseScalarValue(valStr);
      }
      if (anchor) ctx.anchors[anchor] = value;
      if (isMerge) {
        if (Array.isArray(value)) mergeSources.push(...value);
        else if (value && typeof value === 'object') mergeSources.push(value);
      } else {
        obj[key] = value;
      }
    }
    // apply merges (existing keys win)
    for (const src of mergeSources) {
      for (const k of Object.keys(src)) {
        if (!(k in obj)) obj[k] = src[k];
      }
    }
    return obj;
  }

  function splitKV(body) {
    let inS = null;
    let depth = 0;
    for (let i = 0; i < body.length; i++) {
      const c = body[i];
      if (inS) {
        if (c === '\\' && inS === '"') { i++; continue; }
        if (c === inS) inS = null;
      } else {
        if (c === '"' || c === "'") inS = c;
        else if (c === '[' || c === '{') depth++;
        else if (c === ']' || c === '}') depth--;
        else if (c === ':' && depth === 0) {
          if (i === body.length - 1) return { key: body.slice(0, i).trim(), val: '' };
          if (body[i + 1] === ' ' || body[i + 1] === '\t') {
            return { key: body.slice(0, i).trim(), val: body.slice(i + 1).trim() };
          }
        }
      }
    }
    return null;
  }

  function parseBlockScalar(ctx, indent, header) {
    // header starts with | or >
    const style = header[0]; // | or >
    let chomp = ''; // '', '+', '-'
    let ind = 0;
    for (let i = 1; i < header.length; i++) {
      const c = header[i];
      if (c === '+' || c === '-') chomp = c;
      else if (c >= '0' && c <= '9') ind = ind * 10 + (+c);
    }
    ctx.i++; // move past header line
    const contentLines = [];
    let baseIndent = ind > 0 ? indent + ind : -1;
    while (ctx.i < ctx.lines.length) {
      const ln = ctx.lines[ctx.i];
      if (ln.text === null) {
        contentLines.push({ raw: ln.raw, blank: true });
        ctx.i++;
        continue;
      }
      const lnInd = indentOf(ln.raw);
      if (lnInd <= indent && ln.raw.trim() !== '') break;
      if (baseIndent < 0) baseIndent = lnInd;
      contentLines.push({ raw: ln.raw, blank: false, indent: lnInd });
      ctx.i++;
    }
    // trim trailing blanks for chomp
    let out = '';
    const stripIndent = baseIndent;
    const rawStrs = contentLines.map(l => l.blank ? '' : l.raw.slice(Math.min(stripIndent, l.raw.length)));
    if (style === '|') {
      out = rawStrs.join('\n');
    } else {
      // folded
      let parts = [];
      let buf = '';
      for (let i = 0; i < rawStrs.length; i++) {
        const s = rawStrs[i];
        if (s === '') {
          if (buf !== '') { parts.push(buf); buf = ''; }
          parts.push('');
        } else if (/^\s/.test(s)) {
          if (buf !== '') { parts.push(buf); buf = ''; }
          parts.push(s);
        } else {
          if (buf === '') buf = s;
          else buf += ' ' + s;
        }
      }
      if (buf !== '') parts.push(buf);
      out = parts.join('\n');
    }
    // chomp trailing newlines
    out = out.replace(/\n+$/, '\n');
    if (chomp === '-') out = out.replace(/\n+$/, '');
    else if (chomp === '+') {
      // keep all
      const trailing = rawStrs.reverse().filter(s => s === '').length;
      out = out.replace(/\n+$/, '') + '\n'.repeat(trailing + 1);
    } else {
      out = out.replace(/\n+$/, '\n');
    }
    return out;
  }

  function scanScalar(body, ctx, minIndent) {
    // handle anchor/alias
    if (body[0] === '&') {
      const m = body.match(/^&(\S+)\s*(.*)$/);
      if (m) {
        const name = m[1];
        const val = m[2] ? parseScalarValue(m[2]) : null;
        ctx.anchors[name] = val;
        return val;
      }
    }
    if (body[0] === '*') {
      const name = body.slice(1).trim();
      if (!(name in ctx.anchors)) throw new Error(`Unknown alias *${name}`);
      return ctx.anchors[name];
    }
    if (body === '|' || body === '>' || /^[|>][+\-]?\d*$/.test(body)) {
      return parseBlockScalar(ctx, minIndent - 2, body);
    }
    if (body[0] === '[' || body[0] === '{') {
      return parseFlow(body, ctx);
    }
    return parseScalarValue(body);
  }

  function parseScalarValue(s) {
    s = s.trim();
    if (s === '' || s === '~' || s.toLowerCase() === 'null') return null;
    if (/^(true|True|TRUE|yes|Yes|YES|on|On|ON)$/.test(s)) return true;
    if (/^(false|False|FALSE|no|No|NO|off|Off|OFF)$/.test(s)) return false;
    if (s === '.inf' || s === '.Inf' || s === '.INF') return Infinity;
    if (s === '-.inf' || s === '-.Inf' || s === '-.INF') return -Infinity;
    if (s === '.nan' || s === '.NaN' || s === '.NAN') return NaN;
    // quoted
    if (s[0] === '"' && s[s.length - 1] === '"') {
      return unescapeDouble(s.slice(1, -1));
    }
    if (s[0] === "'" && s[s.length - 1] === "'") {
      return s.slice(1, -1).replace(/''/g, "'");
    }
    // numeric
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    if (/^0x[0-9a-fA-F]+$/.test(s)) return parseInt(s, 16);
    if (/^0o[0-7]+$/.test(s)) return parseInt(s.slice(2), 8);
    if (/^-?\d*\.\d+([eE][+-]?\d+)?$/.test(s) || /^-?\d+[eE][+-]?\d+$/.test(s)) return parseFloat(s);
    return s;
  }

  function unescapeDouble(s) {
    let out = '';
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '\\' && i + 1 < s.length) {
        const n = s[++i];
        if (n === 'n') out += '\n';
        else if (n === 't') out += '\t';
        else if (n === 'r') out += '\r';
        else if (n === '\\') out += '\\';
        else if (n === '"') out += '"';
        else if (n === '0') out += '\0';
        else if (n === 'u') { out += String.fromCharCode(parseInt(s.substr(i + 1, 4), 16)); i += 4; }
        else if (n === 'x') { out += String.fromCharCode(parseInt(s.substr(i + 1, 2), 16)); i += 2; }
        else out += n;
      } else out += c;
    }
    return out;
  }

  function parseFlowAtLine(ctx) {
    // collect lines until matching bracket balance
    const startLine = ctx.lines[ctx.i].line;
    let buf = ctx.lines[ctx.i].text.trim();
    ctx.i++;
    let depth = 0, inS = null;
    const countDepth = (str) => {
      for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (inS) { if (c === '\\' && inS === '"') { i++; continue; } if (c === inS) inS = null; }
        else {
          if (c === '"' || c === "'") inS = c;
          else if (c === '[' || c === '{') depth++;
          else if (c === ']' || c === '}') depth--;
        }
      }
    };
    countDepth(buf);
    while (depth > 0 && ctx.i < ctx.lines.length) {
      const next = ctx.lines[ctx.i];
      buf += ' ' + (next.text || '').trim();
      countDepth(next.text || '');
      ctx.i++;
    }
    return parseFlow(buf, ctx);
  }

  function parseFlow(str, ctx) {
    const p = { s: str, i: 0, anchors: ctx ? ctx.anchors : {} };
    skipWS(p);
    const v = readFlowValue(p);
    skipWS(p);
    return v;
  }

  function skipWS(p) { while (p.i < p.s.length && /\s/.test(p.s[p.i])) p.i++; }

  function readFlowValue(p) {
    skipWS(p);
    const c = p.s[p.i];
    if (c === '[') return readFlowSeq(p);
    if (c === '{') return readFlowMap(p);
    if (c === '"') return readDoubleQuoted(p);
    if (c === "'") return readSingleQuoted(p);
    if (c === '*') {
      p.i++;
      let name = '';
      while (p.i < p.s.length && /[\w-]/.test(p.s[p.i])) name += p.s[p.i++];
      if (!(name in p.anchors)) throw new Error(`Unknown alias *${name}`);
      return p.anchors[name];
    }
    // plain
    let out = '';
    while (p.i < p.s.length && !',]}'.includes(p.s[p.i])) out += p.s[p.i++];
    return parseScalarValue(out.trim());
  }

  function readFlowSeq(p) {
    const arr = [];
    p.i++; // [
    skipWS(p);
    if (p.s[p.i] === ']') { p.i++; return arr; }
    while (p.i < p.s.length) {
      arr.push(readFlowValue(p));
      skipWS(p);
      if (p.s[p.i] === ',') { p.i++; skipWS(p); continue; }
      if (p.s[p.i] === ']') { p.i++; return arr; }
      break;
    }
    return arr;
  }

  function readFlowMap(p) {
    const obj = {};
    p.i++; // {
    skipWS(p);
    if (p.s[p.i] === '}') { p.i++; return obj; }
    while (p.i < p.s.length) {
      skipWS(p);
      let key;
      if (p.s[p.i] === '"') key = readDoubleQuoted(p);
      else if (p.s[p.i] === "'") key = readSingleQuoted(p);
      else {
        let k = '';
        while (p.i < p.s.length && p.s[p.i] !== ':' && p.s[p.i] !== ',' && p.s[p.i] !== '}') k += p.s[p.i++];
        key = parseScalarValue(k.trim());
      }
      skipWS(p);
      if (p.s[p.i] === ':') p.i++;
      skipWS(p);
      let val = null;
      if (p.s[p.i] !== ',' && p.s[p.i] !== '}') val = readFlowValue(p);
      obj[key] = val;
      skipWS(p);
      if (p.s[p.i] === ',') { p.i++; continue; }
      if (p.s[p.i] === '}') { p.i++; return obj; }
      break;
    }
    return obj;
  }

  function readDoubleQuoted(p) {
    p.i++; // "
    let out = '';
    while (p.i < p.s.length) {
      const c = p.s[p.i++];
      if (c === '"') return out;
      if (c === '\\') {
        const n = p.s[p.i++];
        if (n === 'n') out += '\n';
        else if (n === 't') out += '\t';
        else if (n === 'r') out += '\r';
        else if (n === '"') out += '"';
        else if (n === '\\') out += '\\';
        else if (n === 'u') { out += String.fromCharCode(parseInt(p.s.substr(p.i, 4), 16)); p.i += 4; }
        else out += n;
      } else out += c;
    }
    return out;
  }

  function readSingleQuoted(p) {
    p.i++;
    let out = '';
    while (p.i < p.s.length) {
      const c = p.s[p.i++];
      if (c === "'") {
        if (p.s[p.i] === "'") { out += "'"; p.i++; continue; }
        return out;
      }
      out += c;
    }
    return out;
  }

  /* ================= YAML EMITTER ================= */
  function emitYAML(obj, indentSize) {
    return emit(obj, 0, indentSize).replace(/\n+$/, '') + '\n';
  }

  function emit(val, indent, step) {
    if (val === null || val === undefined) return 'null\n';
    if (typeof val === 'boolean') return (val ? 'true' : 'false') + '\n';
    if (typeof val === 'number') {
      if (!isFinite(val)) return (val > 0 ? '.inf' : '-.inf') + '\n';
      if (isNaN(val)) return '.nan\n';
      return String(val) + '\n';
    }
    if (typeof val === 'string') return emitString(val, indent, step);
    if (Array.isArray(val)) {
      if (val.length === 0) return '[]\n';
      let out = '';
      for (const item of val) {
        const pad = ' '.repeat(indent);
        if (item === null) out += pad + '- null\n';
        else if (typeof item !== 'object') {
          out += pad + '- ' + emitScalarInline(item) + '\n';
        } else if (Array.isArray(item)) {
          if (item.length === 0) out += pad + '- []\n';
          else {
            out += pad + '-\n' + emit(item, indent + step, step);
          }
        } else {
          const keys = Object.keys(item);
          if (keys.length === 0) out += pad + '- {}\n';
          else {
            // inline first key with dash
            const nested = emit(item, indent + step, step);
            const lines = nested.split('\n');
            // Find first non-empty
            let firstIdx = 0;
            while (firstIdx < lines.length && lines[firstIdx].trim() === '') firstIdx++;
            if (firstIdx < lines.length) {
              const trimmed = lines[firstIdx].slice(indent + step);
              out += pad + '- ' + trimmed + '\n';
              for (let j = firstIdx + 1; j < lines.length; j++) {
                if (lines[j] !== '') out += lines[j] + '\n';
              }
            } else {
              out += pad + '- {}\n';
            }
          }
        }
      }
      return out;
    }
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) return '{}\n';
      let out = '';
      const pad = ' '.repeat(indent);
      for (const k of keys) {
        const v = val[k];
        const kStr = emitKey(k);
        if (v === null || v === undefined) { out += pad + kStr + ': null\n'; continue; }
        if (typeof v !== 'object') {
          if (typeof v === 'string' && v.includes('\n')) {
            out += pad + kStr + ': |\n' + indentString(v, indent + step) + '\n';
          } else {
            out += pad + kStr + ': ' + emitScalarInline(v) + '\n';
          }
        } else if (Array.isArray(v)) {
          if (v.length === 0) out += pad + kStr + ': []\n';
          else out += pad + kStr + ':\n' + emit(v, indent, step);
        } else {
          const sub = emit(v, indent + step, step);
          if (sub.trim() === '{}') out += pad + kStr + ': {}\n';
          else out += pad + kStr + ':\n' + sub;
        }
      }
      return out;
    }
    return String(val) + '\n';
  }

  function indentString(s, n) {
    const pad = ' '.repeat(n);
    return s.split('\n').map(l => pad + l).join('\n');
  }

  function emitString(s, indent, step) {
    if (s.includes('\n')) return '|\n' + indentString(s, indent) + '\n';
    return emitScalarInline(s) + '\n';
  }

  function emitKey(k) {
    if (/^[A-Za-z_][\w-]*$/.test(k) && !isReservedWord(k)) return k;
    return JSON.stringify(k);
  }

  function isReservedWord(k) {
    return /^(true|false|null|yes|no|on|off|True|False|Null|TRUE|FALSE|NULL)$/.test(k);
  }

  function emitScalarInline(v) {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'number') {
      if (!isFinite(v)) return v > 0 ? '.inf' : '-.inf';
      if (isNaN(v)) return '.nan';
      return String(v);
    }
    if (typeof v === 'string') {
      if (needsQuoting(v)) {
        return JSON.stringify(v);
      }
      return v;
    }
    return JSON.stringify(v);
  }

  function needsQuoting(s) {
    if (s === '') return true;
    if (/^\s|\s$/.test(s)) return true;
    if (/^(true|false|null|yes|no|on|off|True|False|Null|TRUE|FALSE|NULL|~)$/.test(s)) return true;
    if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(s)) return true;
    if (/^0x[0-9a-fA-F]+$/.test(s)) return true;
    if (/[:#]\s/.test(s)) return true;
    if (/^[\-?:,\[\]{}#&*!|>'"%@`]/.test(s)) return true;
    if (/[\x00-\x1F]/.test(s)) return true;
    return false;
  }

  /* ================= UI ================= */
  function currentIndent() { return parseInt(indentSel.value, 10) || 2; }

  function detectIsJSON(text) {
    const t = text.trim();
    return t.startsWith('{') || t.startsWith('[') || t.startsWith('"');
  }

  function showError(msg) {
    errBox.style.display = 'block';
    errBox.innerHTML = '<strong>Error</strong>' + escapeHTML(msg);
    okBox.style.display = 'none';
  }
  function showSuccess(msg) {
    okBox.style.display = 'block';
    okBox.textContent = msg;
    errBox.style.display = 'none';
  }
  function clearMsg() { okBox.style.display = 'none'; errBox.style.display = 'none'; }
  function escapeHTML(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

  function runYAMLtoJSON() {
    clearMsg();
    try {
      const parsed = parseYAML(inputEl.value);
      outputEl.value = JSON.stringify(parsed, null, currentIndent());
      updateStats();
      showSuccess('Converted YAML to JSON');
    } catch (e) { showError(e.message); }
  }
  function runJSONtoYAML() {
    clearMsg();
    try {
      const obj = JSON.parse(inputEl.value);
      outputEl.value = emitYAML(obj, currentIndent());
      updateStats();
      showSuccess('Converted JSON to YAML');
    } catch (e) { showError('JSON parse: ' + e.message); }
  }
  function runFormatYAML() {
    clearMsg();
    try {
      const parsed = parseYAML(inputEl.value);
      outputEl.value = emitYAML(parsed, currentIndent());
      updateStats();
      showSuccess('Formatted YAML');
    } catch (e) { showError(e.message); }
  }
  function runFormatJSON() {
    clearMsg();
    try {
      const obj = JSON.parse(inputEl.value);
      outputEl.value = JSON.stringify(obj, null, currentIndent());
      updateStats();
      showSuccess('Formatted JSON');
    } catch (e) { showError('JSON parse: ' + e.message); }
  }
  function autoRun() {
    if (!inputEl.value.trim()) { outputEl.value = ''; updateStats(); return; }
    if (detectIsJSON(inputEl.value)) runJSONtoYAML();
    else runYAMLtoJSON();
  }
  function updateStats() {
    statsIn.textContent = inputEl.value.length + ' chars';
    statsOut.textContent = outputEl.value.length + ' chars';
  }
  function swap() {
    const t = inputEl.value; inputEl.value = outputEl.value; outputEl.value = t; updateStats();
  }
  function clearAll() {
    inputEl.value = ''; outputEl.value = ''; updateStats(); clearMsg();
  }
  function copyOut() {
    if (!outputEl.value) return;
    navigator.clipboard.writeText(outputEl.value).then(() => showSuccess('Copied to clipboard'));
  }

  document.getElementById('btn-y2j').addEventListener('click', runYAMLtoJSON);
  document.getElementById('btn-j2y').addEventListener('click', runJSONtoYAML);
  document.getElementById('btn-fy').addEventListener('click', runFormatYAML);
  document.getElementById('btn-fj').addEventListener('click', runFormatJSON);
  document.getElementById('btn-swap').addEventListener('click', swap);
  document.getElementById('btn-copy').addEventListener('click', copyOut);
  document.getElementById('btn-clear').addEventListener('click', clearAll);
  indentSel.addEventListener('change', autoRun);
  inputEl.addEventListener('input', () => { updateStats(); });

  // sample
  inputEl.value = 'name: SharpDev\nversion: 1.0\nfeatures:\n  - yaml\n  - json\n  - validation\ndefaults: &defs\n  timeout: 30\n  retries: 3\nprod:\n  <<: *defs\n  host: example.com\nnote: |\n  Multi-line\n  preserved exactly.\n';
  autoRun();
})();
