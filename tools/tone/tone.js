/**
 * Tone Generator — Web Audio API oscillator
 */

const freqSlider = document.getElementById('freq-slider');
const freqNum = document.getElementById('freq-num');
const waveEl = document.getElementById('wave');
const volEl = document.getElementById('vol');
const volVal = document.getElementById('vol-val');
const channelEl = document.getElementById('channel');
const playBtn = document.getElementById('play-btn');

let ctx = null;
let osc = null;
let gain = null;
let panner = null;
let playing = false;

// Sync slider + number
freqSlider.addEventListener('input', () => { freqNum.value = freqSlider.value; updateOsc(); });
freqNum.addEventListener('input', () => {
  let v = Math.max(20, Math.min(20000, parseFloat(freqNum.value) || 440));
  freqSlider.value = v;
  updateOsc();
});

volEl.addEventListener('input', () => {
  volVal.textContent = volEl.value + '%';
  updateGain();
});

waveEl.addEventListener('change', () => { if (osc) osc.type = waveEl.value; });
channelEl.addEventListener('change', () => updatePan());

document.querySelectorAll('.preset').forEach(btn => {
  btn.addEventListener('click', () => {
    freqSlider.value = btn.dataset.freq;
    freqNum.value = btn.dataset.freq;
    updateOsc();
  });
});

playBtn.addEventListener('click', () => {
  if (playing) stop();
  else start();
});

function start() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  osc = ctx.createOscillator();
  gain = ctx.createGain();
  panner = ctx.createStereoPanner();
  osc.type = waveEl.value;
  osc.frequency.value = parseFloat(freqNum.value) || 440;
  updateGain();
  updatePan();
  osc.connect(gain).connect(panner).connect(ctx.destination);
  osc.start();
  playing = true;
  playBtn.classList.add('playing');
  playBtn.textContent = '■ Stop';
}

function stop() {
  if (osc) {
    // Quick fade to avoid pop
    if (gain) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
    setTimeout(() => {
      try { osc.stop(); osc.disconnect(); } catch (_) {}
      osc = null;
    }, 80);
  }
  playing = false;
  playBtn.classList.remove('playing');
  playBtn.textContent = '▶ Play';
}

function updateOsc() { if (osc) osc.frequency.setTargetAtTime(parseFloat(freqNum.value) || 440, ctx.currentTime, 0.01); }
function updateGain() {
  if (!gain || !ctx) return;
  // Convert linear 0-100 → 0-0.5 logarithmic-ish for safer perceived loudness
  const v = parseFloat(volEl.value) / 100;
  gain.gain.setTargetAtTime(v * 0.5, ctx.currentTime, 0.02);
}
function updatePan() {
  if (!panner || !ctx) return;
  const c = channelEl.value;
  panner.pan.setTargetAtTime(c === 'left' ? -1 : c === 'right' ? 1 : 0, ctx.currentTime, 0.02);
}
volVal.textContent = volEl.value + '%';
