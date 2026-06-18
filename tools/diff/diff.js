/**
 * Text Diff Checker — SharpDev Tools
 * 100% browser-side. Uses Myers diff algorithm for line-level + word-level diffs.
 */

let currentView = 'side';
let lastDiff = null;

function compare() {
  const a = document.getElementById('text-a').value;
  const b = document.getElementById('text-b').value;

  // Strip a single trailing newline so "hello" vs "hello\n" doesn't show a phantom line
  const aStripped = a.endsWith('\n') ? a.slice(0, -1) : a;
  const bStripped = b.endsWith('\n') ? b.slice(0, -1) : b;

  const linesA = aStripped.split('\n');
  const linesB = bStripped.split('\n');

  // Compute line-level diff using LCS
  const diff = diffLines(linesA, linesB);
  lastDiff = diff;

  // Count stats
  let added = 0, removed = 0, changed = 0, unchanged = 0;
  diff.forEach(d => {
    if (d.type === 'add') added++;
    else if (d.type === 'rm') removed++;
    else if (d.type === 'change') changed++;
    else unchanged++;
  });

  const statsEl = document.getElementById('stats');
  if (a === b) {
    statsEl.style.display = 'none';
    document.getElementById('result-side').style.display = 'none';
    document.getElementById('result-inline').style.display = 'none';
    document.getElementById('no-changes').style.display = 'block';
    return;
  }

  document.getElementById('no-changes').style.display = 'none';
  statsEl.style.display = 'flex';
  let statsHtml =
    `<span class="stat-added"><span class="stat-val">+${added}</span> added</span>` +
    `<span class="stat-removed"><span class="stat-val">-${removed}</span> removed</span>`;
  if (changed > 0) statsHtml += `<span class="stat-changed"><span class="stat-val">${changed}</span> modified</span>`;
  statsHtml +=
    `<span><span class="stat-val">${unchanged}</span> unchanged</span>` +
    `<span><span class="stat-val">${linesA.length}</span> → <span class="stat-val">${linesB.length}</span> lines</span>`;
  statsEl.innerHTML = statsHtml;

  renderDiff(diff);
}

function renderDiff(diff) {
  renderSideBySide(diff);
  renderInline(diff);

  if (currentView === 'side') {
    document.getElementById('result-side').style.display = 'grid';
    document.getElementById('result-inline').style.display = 'none';
  } else {
    document.getElementById('result-side').style.display = 'none';
    document.getElementById('result-inline').style.display = 'block';
  }
}

function renderSideBySide(diff) {
  const left = document.getElementById('diff-left');
  const right = document.getElementById('diff-right');
  let leftHtml = '';
  let rightHtml = '';
  let lineA = 0, lineB = 0;

  diff.forEach(d => {
    if (d.type === 'eq') {
      lineA++; lineB++;
      leftHtml += makeLine(lineA, escHtml(d.a), '');
      rightHtml += makeLine(lineB, escHtml(d.a), '');
    } else if (d.type === 'rm') {
      lineA++;
      leftHtml += makeLine(lineA, escHtml(d.a), 'removed');
      rightHtml += makeLine('', '', 'empty');
    } else if (d.type === 'add') {
      lineB++;
      leftHtml += makeLine('', '', 'empty');
      rightHtml += makeLine(lineB, escHtml(d.b), 'added');
    } else if (d.type === 'change') {
      lineA++; lineB++;
      const wordDiff = diffWords(d.a, d.b);
      leftHtml += makeLine(lineA, wordDiff.left, 'changed');
      rightHtml += makeLine(lineB, wordDiff.right, 'changed');
    }
  });

  left.innerHTML = leftHtml;
  right.innerHTML = rightHtml;
}

function renderInline(diff) {
  const el = document.getElementById('diff-inline');
  let html = '';
  let lineA = 0, lineB = 0;

  diff.forEach(d => {
    if (d.type === 'eq') {
      lineA++; lineB++;
      html += makeLine(lineA, escHtml(d.a), '');
    } else if (d.type === 'rm') {
      lineA++;
      html += makeLine(lineA, escHtml(d.a), 'removed');
    } else if (d.type === 'add') {
      lineB++;
      html += makeLine(lineB, escHtml(d.b), 'added');
    } else if (d.type === 'change') {
      lineA++; lineB++;
      const wordDiff = diffWords(d.a, d.b);
      html += makeLine(lineA, wordDiff.inline, 'changed');
    }
  });

  el.innerHTML = html;
}

function makeLine(num, text, cls) {
  return `<div class="diff-line ${cls}"><span class="diff-line-num">${num}</span><span class="diff-line-text">${text || '&nbsp;'}</span></div>`;
}

// --- Diff algorithm (LCS-based) ---

