/**
 * WPM Typing Test
 */

const WORDS_COMMON = ['the','of','and','to','a','in','is','it','you','that','he','was','for','on','are','as','with','his','they','at','be','this','have','from','or','one','had','by','word','but','not','what','all','were','we','when','your','can','said','there','use','an','each','which','she','do','how','their','if','will','up','other','about','out','many','then','them','these','so','some','her','would','make','like','him','into','time','has','look','two','more','write','go','see','number','no','way','could','people','my','than','first','water','been','call','who','its','now','find','long','down','day','did','get','come','made','may','part','over','new','sound','take','only','little','work','know','place','year','live','me','back','give','most','very','after','thing','our','just','name','good','sentence','man','think','say','great','where','help','through','much','before','line','right','too','mean','old','any','same','tell','boy','follow','came','want','show','also','around','form','three','small','set','put','end'];

const WORDS_VARIED = ['quirky','melodious','threshold','whisper','algorithm','perpetual','undulate','spectrum','synthesize','calibrate','recursion','meridian','azimuth','filament','iridescent','tessellate','obfuscate','crystalline','meandering','traversal','gargantuan','vivacious','quintessence','laconic','meticulous','ostentatious','equivocal','perfunctory','sycophant','iconoclast','vicissitude','obstreperous','recalcitrant','indelible','sanguine','umbrage','ephemeral','quixotic','soliloquy','effervescent','luminescent','sublimate','transient','ineffable','impervious','salubrious','copacetic','perspicacious','garrulous'];

const WORDS_PUNCT = [];
for (let i = 0; i < 80; i++) {
  const base = (Math.random() < 0.7 ? WORDS_COMMON : WORDS_VARIED)[Math.floor(Math.random() * 200) % WORDS_COMMON.length];
  let w = base;
  if (Math.random() < 0.15) w = w.charAt(0).toUpperCase() + w.slice(1);
  if (Math.random() < 0.1) w += '.';
  else if (Math.random() < 0.1) w += ',';
  if (Math.random() < 0.05) w = String(Math.floor(Math.random() * 1000));
  WORDS_PUNCT.push(w);
}

let duration = 60;
let difficulty = 'common';
let words = [];
let cursor = 0; // current word index
let charCursor = 0; // within current word
let mistakes = 0;
let totalKeys = 0;
let correctKeys = 0;
let startedAt = null;
let endsAt = null;
let timer = null;
let done = false;

const display = document.getElementById('text-display');
const input = document.getElementById('input');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accEl = document.getElementById('acc');
const errEl = document.getElementById('err');
const resultCard = document.getElementById('result-card');
const difficultyEl = document.getElementById('difficulty');

document.querySelectorAll('[data-time]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-time]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    duration = parseInt(btn.dataset.time, 10);
    reset();
  });
});
difficultyEl.addEventListener('change', () => { difficulty = difficultyEl.value; reset(); });
document.getElementById('restart').addEventListener('click', reset);

function generateWords() {
  const source = difficulty === 'varied' ? WORDS_VARIED : difficulty === 'punctuation' ? WORDS_PUNCT : WORDS_COMMON;
  const out = [];
  for (let i = 0; i < 200; i++) out.push(source[Math.floor(Math.random() * source.length)]);
  return out;
}

function reset() {
  words = generateWords();
  cursor = 0; charCursor = 0; mistakes = 0; totalKeys = 0; correctKeys = 0;
  startedAt = null; endsAt = null;
  done = false;
  if (timer) { clearInterval(timer); timer = null; }
  resultCard.style.display = 'none';
  input.value = '';
  input.disabled = false;
  timeEl.textContent = duration + 's';
  wpmEl.textContent = '0'; accEl.textContent = '100%'; errEl.textContent = '0';
  renderText();
}

function renderText() {
  let html = '';
  for (let wi = 0; wi < words.length; wi++) {
    const w = words[wi];
    if (wi < cursor) {
      html += `<span class="ok">${escapeHtml(w)}</span> `;
    } else if (wi === cursor) {
      for (let ci = 0; ci < w.length; ci++) {
        if (ci === charCursor) html += `<span class="cursor">${escapeHtml(w[ci])}</span>`;
        else if (ci < charCursor) {
          const inputW = input.value.split(/\s+/).pop() || '';
          const ok = inputW[ci] === w[ci];
          html += `<span class="${ok ? 'ok' : 'wrong'}">${escapeHtml(w[ci])}</span>`;
        } else html += `<span class="pending">${escapeHtml(w[ci])}</span>`;
      }
      html += ' ';
    } else {
      html += `<span class="pending">${escapeHtml(w)}</span> `;
    }
    // Only render the first ~20 visible words to keep DOM small
    if (wi > cursor + 25) break;
  }
  display.innerHTML = html;
}

input.addEventListener('input', () => {
  if (done) return;
  if (!startedAt) {
    startedAt = Date.now();
    endsAt = startedAt + duration * 1000;
    timer = setInterval(tick, 100);
  }
  const value = input.value;
  // The "typed" view = current word from input, lookup vs words[cursor]
  // Determine current word boundary
  const parts = value.split(/ /);
  cursor = parts.length - 1; // Each space jumps to next word index
  const currentTyped = parts[parts.length - 1];
  charCursor = currentTyped.length;
  // Count mistakes
  totalKeys = value.length;
  correctKeys = 0;
  let errs = 0;
  for (let i = 0; i < parts.length; i++) {
    const target = words[i] || '';
    const got = parts[i];
    for (let c = 0; c < got.length; c++) {
      if (target[c] === got[c]) correctKeys++;
      else errs++;
    }
  }
  mistakes = errs;
  updateStats();
  renderText();
});

function updateStats() {
  if (!startedAt) return;
  const elapsedMin = Math.max(0.01, (Date.now() - startedAt) / 60000);
  const wpm = Math.round((correctKeys / 5) / elapsedMin);
  const acc = totalKeys ? Math.round((correctKeys / totalKeys) * 100) : 100;
  wpmEl.textContent = wpm;
  accEl.textContent = acc + '%';
  errEl.textContent = mistakes;
}

function tick() {
  const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
  timeEl.textContent = left + 's';
  updateStats();
  if (left === 0) finish();
}

function finish() {
  done = true;
  if (timer) { clearInterval(timer); timer = null; }
  input.disabled = true;
  updateStats();
  document.getElementById('r-wpm').textContent = wpmEl.textContent;
  document.getElementById('r-acc').textContent = accEl.textContent;
  document.getElementById('r-err').textContent = errEl.textContent;
  const wpm = parseInt(wpmEl.textContent, 10);
  let skill;
  if (wpm < 20) skill = 'Beginner';
  else if (wpm < 40) skill = 'Casual';
  else if (wpm < 60) skill = 'Average';
  else if (wpm < 80) skill = 'Pro touch typist';
  else if (wpm < 100) skill = 'Fast';
  else if (wpm < 150) skill = 'Competitive';
  else skill = 'World-class 🤯';
  document.getElementById('r-skill').textContent = skill;
  resultCard.style.display = '';
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

reset();
