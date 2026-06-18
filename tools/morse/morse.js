/**
 * Morse Code Translator — auto-direction, Web Audio playback at adjustable WPM.
 */
const MORSE = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
  'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
  'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
  'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  '!': '-.-.--', '/': '-..-.',  '(': '-.--.',  ')': '-.--.-',
  '&': '.-...',  ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.',  '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.'
};

const REVERSE = {};
Object.entries(MORSE).forEach(([k, v]) => { REVERSE[v] = k; });

const inEl = document.getElementById('in');
const outEl = document.getElementById('out');
const copyBtn = document.getElementById('copy-btn');
const playBtn = document.getElementById('play-btn');
const wpm = document.getElementById('wpm');
const wpmVal = document.getElementById('wpm-val');

// Detect input direction: if it contains only morse characters → decode
function looksLikeMorse(s) {
  if (!s.trim()) return false;
  return /^[.\-\s/]+$/.test(s.trim());
}

function textToMorse(s) {
  return s.toUpperCase().split('\n').map(line => {
    return line.split(/\s+/).map(word => {
      return [...word].map(ch => MORSE[ch] || '').filter(Boolean).join(' ');
    }).filter(Boolean).join(' / ');
  }).join('\n');
}

function morseToText(s) {
  return s.split('\n').map(line => {
    // Words separated by / or 3+ spaces
    return line.split(/\s*\/\s*|\s{3,}/).map(word => {
      return word.split(/\s+/).map(tok => REVERSE[tok] || '').join('');
    }).join(' ');
  }).join('\n');
}

function morseGo() {
  const raw = inEl.value;
  if (!raw) { outEl.value = ''; return; }
  outEl.value = looksLikeMorse(raw) ? morseToText(raw) : textToMorse(raw);
}

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(outEl.value);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

wpm.addEventListener('input', () => { wpmVal.textContent = `${wpm.value} wpm`; });

// ---- Audio playback ----
let audioCtx = null;
let playing = false;
let currentTimers = [];

function stopPlayback() {
  currentTimers.forEach(t => clearTimeout(t));
  currentTimers = [];
  playing = false;
  playBtn.textContent = '\u25B6 Play';
  playBtn.classList.remove('playing');
}

async function playMorse(morse) {
  if (playing) { stopPlayback(); return; }
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') await audioCtx.resume();

  // PARIS = 50 dot-units. WPM = 50 units / sec at W=1.
  const unitMs = 1200 / parseInt(wpm.value, 10);
  const freq = 650;

  playing = true;
  playBtn.textContent = '\u25A0 Stop';
  playBtn.classList.add('playing');

  let t = 0;
  const schedule = (durMs, tone) => {
    if (tone) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const startAt = audioCtx.currentTime + t / 1000;
      osc.start(startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.3, startAt + 0.005);
      gain.gain.setValueAtTime(0.3, startAt + (durMs - 5) / 1000);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durMs / 1000);
      osc.stop(startAt + durMs / 1000);
    }
    t += durMs;
  };

  for (const ch of morse) {
    if (ch === '.') { schedule(unitMs, true); schedule(unitMs, false); }
    else if (ch === '-') { schedule(unitMs * 3, true); schedule(unitMs, false); }
    else if (ch === ' ') { schedule(unitMs * 2, false); } // inter-letter (we already added 1 after tone)
    else if (ch === '/') { schedule(unitMs * 4, false); } // inter-word
    else if (ch === '\n') { schedule(unitMs * 6, false); }
  }
  const endTimer = setTimeout(stopPlayback, t + 100);
  currentTimers.push(endTimer);
}

playBtn.addEventListener('click', () => {
  const morseText = looksLikeMorse(inEl.value) ? inEl.value : outEl.value;
  if (!morseText.trim()) return;
  playMorse(morseText);
});

window.morseGo = morseGo;
