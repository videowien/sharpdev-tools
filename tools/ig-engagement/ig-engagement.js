/**
 * Instagram Engagement Rate Calculator — SharpDev Tools
 * (Likes + Comments) / Followers × 100, with a benchmark verdict.
 */

const followersEl = document.getElementById('followers');
const likesEl = document.getElementById('likes');
const commentsEl = document.getElementById('comments');
const erValue = document.getElementById('er-value');
const erBenchmark = document.getElementById('er-benchmark');
const erBreakdown = document.getElementById('er-breakdown');

// Tier definitions: { maxFollowers, avgLow, avgHigh, strongAbove }
const TIERS = [
  { maxFollowers: 5000,     name: 'Nano',      avgLow: 4,   avgHigh: 6,   strong: 7 },
  { maxFollowers: 50000,    name: 'Micro',     avgLow: 2,   avgHigh: 3,   strong: 4 },
  { maxFollowers: 500000,   name: 'Mid',       avgLow: 1,   avgHigh: 2,   strong: 2.5 },
  { maxFollowers: 1000000,  name: 'Macro',     avgLow: 0.8, avgHigh: 1.5, strong: 2 },
  { maxFollowers: Infinity, name: 'Celebrity', avgLow: 0.5, avgHigh: 1,   strong: 1.5 },
];

function verdict(er, tier) {
  if (er >= tier.strong) return { label: 'Excellent', cls: 'verdict-good' };
  if (er >= tier.avgHigh) return { label: 'Above average', cls: 'verdict-good' };
  if (er >= tier.avgLow) return { label: 'Average', cls: 'verdict-mid' };
  return { label: 'Below average', cls: 'verdict-low' };
}

function update() {
  const f = parseInt(followersEl.value, 10);
  const l = parseInt(likesEl.value, 10) || 0;
  const c = parseInt(commentsEl.value, 10) || 0;

  if (!f || f < 1) {
    erValue.textContent = '—';
    erBenchmark.textContent = '';
    erBreakdown.textContent = '';
    return;
  }
  const er = ((l + c) / f) * 100;
  erValue.textContent = er.toFixed(2) + '%';

  const tier = TIERS.find((t) => f <= t.maxFollowers);
  const v = verdict(er, tier);
  erBenchmark.innerHTML =
    '<span class="benchmark-tier">' + tier.name + ' tier</span>' +
    ' · average ' + tier.avgLow + '–' + tier.avgHigh + '% · strong above ' + tier.strong + '%' +
    ' → <span class="' + v.cls + '">' + v.label + '</span>';

  const totalEng = l + c;
  erBreakdown.innerHTML =
    '<div class="breakdown-item"><span>Total engagement</span><span>' + totalEng.toLocaleString() + '</span></div>' +
    '<div class="breakdown-item"><span>Followers</span><span>' + f.toLocaleString() + '</span></div>' +
    '<div class="breakdown-item"><span>Formula</span><span>(' + l + ' + ' + c + ') / ' + f + ' × 100</span></div>';
}

[followersEl, likesEl, commentsEl].forEach((el) => el.addEventListener('input', update));
update();
