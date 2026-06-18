/**
 * Color Converter — SharpDev Tools
 */

const NAMED = {
  aliceblue:'#F0F8FF', antiquewhite:'#FAEBD7', aqua:'#00FFFF', aquamarine:'#7FFFD4', azure:'#F0FFFF',
  beige:'#F5F5DC', bisque:'#FFE4C4', black:'#000000', blanchedalmond:'#FFEBCD', blue:'#0000FF',
  blueviolet:'#8A2BE2', brown:'#A52A2A', burlywood:'#DEB887', cadetblue:'#5F9EA0', chartreuse:'#7FFF00',
  chocolate:'#D2691E', coral:'#FF7F50', cornflowerblue:'#6495ED', cornsilk:'#FFF8DC', crimson:'#DC143C',
  cyan:'#00FFFF', darkblue:'#00008B', darkcyan:'#008B8B', darkgoldenrod:'#B8860B', darkgray:'#A9A9A9',
  darkgreen:'#006400', darkkhaki:'#BDB76B', darkmagenta:'#8B008B', darkolivegreen:'#556B2F',
  darkorange:'#FF8C00', darkorchid:'#9932CC', darkred:'#8B0000', darksalmon:'#E9967A',
  darkseagreen:'#8FBC8F', darkslateblue:'#483D8B', darkslategray:'#2F4F4F', darkturquoise:'#00CED1',
  darkviolet:'#9400D3', deeppink:'#FF1493', deepskyblue:'#00BFFF', dimgray:'#696969',
  dodgerblue:'#1E90FF', firebrick:'#B22222', floralwhite:'#FFFAF0', forestgreen:'#228B22',
  fuchsia:'#FF00FF', gainsboro:'#DCDCDC', ghostwhite:'#F8F8FF', gold:'#FFD700', goldenrod:'#DAA520',
  gray:'#808080', green:'#008000', greenyellow:'#ADFF2F', honeydew:'#F0FFF0', hotpink:'#FF69B4',
  indianred:'#CD5C5C', indigo:'#4B0082', ivory:'#FFFFF0', khaki:'#F0E68C', lavender:'#E6E6FA',
  lavenderblush:'#FFF0F5', lawngreen:'#7CFC00', lemonchiffon:'#FFFACD', lightblue:'#ADD8E6',
  lightcoral:'#F08080', lightcyan:'#E0FFFF', lightgoldenrodyellow:'#FAFAD2', lightgray:'#D3D3D3',
  lightgreen:'#90EE90', lightpink:'#FFB6C1', lightsalmon:'#FFA07A', lightseagreen:'#20B2AA',
  lightskyblue:'#87CEFA', lightslategray:'#778899', lightsteelblue:'#B0C4DE', lightyellow:'#FFFFE0',
  lime:'#00FF00', limegreen:'#32CD32', linen:'#FAF0E6', magenta:'#FF00FF', maroon:'#800000',
  mediumaquamarine:'#66CDAA', mediumblue:'#0000CD', mediumorchid:'#BA55D3', mediumpurple:'#9370DB',
  mediumseagreen:'#3CB371', mediumslateblue:'#7B68EE', mediumspringgreen:'#00FA9A',
  mediumturquoise:'#48D1CC', mediumvioletred:'#C71585', midnightblue:'#191970', mintcream:'#F5FFFA',
  mistyrose:'#FFE4E1', moccasin:'#FFE4B5', navajowhite:'#FFDEAD', navy:'#000080', oldlace:'#FDF5E6',
  olive:'#808000', olivedrab:'#6B8E23', orange:'#FFA500', orangered:'#FF4500', orchid:'#DA70D6',
  palegoldenrod:'#EEE8AA', palegreen:'#98FB98', paleturquoise:'#AFEEEE', palevioletred:'#DB7093',
  papayawhip:'#FFEFD5', peachpuff:'#FFDAB9', peru:'#CD853F', pink:'#FFC0CB', plum:'#DDA0DD',
  powderblue:'#B0E0E6', purple:'#800080', rebeccapurple:'#663399', red:'#FF0000', rosybrown:'#BC8F8F',
  royalblue:'#4169E1', saddlebrown:'#8B4513', salmon:'#FA8072', sandybrown:'#F4A460',
  seagreen:'#2E8B57', seashell:'#FFF5EE', sienna:'#A0522D', silver:'#C0C0C0', skyblue:'#87CEEB',
  slateblue:'#6A5ACD', slategray:'#708090', snow:'#FFFAFA', springgreen:'#00FF7F', steelblue:'#4682B4',
  tan:'#D2B48C', teal:'#008080', thistle:'#D8BFD8', tomato:'#FF6347', turquoise:'#40E0D0',
  violet:'#EE82EE', wheat:'#F5DEB3', white:'#FFFFFF', whitesmoke:'#F5F5F5', yellow:'#FFFF00',
  yellowgreen:'#9ACD32'
};

const parseEl = document.getElementById('parse-input');
const swatchEl = document.getElementById('swatch');
const pickerEl = document.getElementById('picker');
const alphaSlider = document.getElementById('alpha-slider');
const alphaVal = document.getElementById('alpha-val');

