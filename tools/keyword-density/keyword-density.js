/**
 * Keyword Density Analyzer — 1 / 2 / 3-word phrases
 */

const STOPWORDS = new Set(['the','of','and','to','a','in','is','it','you','that','he','was','for','on','are','as','with','his','they','i','at','be','this','have','from','or','one','had','by','word','but','not','what','all','were','we','when','your','can','said','there','use','an','each','which','she','do','how','their','if','will','up','other','about','out','many','then','them','these','so','some','her','would','make','like','him','into','time','has','look','two','more','write','go','see','number','no','way','could','people','my','than','first','water','been','call','who','its','now','find','long','down','day','did','get','come','made','may','part','i\'ve','i\'m','we\'re','they\'re','don\'t','doesn\'t','can\'t','won\'t','aren\'t','isn\'t','shouldn\'t','wouldn\'t','couldn\'t','am','also','any','here','our','us','very','just','only','should','being','because','before','after','though','through','during','where','while','those','same','such','own','too','again','further','once','over','under','off','below','above','between','out','against','about','around','among']);

const inputEl = document.getElementById('input');
const stopEl = document.getElementById('stopwords');
const minLenEl = document.getElementById('min-len');
const stat = document.getElementById('word-stat');

inputEl.value = `Free online tools for developers, writers and creators. Browse formatters, converters, generators, calculators, and design helpers. All tools run in your browser. No sign-up, no ads, no tracking. Free online tools you can trust. Built to be fast and minimal.`;

function tokenize(text) {
  return text.toLowerCase().split(/[^a-z0-9À-ſ'-]+/).filter(Boolean);
}

function isAllowed(w) {
  if (stopEl.checked && STOPWORDS.has(w)) return false;
  if (minLenEl.checked && w.length < 3) return false;
  if (/^\d+$/.test(w)) return false;
  return true;
}

function countNgrams(words, n) {
  const map = new Map();
  for (let i = 0; i <= words.length - n; i++) {
    const slice = words.slice(i, i + n);
    if (!slice.every(isAllowed)) continue;
    const key = slice.join(' ');
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
}

function analyse() {
  const words = tokenize(inputEl.value);
  const total = words.length;
  stat.textContent = `${total.toLocaleString()} words total`;

  const ngrams = [countNgrams(words, 1), countNgrams(words, 2), countNgrams(words, 3)];
  for (let n = 0; n < 3; n++) {
    const table = document.getElementById('t-' + (n + 1)).querySelector('tbody');
    table.innerHTML = '';
    if (!ngrams[n].length) { table.innerHTML = '<tr><td colspan="3" style="color:#555">none</td></tr>'; continue; }
    for (const [word, count] of ngrams[n]) {
      const density = total ? ((count * (n + 1)) / total * 100).toFixed(1) : '0';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escHtml(word)}</td><td>${count}</td><td>${density}%</td>`;
      table.appendChild(tr);
    }
  }
}

function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

[inputEl, stopEl, minLenEl].forEach(el => el.addEventListener('input', analyse));
stopEl.addEventListener('change', analyse);
minLenEl.addEventListener('change', analyse);

analyse();
