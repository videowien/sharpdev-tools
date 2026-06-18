/**
 * Text-to-Speech via Web Speech API (speechSynthesis)
 */

const textEl = document.getElementById('text');
const voiceEl = document.getElementById('voice');
const rateEl = document.getElementById('rate');
const pitchEl = document.getElementById('pitch');
const volEl = document.getElementById('vol');
const rateVal = document.getElementById('rate-val');
const pitchVal = document.getElementById('pitch-val');
const volVal = document.getElementById('vol-val');
const speakBtn = document.getElementById('speak-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const statusMsg = document.getElementById('status-msg');

let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceEl.innerHTML = '';
  if (!voices.length) {
    voiceEl.innerHTML = '<option>(no voices available)</option>';
    return;
  }
  // Sort by language then name
  voices.sort((a, b) => (a.lang + a.name).localeCompare(b.lang + b.name));
  for (const v of voices) {
    const opt = document.createElement('option');
    opt.value = v.name;
    opt.textContent = `${v.name} (${v.lang})${v.localService ? '' : ' · remote'}`;
    if (v.default) opt.selected = true;
    voiceEl.appendChild(opt);
  }
}

if (typeof speechSynthesis === 'undefined') {
  statusMsg.textContent = '⚠ Your browser does not support speech synthesis.';
  statusMsg.className = 'status-msg error';
  speakBtn.disabled = true;
} else {
  loadVoices();
  speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

rateEl.addEventListener('input', () => { rateVal.textContent = parseFloat(rateEl.value).toFixed(1); });
pitchEl.addEventListener('input', () => { pitchVal.textContent = parseFloat(pitchEl.value).toFixed(1); });
volEl.addEventListener('input', () => { volVal.textContent = Math.round(parseFloat(volEl.value) * 100) + '%'; });

speakBtn.addEventListener('click', () => {
  if (!textEl.value.trim()) return;
  speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(textEl.value);
  const voice = voices.find(v => v.name === voiceEl.value);
  if (voice) utt.voice = voice;
  utt.rate = parseFloat(rateEl.value);
  utt.pitch = parseFloat(pitchEl.value);
  utt.volume = parseFloat(volEl.value);
  utt.onstart = () => {
    statusMsg.textContent = 'Speaking…';
    statusMsg.className = 'status-msg';
    pauseBtn.disabled = false; stopBtn.disabled = false;
  };
  utt.onend = () => {
    statusMsg.textContent = '';
    pauseBtn.disabled = true; stopBtn.disabled = true;
  };
  utt.onerror = (e) => {
    statusMsg.textContent = 'Error: ' + (e.error || 'failed');
    statusMsg.className = 'status-msg error';
  };
  speechSynthesis.speak(utt);
});

pauseBtn.addEventListener('click', () => {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    pauseBtn.textContent = '⏸ Pause';
  } else {
    speechSynthesis.pause();
    pauseBtn.textContent = '▶ Resume';
  }
});

stopBtn.addEventListener('click', () => {
  speechSynthesis.cancel();
  pauseBtn.textContent = '⏸ Pause';
  pauseBtn.disabled = true; stopBtn.disabled = true;
  statusMsg.textContent = '';
});