let current = { r: 255, g: 68, b: 68 };
let alpha = 1;

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function to2(n) { return n.toString(16).padStart(2, '0'); }

function rgbToHex(r, g, b) {
  return '#' + to2(Math.round(r)) + to2(Math.round(g)) + to2(Math.round(b));
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h, s = max === 0 ? 0 : d / max, v = max;
  if (max === min) h = 0;
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
}

function rgbToCmyk(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return { c: c * 100, m: m * 100, y: y * 100, k: k * 100 };
}

function parse(input) {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  // Named
  if (NAMED[s]) return parse(NAMED[s]);
  // HEX
  let m = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (m) {
    let hex = m[1];
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length === 4) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const a = hex.length === 8 ? parseInt(hex.substr(6, 2), 16) / 255 : null;
    return { r, g, b, a };
  }
  // rgb(a)
  m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (m) {
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : null };
  }
  // hsl(a)
  m = s.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (m) {
    const rgb = hslToRgb(+m[1], +m[2], +m[3]);
    return { ...rgb, a: m[4] !== undefined ? +m[4] : null };
  }
  // hsv
  m = s.match(/^hsva?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (m) {
    const h = +m[1], sv = +m[2] / 100, v = +m[3] / 100;
    // hsv -> rgb
    const c = v * sv;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const mVal = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return {
      r: (r + mVal) * 255, g: (g + mVal) * 255, b: (b + mVal) * 255,
      a: m[4] !== undefined ? +m[4] : null
    };
  }
  return null;
}

function nearestName(r, g, b) {
  let best = null, bestDist = Infinity;
  for (const [name, hex] of Object.entries(NAMED)) {
    const nr = parseInt(hex.substr(1, 2), 16);
    const ng = parseInt(hex.substr(3, 2), 16);
    const nb = parseInt(hex.substr(5, 2), 16);
    const d = (r - nr) ** 2 + (g - ng) ** 2 + (b - nb) ** 2;
    if (d < bestDist) { bestDist = d; best = name; }
  }
  return best;
}

function render() {
  const { r, g, b } = current;
  const ri = Math.round(r), gi = Math.round(g), bi = Math.round(b);
  const hex = rgbToHex(ri, gi, bi);
  const hsl = rgbToHsl(ri, gi, bi);
  const hsv = rgbToHsv(ri, gi, bi);
  const cmyk = rgbToCmyk(ri, gi, bi);

  swatchEl.style.background = alpha < 1
    ? `rgba(${ri},${gi},${bi},${alpha})`
    : hex;
  pickerEl.value = hex;

  document.getElementById('out-hex').value = hex;
  document.getElementById('out-rgb').value = `rgb(${ri}, ${gi}, ${bi})`;
  document.getElementById('out-rgba').value = `rgba(${ri}, ${gi}, ${bi}, ${alpha.toFixed(2)})`;
  document.getElementById('out-hsl').value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
  document.getElementById('out-hsv').value = `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`;
  document.getElementById('out-cmyk').value = `cmyk(${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%)`;
  document.getElementById('nearest-name').textContent = nearestName(ri, gi, bi);
  alphaVal.textContent = alpha.toFixed(2);

  renderHarmony(hsl);
}

function renderHarmony(hsl) {
  const mk = (h) => {
    const rgb = hslToRgb(((h % 360) + 360) % 360, hsl.s, hsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return hex;
  };
  const make = (hues) => hues.map(h => {
    const hex = mk(h);
    return `<div class="mini-swatch" style="background:${hex}" onclick="setHex('${hex}')"><span>${hex}</span></div>`;
  }).join('');

  document.getElementById('h-comp').innerHTML = make([hsl.h, hsl.h + 180]);
  document.getElementById('h-tri').innerHTML = make([hsl.h, hsl.h + 120, hsl.h + 240]);
  document.getElementById('h-ana').innerHTML = make([hsl.h - 60, hsl.h - 30, hsl.h, hsl.h + 30, hsl.h + 60]);
}

function setHex(hex) {
  const p = parse(hex);
  if (p) {
    current = { r: p.r, g: p.g, b: p.b };
    if (p.a !== null && p.a !== undefined) { alpha = p.a; alphaSlider.value = alpha; }
    parseEl.value = hex;
    parseEl.classList.remove('invalid');
    render();
  }
}

parseEl.addEventListener('input', () => {
  const p = parse(parseEl.value);
  if (p) {
    current = { r: p.r, g: p.g, b: p.b };
    if (p.a !== null && p.a !== undefined) { alpha = p.a; alphaSlider.value = alpha; }
    parseEl.classList.remove('invalid');
    render();
  } else if (parseEl.value.trim()) {
    parseEl.classList.add('invalid');
  } else {
    parseEl.classList.remove('invalid');
  }
});
parseEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const p = parse(parseEl.value);
    if (p) { parseEl.value = rgbToHex(Math.round(p.r), Math.round(p.g), Math.round(p.b)); }
  }
});

pickerEl.addEventListener('input', () => {
  setHex(pickerEl.value);
});

alphaSlider.addEventListener('input', () => {
  alpha = parseFloat(alphaSlider.value);
  render();
});

function copyField(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.value);
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 900);
}

parseEl.value = '#ff4444';
render();
