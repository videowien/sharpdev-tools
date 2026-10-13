(function () {
  const KEYWORDS_MULTI = [
    'GROUP BY', 'ORDER BY', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'FULL JOIN', 'FULL OUTER JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN',
    'CROSS JOIN', 'UNION ALL', 'INSERT INTO', 'IS NOT NULL', 'IS NULL',
    'NOT IN', 'NOT EXISTS', 'NOT LIKE', 'NOT BETWEEN',
  ];
  const KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'HAVING', 'LIMIT', 'OFFSET',
    'JOIN', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS',
    'NULL', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'UNION',
    'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP',
    'INDEX', 'TABLE', 'VIEW', 'VALUES', 'SET', 'DISTINCT', 'INTO',
    'RETURNING', 'WITH', 'DESC', 'ASC', 'BY', 'GROUP', 'ORDER',
    'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'CROSS',
    'TRUE', 'FALSE', 'ALL', 'ANY', 'SOME',
  ];
  const KEYWORDS_SET = new Set(KEYWORDS.map(k => k.toUpperCase()));

  // Major clause starters — newline + base indent
  const MAJOR = new Set([
    'SELECT', 'FROM', 'WHERE', 'HAVING', 'LIMIT', 'OFFSET',
    'GROUP BY', 'ORDER BY', 'UNION', 'UNION ALL',
    'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN',
    'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN', 'CROSS JOIN',
    'ON', 'VALUES', 'SET', 'RETURNING', 'WITH',
    'INSERT INTO', 'UPDATE', 'DELETE',
  ]);

  // ---- Tokenizer ----
  function tokenize(sql) {
    const tokens = [];
    let i = 0;
    const n = sql.length;
    while (i < n) {
      const c = sql[i];
      // whitespace
      if (/\s/.test(c)) {
        let j = i;
        while (j < n && /\s/.test(sql[j])) j++;
        tokens.push({ type: 'ws', value: sql.slice(i, j) });
        i = j; continue;
      }
      // line comment
      if (c === '-' && sql[i + 1] === '-') {
        let j = i;
        while (j < n && sql[j] !== '\n') j++;
        tokens.push({ type: 'lcom', value: sql.slice(i, j) });
        i = j; continue;
      }
      // block comment
      if (c === '/' && sql[i + 1] === '*') {
        let j = i + 2;
        while (j < n && !(sql[j] === '*' && sql[j + 1] === '/')) j++;
        j = Math.min(j + 2, n);
        tokens.push({ type: 'bcom', value: sql.slice(i, j) });
        i = j; continue;
      }
      // string (single-quote with '' escape)
      if (c === "'") {
        let j = i + 1;
        while (j < n) {
          if (sql[j] === "'" && sql[j + 1] === "'") { j += 2; continue; }
          if (sql[j] === "'") { j++; break; }
          j++;
        }
        tokens.push({ type: 'str', value: sql.slice(i, j) });
        i = j; continue;
      }
      // double-quoted identifier
      if (c === '"') {
        let j = i + 1;
        while (j < n && sql[j] !== '"') j++;
        j = Math.min(j + 1, n);
        tokens.push({ type: 'id', value: sql.slice(i, j) });
        i = j; continue;
      }
      // backtick identifier
      if (c === '`') {
        let j = i + 1;
        while (j < n && sql[j] !== '`') j++;
        j = Math.min(j + 1, n);
        tokens.push({ type: 'id', value: sql.slice(i, j) });
        i = j; continue;
      }
      // number
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(sql[i + 1]))) {
        let j = i;
        while (j < n && /[0-9.eE+\-]/.test(sql[j])) {
          if ((sql[j] === '+' || sql[j] === '-') && !/[eE]/.test(sql[j - 1])) break;
          j++;
        }
        tokens.push({ type: 'num', value: sql.slice(i, j) });
        i = j; continue;
      }
      // identifier or keyword
      if (/[A-Za-z_]/.test(c)) {
        let j = i;
        while (j < n && /[A-Za-z0-9_]/.test(sql[j])) j++;
        const word = sql.slice(i, j);
        const upper = word.toUpperCase();
        if (KEYWORDS_SET.has(upper)) tokens.push({ type: 'kw', value: word, upper });
        else tokens.push({ type: 'id', value: word });
        i = j; continue;
      }
      // punctuation/operators
      if (c === ',' || c === '(' || c === ')' || c === ';') {
        tokens.push({ type: 'punc', value: c });
        i++; continue;
      }
      // multi-char ops
      const two = sql.slice(i, i + 2);
      if (['>=', '<=', '<>', '!=', '||'].includes(two)) {
        tokens.push({ type: 'op', value: two });
        i += 2; continue;
      }
      tokens.push({ type: 'op', value: c });
      i++;
    }
    return tokens;
  }

  // Merge keyword-only tokens into multi-word clauses & drop whitespace for formatting
  function normalize(tokens) {
    // remove ws, preserve comments
    const out = [];
    for (const t of tokens) {
      if (t.type === 'ws') continue;
      out.push(t);
    }
    // merge multi-word keywords
    const merged = [];
    for (let i = 0; i < out.length; i++) {
      const t = out[i];
      if (t.type === 'kw') {
        let matched = null;
        for (const m of KEYWORDS_MULTI) {
          const parts = m.split(' ');
          if (parts.length === 2 && out[i]?.type === 'kw' && out[i + 1]?.type === 'kw'
              && out[i].upper === parts[0] && out[i + 1].upper === parts[1]) {
            matched = { type: 'kw', upper: m, value: out[i].value + ' ' + out[i + 1].value };
            i += 1;
            break;
          }
          if (parts.length === 3 && out[i]?.type === 'kw' && out[i + 1]?.type === 'kw' && out[i + 2]?.type === 'kw'
              && out[i].upper === parts[0] && out[i + 1].upper === parts[1] && out[i + 2].upper === parts[2]) {
            matched = { type: 'kw', upper: m, value: out[i].value + ' ' + out[i + 1].value + ' ' + out[i + 2].value };
            i += 2;
            break;
          }
        }
        merged.push(matched || t);
      } else {
        merged.push(t);
      }
    }
    return merged;
  }

  function caseKW(kwUpper, mode, original) {
    if (mode === 'upper') return kwUpper;
    if (mode === 'lower') return kwUpper.toLowerCase();
    return original;
  }

  function format(sql, opts) {
    const indent = opts.indent === 'tab' ? '\t' : ' '.repeat(parseInt(opts.indent));
    const kwCase = opts.kwCase;
    const commaStyle = opts.commaStyle;

    const raw = tokenize(sql);
    const toks = normalize(raw);

    let out = '';
    let depth = 0; // paren depth
    let baseIndent = 0;
    let newLine = true;
    let inSelectList = false; // after SELECT, before FROM
    let lastWasMajor = false;

    function nl() { out = out.replace(/[ \t]+$/, ''); out += '\n'; newLine = true; }
    function indentFor(extra) {
      return indent.repeat(baseIndent + depth + (extra || 0));
    }
    function writeToken(s) {
      if (newLine) { out += indentFor(0); newLine = false; }
      else if (!/\s$/.test(out) && !/^[),;]/.test(s) && out.length && !/[(\s]$/.test(out.slice(-1))) {
        out += ' ';
      }
      out += s;
    }

    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      if (t.type === 'kw' && MAJOR.has(t.upper)) {
        // newline before major keyword (except very first)
        if (out.trim().length) nl();
        inSelectList = (t.upper === 'SELECT');
        out += indentFor(0) + caseKW(t.upper, kwCase, t.value);
        newLine = false;
        lastWasMajor = true;
        // SELECT: put each column on its own line
        if (t.upper === 'SELECT' || t.upper === 'SET') {
          nl();
          // Write columns until next MAJOR at depth 0 or end
          let colBuf = '';
          let d = 0;
          const writeCol = () => {
            if (!colBuf.trim()) return;
            out += indentFor(1) + colBuf.trim();
            colBuf = '';
            nl();
          };
          let j = i + 1;
          for (; j < toks.length; j++) {
            const tt = toks[j];
            if (tt.type === 'punc' && tt.value === '(') d++;
            else if (tt.type === 'punc' && tt.value === ')') d--;
            if (d < 0) { break; }
            if (tt.type === 'kw' && MAJOR.has(tt.upper) && d === 0) break;
            if (tt.type === 'punc' && tt.value === ',' && d === 0) {
              if (commaStyle === 'end') {
                colBuf += ',';
                writeCol();
              } else {
                writeCol();
                out += indentFor(1).slice(0, -2) + ', ';
                newLine = false;
              }
            } else {
              colBuf = appendTok(colBuf, tt, kwCase);
            }
          }
          writeCol();
          i = j - 1;
          lastWasMajor = false;
          continue;
        }
        nl();
        // for ON / WHERE etc., write content with one level indent
        let j = i + 1;
        let d = 0;
        let line = '';
        const flush = () => {
          if (line.trim()) {
            out += indentFor(1) + line.trim();
            nl();
          }
          line = '';
        };
        for (; j < toks.length; j++) {
          const tt = toks[j];
          if (tt.type === 'punc' && tt.value === '(') d++;
          else if (tt.type === 'punc' && tt.value === ')') d--;
          if (d < 0) break;
          if (tt.type === 'kw' && MAJOR.has(tt.upper) && d === 0) break;
          // Break AND/OR in WHERE/ON
          if (d === 0 && tt.type === 'kw' && (tt.upper === 'AND' || tt.upper === 'OR')) {
            flush();
            line = caseKW(tt.upper, kwCase, tt.value) + ' ';
            continue;
          }
          if (tt.type === 'punc' && tt.value === ',' && d === 0) {
            if (commaStyle === 'end') { line = (line + ',').trim(); flush(); }
            else { flush(); line = ', '; }
            continue;
          }
          line = appendTok(line, tt, kwCase);
        }
        flush();
        i = j - 1;
        lastWasMajor = false;
        continue;
      }

      if (t.type === 'punc' && t.value === ';') {
        out = out.replace(/\s+$/, '') + ';\n';
        newLine = true;
        continue;
      }

      // fallback (comments, stray tokens)
      if (t.type === 'lcom' || t.type === 'bcom') {
        if (!newLine) out += ' ';
        out += t.value;
        nl();
        continue;
      }
      // Anything else (unexpected top-level)
      if (newLine) { out += indentFor(0); newLine = false; }
      else if (out && !/\s$/.test(out)) out += ' ';
      out += renderTok(t, kwCase);
    }

    return out.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  }

  function appendTok(buf, t, kwCase) {
    const s = renderTok(t, kwCase);
    if (!buf) return s;
    // no space before ), before comma, or after (
    if (/^[),]/.test(s)) return buf + s;
    if (/\($/.test(buf)) return buf + s;
    if (/\s$/.test(buf)) return buf + s;
    return buf + ' ' + s;
  }

  function renderTok(t, kwCase) {
    if (t.type === 'kw') return caseKW(t.upper, kwCase, t.value);
    return t.value;
  }

  function minify(sql) {
    const toks = tokenize(sql);
    let out = '';
    for (const t of toks) {
      if (t.type === 'ws') { if (out && !/[\s(,]$/.test(out)) out += ' '; continue; }
      if (t.type === 'lcom' || t.type === 'bcom') continue;
      if (t.type === 'punc' && (t.value === ',' || t.value === ';' || t.value === ')')) {
        out = out.replace(/\s+$/, '') + t.value + (t.value === ';' ? '' : '');
        continue;
      }
      if (t.type === 'punc' && t.value === '(') {
        out = out.replace(/\s+$/, '') + '(';
        continue;
      }
      out += t.value;
      if (t.type !== 'punc' || t.value !== '(') out += ' ';
    }
    return out.replace(/\s+/g, ' ').replace(/ ([,;)])/g, '$1').replace(/\( /g, '(').trim();
  }

  // ---- UI ----
  const inp = document.getElementById('input');
  const outp = document.getElementById('output');
  const statsIn = document.getElementById('stats-in');
  const statsOut = document.getElementById('stats-out');

  function opts() {
    return {
      indent: document.getElementById('opt-indent').value,
      kwCase: document.getElementById('opt-case').value,
      commaStyle: document.getElementById('opt-comma').value,
    };
  }

  window.doFormat = function () {
    try {
      const r = format(inp.value, opts());
      outp.value = r;
      updateStats();
    } catch (e) {
      outp.value = '-- Error: ' + e.message;
    }
  };
  window.doMinify = function () {
    outp.value = minify(inp.value);
    updateStats();
  };
  window.setCase = function (c) {
    document.getElementById('opt-case').value = c;
    doFormat();
  };
  window.swap = function () {
    inp.value = outp.value;
    outp.value = '';
    updateStats();
  };
  window.copyOut = function () {
    navigator.clipboard.writeText(outp.value).catch(() => {});
  };
  window.clearAll = function () {
    inp.value = ''; outp.value = ''; updateStats();
  };

  function updateStats() {
    const inChars = inp.value.length;
    const outChars = outp.value.length;
    const tokens = tokenize(inp.value).filter(t => t.type !== 'ws').length;
    const clauses = (outp.value.match(/^[A-Z]{2,}/gm) || []).length;
    statsIn.textContent = inChars + ' chars';
    statsOut.textContent = outChars + ' chars \u00b7 ' + clauses + ' clauses \u00b7 ' + tokens + ' tokens';
  }

  inp.addEventListener('input', updateStats);
  updateStats();
})();
