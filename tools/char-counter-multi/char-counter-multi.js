/**
 * Multi-Platform Character Counter — paste once, see limits across all
 */

const PLATFORMS = [
  { id: 'twitter',   name: 'Twitter / X',     limit: 280,   icon: 'X',   color: '#1da1f2', note: 'post' },
  { id: 'bluesky',   name: 'Bluesky',         limit: 300,   icon: 'B',   color: '#1185fe', note: 'post (graphemes)' },
  { id: 'threads',   name: 'Threads',         limit: 500,   icon: 'T',   color: '#000000', note: 'post' },
  { id: 'mastodon',  name: 'Mastodon',        limit: 500,   icon: 'M',   color: '#6364ff', note: 'default (many instances allow more)' },
  { id: 'pinterest', name: 'Pinterest',       limit: 500,   icon: 'P',   color: '#e60023', note: 'pin description' },
  { id: 'ig',        name: 'Instagram',       limit: 2200,  icon: 'IG',  color: '#e1306c', note: 'caption' },
  { id: 'tiktok',    name: 'TikTok',          limit: 2200,  icon: 'TT',  color: '#fe2c55', note: 'description' },
  { id: 'linkedin',  name: 'LinkedIn',        limit: 3000,  icon: 'in',  color: '#0a66c2', note: 'post (210 above "see more")' },
  { id: 'facebook',  name: 'Facebook',        limit: 63206, icon: 'F',   color: '#1877f2', note: 'post' },
];

const inputEl = document.getElementById('input');
const list = document.getElementById('platform-list');

const segmenter = (typeof Intl !== 'undefined' && Intl.Segmenter)
  ? new Intl.Segmenter('en', { granularity: 'grapheme' })
  : null;

function countGraphemes(s) {
  if (segmenter) {
    let n = 0; for (const _ of segmenter.segment(s)) n++; return n;
  }
  return [...s].length;
}

function render() {
  const text = inputEl.value;
  const count = countGraphemes(text);
  const words = (text.trim().match(/\S+/g) || []).length;
  const lines = text ? text.split('\n').length : 0;
  document.getElementById('char-count').textContent = count.toLocaleString();
  document.getElementById('word-count').textContent = words.toLocaleString();
  document.getElementById('line-count').textContent = lines.toLocaleString();

  list.innerHTML = '';
  for (const p of PLATFORMS) {
    const pct = (count / p.limit) * 100;
    const over = count > p.limit;
    const warn = !over && pct > 90;
    const remaining = p.limit - count;
    const row = document.createElement('div');
    row.className = 'platform-row' + (over ? ' over' : ' fits');
    row.innerHTML = `
      <div class="platform-icon" style="background:${p.color}">${p.icon}</div>
      <div class="platform-info">
        <div class="platform-name">${p.name} <span style="color:#666;font-weight:400">· ${p.note}</span></div>
        <div class="platform-meta">${count.toLocaleString()} / ${p.limit.toLocaleString()} characters</div>
        <div class="platform-bar"><div class="platform-fill ${over ? 'over' : warn ? 'warn' : ''}" style="width:${Math.min(100, pct).toFixed(1)}%"></div></div>
      </div>
      <div class="platform-status ${over ? 'over' : warn ? 'warn' : 'ok'}">
        ${over ? '−' + Math.abs(remaining).toLocaleString() : '+' + remaining.toLocaleString()}
      </div>
    `;
    list.appendChild(row);
  }
}

inputEl.addEventListener('input', render);
render();
