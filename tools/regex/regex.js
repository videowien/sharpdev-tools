/**
 * Regex Tester — SharpDev Tools
 */

const patternEl = document.getElementById('pattern');
const flagsEl = document.getElementById('flags');
const testEl = document.getElementById('test-input');
const highlightEl = document.getElementById('highlight');
const statusEl = document.getElementById('status');
const matchCountEl = document.getElementById('match-count');
const matchesListEl = document.getElementById('matches-list');
const replacementEl = document.getElementById('replacement');
const replacedEl = document.getElementById('replaced');

const PRESETS = {
  email: { pattern: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}", sample: "Contact jane.doe@example.com or admin+test@sub.domain.io for details." },
  url: { pattern: "https?:\\/\\/[\\w.-]+(?:\\:\\d+)?(?:\\/[^\\s]*)?", sample: "Visit https://example.com and http://sub.example.org/path?x=1 today." },
  ipv4: { pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", sample: "Gateway 192.168.1.1, DNS 8.8.8.8 and 10.0.0.254 available." },
  phone: { pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}", sample: "Call (415) 555-0137 or 212-555-0199 or 650.555.0178." },
  date: { pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b", sample: "Released 2024-08-19, updated 2025-01-07, EOL 2026-12-31." },
  hex: { pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", sample: "Palette: #ff4444, #0a0a0a, #fff, #1a2b3c, bad: #xyz." }
};

function setPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  patternEl.value = p.pattern;
  if (!testEl.value.trim()) testEl.value = p.sample;
  run();
}

function toggleFlag(cb) {
  const f = cb.getAttribute('data-flag');
  let cur = flagsEl.value;
  if (cb.checked) {
    if (!cur.includes(f)) cur += f;
  } else {
    cur = cur.replace(new RegExp(f, 'g'), '');
  }
  // Dedupe and keep order
  cur = [...new Set(cur.split(''))].join('');
  flagsEl.value = cur;
  run();
}

function syncFlagBoxes() {
  const cur = flagsEl.value;
  document.querySelectorAll('.flag input').forEach(cb => {
    cb.checked = cur.includes(cb.getAttribute('data-flag'));
  });
}

function buildRegex() {
  const p = patternEl.value;
  const f = flagsEl.value;
  if (!p) return null;
  return new RegExp(p, f);
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setStatus(cls, msg) {
  statusEl.className = 'status' + (cls ? ' ' + cls : '');
  statusEl.textContent = msg;
}

function run() {
  syncFlagBoxes();
  const text = testEl.value;
  const pattern = patternEl.value;

  if (!pattern) {
    setStatus('', 'Awaiting pattern');
    highlightEl.innerHTML = escHtml(text);
    matchesListEl.innerHTML = '';
    matchCountEl.textContent = '0';
    replacedEl.textContent = text;
    return;
  }

  let re;
  try {
    re = buildRegex();
  } catch (e) {
    setStatus('err', 'Invalid regex: ' + e.message);
    highlightEl.innerHTML = escHtml(text);
    matchesListEl.innerHTML = '';
    matchCountEl.textContent = '0';
    replacedEl.textContent = '';
    return;
  }

  // Gather matches
  const matches = [];
  try {
    if (re.global || re.sticky) {
      const gRe = new RegExp(re.source, re.flags);
      let m;
      let lastIndex = -1;
      let guard = 0;
      while ((m = gRe.exec(text)) !== null) {
        matches.push({ index: m.index, match: m[0], groups: m.slice(1) });
        if (m.index === lastIndex && m[0] === '') gRe.lastIndex++;
        lastIndex = m.index;
        if (++guard > 100000) break;
      }
    } else {
      const m = re.exec(text);
      if (m) matches.push({ index: m.index, match: m[0], groups: m.slice(1) });
    }
  } catch (e) {
    setStatus('err', 'Regex error: ' + e.message);
    return;
  }

  // Render highlighted
  renderHighlight(text, matches);

  // Status + count
  if (matches.length === 0) {
    setStatus('none', 'No matches');
  } else {
    setStatus('ok', `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`);
  }
  matchCountEl.textContent = matches.length;

  // Match list
  if (matches.length === 0) {
    matchesListEl.innerHTML = '<div class="match-item" style="color:#666">No matches.</div>';
  } else {
    matchesListEl.innerHTML = matches.slice(0, 500).map((m, i) => {
      let html = `<div class="match-item"><span class="idx">#${i} @ ${m.index}</span><span class="val">${escHtml(m.match)}</span>`;
      if (m.groups.length) {
        html += '<div class="groups">';
        m.groups.forEach((g, gi) => {
          html += `<div><span class="gnum">$${gi + 1}</span>${g === undefined ? '<em style="color:#555">(undefined)</em>' : escHtml(g)}</div>`;
        });
        html += '</div>';
      }
      html += '</div>';
      return html;
    }).join('');
    if (matches.length > 500) {
      matchesListEl.innerHTML += `<div class="match-item" style="color:#666">... and ${matches.length - 500} more.</div>`;
    }
  }

  // Replacement
  try {
    const repl = replacementEl.value;
    const gRe = re.global ? re : new RegExp(re.source, re.flags + 'g');
    replacedEl.textContent = text.replace(gRe, repl);
  } catch (e) {
    replacedEl.textContent = '(error: ' + e.message + ')';
  }
}

function renderHighlight(text, matches) {
  if (!matches.length) { highlightEl.innerHTML = escHtml(text) || '&nbsp;'; return; }
  let html = '';
  let cursor = 0;
  for (const m of matches) {
    if (m.index > cursor) html += escHtml(text.slice(cursor, m.index));
    // Build the matched chunk with group coloring
    const groups = m.groups || [];
    if (groups.length) {
      // Find positions of each group within m.match
      // Simple approach: re-run regex against m.match to get local indices
      const localRe = new RegExp(buildRegex().source);
      const local = localRe.exec(m.match);
      if (local) {
        let inner = '';
        let pos = 0;
        // Collect group positions by scanning
        const gPositions = [];
        let searchFrom = 0;
        for (let gi = 0; gi < groups.length; gi++) {
          const g = groups[gi];
          if (g === undefined || g === '') { gPositions.push(null); continue; }
          const idx = m.match.indexOf(g, searchFrom);
          if (idx === -1) { gPositions.push(null); continue; }
          gPositions.push({ start: idx, end: idx + g.length, gi });
          searchFrom = idx + g.length;
        }
        // Render
        const valid = gPositions.filter(Boolean).sort((a, b) => a.start - b.start);
        for (const gp of valid) {
          if (gp.start > pos) inner += escHtml(m.match.slice(pos, gp.start));
          const cls = 'g' + ((gp.gi % 5) + 1);
          inner += `<mark class="${cls}">${escHtml(m.match.slice(gp.start, gp.end))}</mark>`;
          pos = gp.end;
        }
        if (pos < m.match.length) inner += escHtml(m.match.slice(pos));
        html += `<mark>${inner}</mark>`;
      } else {
        html += `<mark>${escHtml(m.match)}</mark>`;
      }
    } else {
      html += `<mark>${escHtml(m.match)}</mark>`;
    }
    cursor = m.index + m.match.length;
    if (m.match.length === 0) cursor = m.index + 1; // avoid infinite loop on zero-width
  }
  if (cursor < text.length) html += escHtml(text.slice(cursor));
  highlightEl.innerHTML = html || '&nbsp;';
}

// Initial sample
patternEl.value = '(\\w+)@(\\w+\\.\\w+)';
testEl.value = 'Reach out to alice@example.com or bob@sharpdev.tools anytime.';
replacementEl.value = '[$1 at $2]';
run();
