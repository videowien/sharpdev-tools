/**
 * Twitter/X Character Counter & Thread Splitter
 * Counts Unicode code points against the 280-char limit.
 * Auto-splits longer text into numbered thread tweets, preferring
 * sentence boundaries, then word boundaries, then hard cuts.
 */
const TW_LIMIT = 280;

const txt = document.getElementById('text-in');
const bar = document.getElementById('tw-bar');
const cnt = document.getElementById('tw-count');
const thrd = document.getElementById('tw-thread');
const meter = document.getElementById('tw-meter');
const out = document.getElementById('thread-output');

// Count by code points (grapheme-ish). Twitter has more nuanced counting
// (emojis = 2, CJK = 2, URLs = 23) — we count literal chars and note it in FAQ.
function codePointLength(str) {
  return [...str].length;
}

function chunkText(text, effLimit) {
  const chunks = [];
  let rest = text.trim();
  while (rest.length > 0) {
    const arr = [...rest];
    if (arr.length <= effLimit) {
      chunks.push(rest);
      break;
    }
    const window = arr.slice(0, effLimit).join('');
    // Prefer a sentence ending in the second half of the window
    let cut = -1;
    const sentenceCandidates = [
      window.lastIndexOf('. '),
      window.lastIndexOf('! '),
      window.lastIndexOf('? '),
      window.lastIndexOf('.\n'),
      window.lastIndexOf('!\n'),
      window.lastIndexOf('?\n'),
    ].filter(i => i >= 0);
    if (sentenceCandidates.length > 0) {
      const best = Math.max(...sentenceCandidates);
      if (best > effLimit * 0.5) cut = best + 1; // keep the punctuation
    }
    if (cut < 0) {
      // Fall back to last whitespace
      const ws = Math.max(window.lastIndexOf(' '), window.lastIndexOf('\n'));
      if (ws > effLimit * 0.3) cut = ws;
    }
    if (cut < 0) {
      // Hard cut
      cut = effLimit;
    }
    chunks.push([...rest].slice(0, cut).join('').trim());
    rest = [...rest].slice(cut).join('').trim();
  }
  return chunks;
}

function renderThread(chunks) {
  out.innerHTML = '';
  const n = chunks.length;

  // Copy-all button
  const allBtn = document.createElement('button');
  allBtn.className = 'copy-all-btn';
  allBtn.textContent = `Copy all ${n} tweets`;
  allBtn.addEventListener('click', async () => {
    const all = chunks.map((c, i) => `${c} ${i + 1}/${n}`).join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(all);
      allBtn.textContent = `Copied all ${n} tweets`;
      allBtn.classList.add('copied');
      setTimeout(() => {
        allBtn.textContent = `Copy all ${n} tweets`;
        allBtn.classList.remove('copied');
      }, 1600);
    } catch {
      allBtn.textContent = 'Copy failed';
    }
  });
  out.appendChild(allBtn);

  // Individual tweets
  chunks.forEach((chunk, i) => {
    const idx = `${i + 1}/${n}`;
    const body = `${chunk} ${idx}`;
    const bodyLen = codePointLength(body);

    const card = document.createElement('div');
    card.className = 'thread-tweet';

    const head = document.createElement('div');
    head.className = 'thread-tweet-head';
    const idxEl = document.createElement('span');
    idxEl.className = 'thread-tweet-idx';
    idxEl.textContent = idx;
    const cntEl = document.createElement('span');
    cntEl.className = 'thread-tweet-count';
    cntEl.textContent = `${bodyLen} / ${TW_LIMIT}`;
    head.appendChild(idxEl);
    head.appendChild(cntEl);

    const body_el = document.createElement('div');
    body_el.className = 'thread-tweet-text';
    body_el.textContent = body;

    const actions = document.createElement('div');
    actions.className = 'thread-tweet-actions';
    const btn = document.createElement('button');
    btn.className = 'thread-copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(body);
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1400);
      } catch {
        btn.textContent = 'Failed';
      }
    });
    actions.appendChild(btn);

    card.appendChild(head);
    card.appendChild(body_el);
    card.appendChild(actions);
    out.appendChild(card);
  });
}

function updateTwCount() {
  const text = txt.value;
  const len = codePointLength(text);
  cnt.textContent = len;

  const pct = Math.min(100, (len / TW_LIMIT) * 100);
  bar.style.width = pct + '%';
  bar.classList.remove('warn', 'over');
  meter.classList.remove('over');
  if (len > TW_LIMIT) {
    bar.classList.add('over');
    meter.classList.add('over');
  } else if (len > TW_LIMIT * 0.9) {
    bar.classList.add('warn');
  }

  if (len === 0 || len <= TW_LIMIT) {
    thrd.textContent = len === 0 ? '1 tweet' : '1 tweet';
    out.innerHTML = '';
    return;
  }

  // Estimate thread size so we know digit width for the suffix
  let estCount = Math.ceil(len / (TW_LIMIT - 8));
  const digits = String(estCount).length;
  const suffixLen = 1 /* space */ + digits + 1 /* slash */ + digits; // " 10/10"
  const effLimit = TW_LIMIT - suffixLen;

  let chunks = chunkText(text, effLimit);

  // Recompute: if the real chunk count shrank the digit width, redo with more headroom
  if (chunks.length < estCount) {
    const newDigits = String(chunks.length).length;
    if (newDigits < digits) {
      const newSuffix = 1 + newDigits + 1 + newDigits;
      chunks = chunkText(text, TW_LIMIT - newSuffix);
    }
  }

  thrd.textContent = `${chunks.length} tweets`;
  renderThread(chunks);
}

// Expose for inline oninput
window.updateTwCount = updateTwCount;
updateTwCount();