function diffLines(a, b) {
  const lcs = computeLCS(a, b);
  // First pass: produce pure add/rm/eq operations
  const ops = [];
  let i = 0, j = 0, k = 0;
  while (i < a.length || j < b.length) {
    if (k < lcs.length && i < a.length && j < b.length && a[i] === lcs[k] && b[j] === lcs[k]) {
      ops.push({ type: 'eq', a: a[i] });
      i++; j++; k++;
    } else if (i < a.length && (k >= lcs.length || a[i] !== lcs[k])) {
      ops.push({ type: 'rm', a: a[i] });
      i++;
    } else if (j < b.length && (k >= lcs.length || b[j] !== lcs[k])) {
      ops.push({ type: 'add', b: b[j] });
      j++;
    }
  }

  // Second pass: pair up rm + add blocks into 'change' ONLY when lines are similar
  // (avoids pairing unrelated insertions/deletions as false changes)
  const result = [];
  let p = 0;
  while (p < ops.length) {
    if (ops[p].type === 'rm') {
      // Collect consecutive rms
      const rms = [];
      while (p < ops.length && ops[p].type === 'rm') { rms.push(ops[p]); p++; }
      // Collect consecutive adds right after
      const adds = [];
      while (p < ops.length && ops[p].type === 'add') { adds.push(ops[p]); p++; }
      // Pair up as changes where similar, otherwise keep separate
      const pairCount = Math.min(rms.length, adds.length);
      for (let x = 0; x < pairCount; x++) {
        if (linesSimilar(rms[x].a, adds[x].b)) {
          result.push({ type: 'change', a: rms[x].a, b: adds[x].b });
        } else {
          result.push({ type: 'rm', a: rms[x].a });
          result.push({ type: 'add', b: adds[x].b });
        }
      }
      for (let x = pairCount; x < rms.length; x++) result.push(rms[x]);
      for (let x = pairCount; x < adds.length; x++) result.push(adds[x]);
    } else {
      result.push(ops[p]);
      p++;
    }
  }
  return result;
}

// Heuristic: consider two lines "similar enough" to show as a change (vs separate add/remove)
// if they share meaningful content. Short lines need more overlap; long lines tolerate more.
function linesSimilar(a, b) {
  if (!a.trim() || !b.trim()) return false;
  const wordsA = new Set(a.toLowerCase().match(/\S+/g) || []);
  const wordsB = new Set(b.toLowerCase().match(/\S+/g) || []);
  if (wordsA.size === 0 || wordsB.size === 0) return false;
  let shared = 0;
  for (const w of wordsA) if (wordsB.has(w)) shared++;
  const minSize = Math.min(wordsA.size, wordsB.size);
  // At least 30% of the smaller side's words must be shared
  return (shared / minSize) >= 0.3;
}

function computeLCS(a, b) {
  const m = a.length, n = b.length;

  // For very large texts, use a simpler O(n) space approach
  if (m * n > 5000000) return computeLCSHeuristic(a, b);

  const dp = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack
  const lcs = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      lcs.unshift(a[i - 1]);
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs;
}

// Faster heuristic for very large files: patience-style line matching
function computeLCSHeuristic(a, b) {
  const bSet = new Map();
  b.forEach((line, idx) => {
    if (!bSet.has(line)) bSet.set(line, []);
    bSet.get(line).push(idx);
  });

  const lcs = [];
  let lastJ = -1;
  for (let i = 0; i < a.length; i++) {
    const positions = bSet.get(a[i]);
    if (!positions) continue;
    // Find first position > lastJ
    for (const pos of positions) {
      if (pos > lastJ) {
        lcs.push(a[i]);
        lastJ = pos;
        break;
      }
    }
  }
  return lcs;
}

// --- Word-level diff ---

function diffWords(lineA, lineB) {
  const wordsA = tokenize(lineA);
  const wordsB = tokenize(lineB);
  const wordLCS = computeWordLCS(wordsA, wordsB);

  let leftHtml = '', rightHtml = '', inlineHtml = '';
  let ia = 0, ib = 0, ik = 0;

  while (ia < wordsA.length || ib < wordsB.length) {
    if (ik < wordLCS.length && ia < wordsA.length && ib < wordsB.length &&
        wordsA[ia] === wordLCS[ik] && wordsB[ib] === wordLCS[ik]) {
      const safe = escHtml(wordsA[ia]);
      leftHtml += safe;
      rightHtml += safe;
      inlineHtml += safe;
      ia++; ib++; ik++;
    } else if (ia < wordsA.length && (ik >= wordLCS.length || wordsA[ia] !== wordLCS[ik])) {
      leftHtml += `<span class="hl-rm">${escHtml(wordsA[ia])}</span>`;
      inlineHtml += `<span class="hl-rm">${escHtml(wordsA[ia])}</span>`;
      ia++;
    } else if (ib < wordsB.length && (ik >= wordLCS.length || wordsB[ib] !== wordLCS[ik])) {
      rightHtml += `<span class="hl-add">${escHtml(wordsB[ib])}</span>`;
      inlineHtml += `<span class="hl-add">${escHtml(wordsB[ib])}</span>`;
      ib++;
    }
  }

  return { left: leftHtml, right: rightHtml, inline: inlineHtml };
}

function tokenize(str) {
  // Split into words and whitespace tokens to preserve spacing
  return str.match(/\S+|\s+/g) || [];
}

function computeWordLCS(a, b) {
  const m = a.length, n = b.length;
  if (m * n > 500000) return computeLCSHeuristic(a, b);

  const dp = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const lcs = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { lcs.unshift(a[i - 1]); i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return lcs;
}

// --- Utilities ---

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setView(view) {
  currentView = view;
  document.getElementById('btn-side').classList.toggle('active', view === 'side');
  document.getElementById('btn-inline').classList.toggle('active', view === 'inline');

  if (!lastDiff) return;

  if (view === 'side') {
    document.getElementById('result-side').style.display = 'grid';
    document.getElementById('result-inline').style.display = 'none';
  } else {
    document.getElementById('result-side').style.display = 'none';
    document.getElementById('result-inline').style.display = 'block';
  }
}

function swapTexts() {
  const a = document.getElementById('text-a');
  const b = document.getElementById('text-b');
  const tmp = a.value;
  a.value = b.value;
  b.value = tmp;
}

function clearAll() {
  document.getElementById('text-a').value = '';
  document.getElementById('text-b').value = '';
  document.getElementById('stats').style.display = 'none';
  document.getElementById('result-side').style.display = 'none';
  document.getElementById('result-inline').style.display = 'none';
  document.getElementById('no-changes').style.display = 'none';
  lastDiff = null;
}
