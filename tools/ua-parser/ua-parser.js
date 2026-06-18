/** Simple User-Agent parser — heuristic pattern matching */
const inp = document.getElementById('ua-in');
const grid = document.getElementById('ua-grid');
const flags = document.getElementById('ua-flags');
const useMineBtn = document.getElementById('use-mine');

// Order matters — more specific first
const BROWSERS = [
  ['Edge',      /Edg(?:e|A|iOS)?\/([\d.]+)/],
  ['Opera',     /OPR\/([\d.]+)/],
  ['Chrome',    /Chrome\/([\d.]+)/],
  ['Firefox',   /Firefox\/([\d.]+)/],
  ['Safari',    /Version\/([\d.]+).+Safari/],
  ['IE',        /MSIE ([\d.]+)|Trident.+rv:([\d.]+)/],
  ['Samsung',   /SamsungBrowser\/([\d.]+)/],
  ['Brave',     /Brave\/([\d.]+)/],
];
const ENGINES = [
  ['Blink',     /Chrome\/[\d.]+/],
  ['Gecko',     /rv:[\d.]+.*Gecko/],
  ['WebKit',    /AppleWebKit\/([\d.]+)/],
  ['Trident',   /Trident\/([\d.]+)/],
];
const OSES = [
  ['Windows 11',  /Windows NT 10.0.+(22|23|24)\d\d\d/],
  ['Windows 10',  /Windows NT 10\.0/],
  ['Windows 8.1', /Windows NT 6\.3/],
  ['Windows 8',   /Windows NT 6\.2/],
  ['Windows 7',   /Windows NT 6\.1/],
  ['Windows',     /Windows/],
  ['macOS',       /Mac OS X ([\d_]+)/],
  ['iOS',         /iPhone OS ([\d_]+)|iPad.+OS ([\d_]+)/],
  ['Android',     /Android ([\d.]+)/],
  ['Linux',       /Linux/],
  ['ChromeOS',    /CrOS/],
];

function match(patterns, ua) {
  for (const [name, rx] of patterns) {
    const m = ua.match(rx);
    if (m) {
      const ver = (m[1] || m[2] || '').replace(/_/g, '.');
      return { name, version: ver };
    }
  }
  return null;
}

function parse(ua) {
  const browser = match(BROWSERS, ua);
  const engine = match(ENGINES, ua);
  const os = match(OSES, ua);
  const mobile = /Mobi|Android|iPhone|iPad|iPod/.test(ua);
  const bot = /(bot|crawler|spider|crawling|googlebot|bingbot|duckduckbot|baiduspider)/i.test(ua);
  const device = /iPhone/.test(ua) ? 'iPhone'
    : /iPad/.test(ua) ? 'iPad'
    : /Android.+Tablet/i.test(ua) ? 'Android Tablet'
    : /Android/.test(ua) ? 'Android phone'
    : mobile ? 'Mobile'
    : 'Desktop';
  return { browser, engine, os, mobile, bot, device };
}

function card(k, name, version) {
  const d = document.createElement('div');
  d.className = 'ua-card';
  const kEl = document.createElement('div');
  kEl.className = 'k';
  kEl.textContent = k;
  const vEl = document.createElement('div');
  vEl.className = 'v';
  vEl.textContent = name || 'Unknown';
  d.append(kEl, vEl);
  if (version) {
    const subEl = document.createElement('div');
    subEl.className = 'sub';
    subEl.textContent = version;
    d.appendChild(subEl);
  }
  return d;
}

function uaGo() {
  const ua = inp.value.trim();
  grid.innerHTML = ''; flags.innerHTML = '';
  if (!ua) return;
  const p = parse(ua);
  grid.append(
    card('Browser', p.browser?.name, p.browser?.version),
    card('Engine', p.engine?.name, p.engine?.version),
    card('Operating system', p.os?.name, p.os?.version),
    card('Device', p.device),
  );
  const fArr = [
    { label: 'Mobile', on: p.mobile },
    { label: 'Desktop', on: !p.mobile },
    { label: 'Bot / crawler', on: p.bot },
  ];
  fArr.forEach(f => {
    const el = document.createElement('span');
    el.className = 'ua-flag' + (f.on ? ' on' : '');
    el.textContent = (f.on ? '\u2713 ' : '') + f.label;
    flags.appendChild(el);
  });
}

useMineBtn.addEventListener('click', () => { inp.value = navigator.userAgent; uaGo(); });
window.uaGo = uaGo;

// Autofill on load
inp.value = navigator.userAgent;
uaGo();
