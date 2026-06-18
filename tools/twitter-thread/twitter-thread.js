/**
 * Twitter Thread Builder — SharpDev Tools
 * Splits long text into Twitter-sized chunks at sentence/word boundaries.
 */

const inputText = document.getElementById('input-text');
const limitSel = document.getElementById('limit');
const numberingSel = document.getElementById('numbering');
const statsEl = document.getElementById('stats');
const output = document.getElementById('thread-output');

function fmtPrefix(idx, total, style) {
  if (style === 'none') return '';
  if (style === 'slash') return `${idx}/${total} `;
  if (style === 'dot') return `${idx}. `;
  if (style === 'paren') return `(${idx}/${total}) `;
  return '';
}

// Split text into chunks within a per-tweet char limit (accounting for
// the numbering prefix which gets added in front). Prefers sentence
// boundaries, then word boundaries, never breaks mid-word.
function splitThread(text, limit, numbering) {
  if (!text.trim()) return [];

  // Reserve room for the numbering prefix. We don't know N yet, so estimate
  // generously: 4 digits + "/" + 4 digits + space = 10 chars worst-case.
  const prefixReserve = numbering === 'none' ? 0 : 10;
  const chunkLimit = Math.max(20, limit - prefixReserve);

  const chunks = [];
  let rest = text.trim();

  while (rest.length > 0) {
    if (rest.length <= chunkLimit) {
      chunks.push(rest);
      break;
    }
    // Look for the last sentence boundary inside chunkLimit
    let cut = -1;
    const window = rest.slice(0, chunkLimit);
    const sentenceBoundaries = window.match(/[.!?]["')\]]*\s/g);
    if (sentenceBoundaries && sentenceBoundaries.length > 0) {
      const last = sentenceBoundaries[sentenceBoundaries.length - 1];
      cut = window.lastIndexOf(last) + last.length;
    }
    if (cut < 50) {
      // Sentence boundary too early (or none) — try last word boundary
      const lastSpace = window.lastIndexOf(' ');
      cut = lastSpace > 0 ? lastSpace + 1 : chunkLimit;
    }
    chunks.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }

  // Now add prefixes with the actual N
  const n = chunks.length;
  const prefixed = chunks.map((c, i) => {
    const pre = fmtPrefix(i + 1, n, numbering);
    return pre + c;
  });
  return prefixed;
}

function render() {
  const text = inputText.value;
  const limit = parseInt(limitSel.value, 10);
  const numbering = numberingSel.value;
  const tweets = splitThread(text, limit, numbering);

  output.innerHTML = '';
  if (!tweets.length) {
    statsEl.textContent = '';
    return;
  }

  const totalChars = text.length;
  statsEl.textContent = `${totalChars} characters → ${tweets.length} tweet${tweets.length === 1 ? '' : 's'} (${limit} per tweet)`;

  tweets.forEach((tweet, i) => {
    const tlen = tweet.length;
    const over = tlen > limit;
    const card = document.createElement('div');
    card.className = 'tweet-card' + (over ? ' over' : '');
    card.innerHTML =
      '<div class="tweet-header">' +
        '<span class="tweet-idx">Tweet ' + (i + 1) + ' of ' + tweets.length + '</span>' +
        '<span class="tweet-len' + (over ? ' over' : '') + '">' + tlen + ' / ' + limit + '</span>' +
      '</div>' +
      '<div class="tweet-body"></div>' +
      '<button class="btn btn-secondary btn-sm tweet-copy" type="button">Copy</button>';
    card.querySelector('.tweet-body').textContent = tweet;
    card.querySelector('.tweet-copy').addEventListener('click', async (e) => {
      await navigator.clipboard.writeText(tweet);
      const btn = e.target;
      const orig = btn.textContent;
      btn.textContent = '✓ Copied';
      setTimeout(() => { btn.textContent = orig; }, 1200);
    });
    output.appendChild(card);
  });

  // "Copy all" button at the top
  if (tweets.length > 1) {
    const allBtn = document.createElement('button');
    allBtn.className = 'btn btn-primary copy-all-btn';
    allBtn.type = 'button';
    allBtn.textContent = 'Copy entire thread';
    allBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(tweets.join('\n\n---\n\n'));
      allBtn.textContent = '✓ Copied (separated by ---)';
      setTimeout(() => { allBtn.textContent = 'Copy entire thread'; }, 1500);
    });
    output.insertBefore(allBtn, output.firstChild);
  }
}

inputText.addEventListener('input', render);
limitSel.addEventListener('change', render);
numberingSel.addEventListener('change', render);
