/**
 * IG Hashtag Mix Optimizer — parse tags + counts, bucket into tiers
 */

const inputEl = document.getElementById('input');
const resultCard = document.getElementById('result-card');

inputEl.value = `#travel 600M
#travelphotography 180M
#wandermore 1.2M
#cityphotography 800K
#viennatravel 45K
#sharpdevtools 800`;

const TIERS = [
  { id: 'mega',   label: 'Mega',   min: 10_000_000 },
  { id: 'large',  label: 'Large',  min: 1_000_000 },
  { id: 'medium', label: 'Medium', min: 100_000 },
  { id: 'niche',  label: 'Niche',  min: 10_000 },
  { id: 'micro',  label: 'Micro',  min: 0 },
];

function parseCount(s) {
  s = String(s).trim().toLowerCase().replace(/,/g, '');
  const m = s.match(/^([0-9]*\.?[0-9]+)\s*([kmbt]?)$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const suffix = m[2];
  if (suffix === 'k') return n * 1_000;
  if (suffix === 'm') return n * 1_000_000;
  if (suffix === 'b') return n * 1_000_000_000;
  if (suffix === 't') return n * 1_000_000_000_000;
  return n;
}

function parse() {
  const lines = inputEl.value.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  for (const line of lines) {
    const m = line.match(/^(#?\S+)\s+(.+)$/);
    if (!m) continue;
    const tag = m[1].startsWith('#') ? m[1] : '#' + m[1];
    const count = parseCount(m[2]);
    if (count === null) continue;
    items.push({ tag, count });
  }
  return items;
}

function tierFor(count) {
  for (const t of TIERS) if (count >= t.min) return t.id;
  return 'micro';
}

function render() {
  const items = parse();
  if (items.length === 0) { resultCard.style.display = 'none'; return; }
  resultCard.style.display = '';

  const byTier = Object.fromEntries(TIERS.map(t => [t.id, []]));
  for (const it of items) byTier[tierFor(it.count)].push(it);

  const total = items.length;
  const tierList = document.getElementById('tier-list');
  tierList.innerHTML = '';
  for (const t of TIERS) {
    const arr = byTier[t.id];
    if (arr.length === 0) continue;
    const pct = (arr.length / total) * 100;
    const row = document.createElement('div');
    row.className = 'tier-row';
    row.innerHTML = `
      <div class="tier-head">
        <span class="badge ${t.id}">${t.label}</span>
        <span class="tier-count">${arr.length} of ${total} (${pct.toFixed(0)}%)</span>
      </div>
      <div class="tier-bar"><div class="tier-fill ${t.id}" style="width:${pct}%"></div></div>
      <div class="tier-tags">${arr.map(a => `${a.tag} <span style="opacity:0.5">(${formatCount(a.count)})</span>`).join(' · ')}</div>
    `;
    tierList.appendChild(row);
  }

  // Summary feedback
  const counts = Object.fromEntries(TIERS.map(t => [t.id, byTier[t.id].length]));
  const small = counts.micro + counts.niche;
  const mid = counts.medium;
  const big = counts.large + counts.mega;
  let msg = '';
  if (total < 5) msg = '⚠ Add more hashtags — Instagram allows up to 30 per post.';
  else if (small / total < 0.3) msg = '⚠ Too many big tags. Add more niche / micro tags so small accounts can rank.';
  else if (big / total > 0.5) msg = '⚠ Mostly large/mega tags — these are highly competitive. Balance with medium and niche.';
  else if (mid / total > 0.7) msg = 'ℹ Heavily concentrated in medium tier. Some niche tags improve discoverability for smaller accounts.';
  else msg = '✓ Looks like a balanced mix.';
  document.getElementById('summary').innerHTML = msg;
}

function formatCount(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

inputEl.addEventListener('input', render);
render();
