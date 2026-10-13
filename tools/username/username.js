/**
 * Username Generator — themed wordlists × style + suffix
 */

const WORDS = {
  general: {
    adj: ['swift', 'bright', 'cosmic', 'golden', 'silent', 'wild', 'pixel', 'velvet', 'crimson', 'azure', 'lucid', 'arctic', 'electric', 'lunar', 'mystic', 'sunny', 'crystal', 'orbit', 'misty', 'feral'],
    noun: ['fox', 'wolf', 'falcon', 'wave', 'echo', 'tide', 'comet', 'spark', 'ember', 'forest', 'river', 'dust', 'breeze', 'frost', 'meadow', 'storm', 'haze', 'star', 'cloud', 'flame'],
  },
  professional: {
    adj: ['steady', 'clean', 'sharp', 'modern', 'precise', 'fluent', 'humble', 'patient', 'curious', 'driven', 'frank', 'open', 'gentle', 'crafted', 'global', 'core', 'true', 'simple', 'practical', 'kind'],
    noun: ['builder', 'maker', 'thinker', 'writer', 'finder', 'planner', 'mentor', 'guide', 'studio', 'craft', 'works', 'lab', 'desk', 'forge', 'mind', 'group', 'co', 'team', 'partner', 'host'],
  },
  gamer: {
    adj: ['toxic', 'shadow', 'silent', 'reaper', 'rapid', 'ghost', 'savage', 'apex', 'rogue', 'venom', 'frost', 'iron', 'mythic', 'omega', 'storm', 'feral', 'crit', 'turbo', 'phantom', 'beast'],
    noun: ['slayer', 'reaper', 'sniper', 'wraith', 'blade', 'hunter', 'ace', 'lord', 'wizard', 'fang', 'havoc', 'fury', 'edge', 'rush', 'doom', 'pulse', 'wraith', 'ranger', 'ghost', 'spawn'],
  },
  cute: {
    adj: ['soft', 'sweet', 'fluffy', 'tiny', 'sleepy', 'bubble', 'sugar', 'cozy', 'cherry', 'peachy', 'mellow', 'cotton', 'honey', 'milky', 'glittery', 'sparkly', 'rosy', 'cloudy', 'sunny', 'dreamy'],
    noun: ['bunny', 'kitten', 'mochi', 'plum', 'peach', 'dumpling', 'puff', 'cloud', 'star', 'moon', 'cake', 'berry', 'pudding', 'cookie', 'sprout', 'biscuit', 'bean', 'dove', 'petal', 'lily'],
  },
  dev: {
    adj: ['async', 'compiled', 'recursive', 'lambda', 'curried', 'modular', 'reactive', 'pure', 'tagged', 'typed', 'parallel', 'lazy', 'sealed', 'forked', 'atomic', 'binary', 'unsafe', 'mutable', 'idle', 'pinned'],
    noun: ['parser', 'token', 'kernel', 'daemon', 'cursor', 'pointer', 'lambda', 'closure', 'mutex', 'buffer', 'stream', 'codec', 'reducer', 'fragment', 'shard', 'thread', 'commit', 'patch', 'fork', 'mirror'],
  },
  dark: {
    adj: ['midnight', 'obsidian', 'crimson', 'hollow', 'fading', 'broken', 'ashen', 'shadow', 'iron', 'frozen', 'ruined', 'silent', 'pale', 'sunken', 'thorned', 'bleak', 'silver', 'velvet', 'lost', 'graven'],
    noun: ['wraith', 'crow', 'ash', 'rust', 'embers', 'omen', 'pyre', 'thorn', 'requiem', 'reverie', 'spectre', 'echo', 'vesper', 'memento', 'cinder', 'fang', 'oath', 'veil', 'pyre', 'ruin'],
  },
};

const themeEl = document.getElementById('theme');
const styleEl = document.getElementById('style');
const suffixEl = document.getElementById('suffix');
const maxlenEl = document.getElementById('maxlen');
const results = document.getElementById('results');

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function joinWords(a, b, style) {
  const sep = { snake: '_', hyphen: '-', lower: '', camel: '', pascal: '' }[style];
  if (style === 'camel') return a.toLowerCase() + b.charAt(0).toUpperCase() + b.slice(1).toLowerCase();
  if (style === 'pascal') return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase() + b.charAt(0).toUpperCase() + b.slice(1).toLowerCase();
  return a.toLowerCase() + sep + b.toLowerCase();
}

function genSuffix() {
  const s = suffixEl.value;
  if (s === 'none') return '';
  if (s === 'num2') return String(Math.floor(Math.random() * 90) + 10);
  if (s === 'num3') return String(Math.floor(Math.random() * 900) + 100);
  if (s === 'num4') return String(Math.floor(Math.random() * 9000) + 1000);
  if (s === 'year') return String(new Date().getFullYear());
  return '';
}

function genOne() {
  const theme = WORDS[themeEl.value] || WORDS.general;
  const a = pick(theme.adj);
  const b = pick(theme.noun);
  let name = joinWords(a, b, styleEl.value);
  const suffix = genSuffix();
  if (suffix) {
    // Camel/pascal add directly, others need a join character only for snake/hyphen
    if (styleEl.value === 'snake') name += '_' + suffix;
    else if (styleEl.value === 'hyphen') name += '-' + suffix;
    else name += suffix;
  }
  return name;
}

function gen() {
  const max = Math.max(6, Math.min(40, parseInt(maxlenEl.value, 10) || 20));
  const out = new Set();
  let tries = 0;
  while (out.size < 12 && tries < 300) {
    const n = genOne();
    if (n.length <= max) out.add(n);
    tries++;
  }
  results.innerHTML = '';
  for (const n of out) {
    const div = document.createElement('div');
    div.className = 'uname-pill';
    div.textContent = n;
    div.addEventListener('click', () => {
      navigator.clipboard.writeText(n);
      div.classList.add('copied');
      setTimeout(() => div.classList.remove('copied'), 900);
    });
    results.appendChild(div);
  }
}

document.getElementById('gen-btn').addEventListener('click', gen);
gen();
