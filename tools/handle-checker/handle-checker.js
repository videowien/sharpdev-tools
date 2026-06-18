/**
 * Handle Format Checker — multi-platform regex validation
 */

const PLATFORMS = [
  { id: 'twitter',   name: 'Twitter / X',   icon: 'X',  color: '#1da1f2',
    rules: { min: 1, max: 15, regex: /^[A-Za-z0-9_]+$/, noLeadingDigit: false, note: '4-15 chars, letters/digits/underscore' } },
  { id: 'instagram', name: 'Instagram',     icon: 'IG', color: '#e1306c',
    rules: { min: 1, max: 30, regex: /^[A-Za-z0-9_.]+$/, noConsecutiveDots: true, noLeadingTrailingDot: true, note: '1-30 chars, letters/digits/underscore/dots' } },
  { id: 'tiktok',    name: 'TikTok',        icon: 'TT', color: '#fe2c55',
    rules: { min: 2, max: 24, regex: /^[A-Za-z0-9_.]+$/, note: '2-24 chars, letters/digits/underscore/dots' } },
  { id: 'github',    name: 'GitHub',        icon: 'GH', color: '#181717',
    rules: { min: 1, max: 39, regex: /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/, note: '1-39 chars, alphanumeric/hyphens, no consecutive or trailing hyphens' } },
  { id: 'reddit',    name: 'Reddit',        icon: 'r',  color: '#ff4500',
    rules: { min: 3, max: 20, regex: /^[A-Za-z0-9_-]+$/, note: '3-20 chars, letters/digits/underscore/hyphen' } },
  { id: 'youtube',   name: 'YouTube',       icon: 'YT', color: '#ff0000',
    rules: { min: 3, max: 30, regex: /^[A-Za-z0-9_.-]+$/, note: '3-30 chars, letters/digits/underscore/period/hyphen' } },
  { id: 'linkedin',  name: 'LinkedIn',      icon: 'in', color: '#0a66c2',
    rules: { min: 3, max: 100, regex: /^[A-Za-z0-9-]+$/, note: '3-100 chars, letters/digits/hyphen' } },
  { id: 'bluesky',   name: 'Bluesky',       icon: 'B',  color: '#1185fe',
    rules: { min: 1, max: 18, regex: /^[A-Za-z0-9-]+$/, noLeadingTrailingHyphen: true, note: 'subdomain rules: 1-18 chars, letters/digits/hyphens, no leading/trailing hyphen' } },
  { id: 'mastodon',  name: 'Mastodon',      icon: 'M',  color: '#6364ff',
    rules: { min: 1, max: 30, regex: /^[A-Za-z0-9_]+$/, note: '1-30 chars, letters/digits/underscore' } },
  { id: 'discord',   name: 'Discord',       icon: 'D',  color: '#5865f2',
    rules: { min: 2, max: 32, regex: /^[a-z0-9_.]+$/, noConsecutiveDots: true, note: '2-32 chars, lowercase only, letters/digits/underscore/dots' } },
  { id: 'threads',   name: 'Threads',       icon: 'T',  color: '#000000',
    rules: { min: 1, max: 30, regex: /^[A-Za-z0-9_.]+$/, noConsecutiveDots: true, note: 'inherits Instagram rules' } },
  { id: 'pinterest', name: 'Pinterest',     icon: 'P',  color: '#e60023',
    rules: { min: 3, max: 30, regex: /^[A-Za-z0-9_]+$/, note: '3-30 chars, letters/digits/underscore' } },
];

const handleEl = document.getElementById('handle');
const list = document.getElementById('platform-list');

function validate(handle, rules) {
  if (!handle) return { ok: false, reason: 'empty' };
  if (handle.length < rules.min) return { ok: false, reason: `too short (min ${rules.min})` };
  if (handle.length > rules.max) return { ok: false, reason: `too long (max ${rules.max})` };
  if (!rules.regex.test(handle)) return { ok: false, reason: 'invalid character(s)' };
  if (rules.noConsecutiveDots && /\.\./.test(handle)) return { ok: false, reason: 'consecutive dots' };
  if (rules.noLeadingTrailingDot && (handle.startsWith('.') || handle.endsWith('.'))) return { ok: false, reason: 'leading/trailing dot' };
  if (rules.noLeadingTrailingHyphen && (handle.startsWith('-') || handle.endsWith('-'))) return { ok: false, reason: 'leading/trailing hyphen' };
  return { ok: true };
}

function render() {
  const handle = handleEl.value.trim();
  list.innerHTML = '';
  for (const p of PLATFORMS) {
    const result = validate(handle, p.rules);
    const row = document.createElement('div');
    row.className = 'platform-row ' + (result.ok ? 'ok' : 'fail');
    row.innerHTML = `
      <div class="platform-icon" style="background:${p.color}">${p.icon}</div>
      <div class="platform-info">
        <div class="platform-name">${p.name}</div>
        <div class="platform-status ${result.ok ? 'ok' : 'fail'}">
          ${result.ok ? '✓ Valid format' : '✗ ' + result.reason}
        </div>
      </div>
    `;
    row.title = p.rules.note;
    list.appendChild(row);
  }
}

handleEl.addEventListener('input', render);
render();
