/**
 * Audio Recorder — MediaRecorder API
 */

const recordBtn = document.getElementById('record-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const timer = document.getElementById('timer');
const status = document.getElementById('status');
const resultCard = document.getElementById('result-card');
const audioPreview = document.getElementById('audio-preview');
const statusMsg = document.getElementById('status-msg');

let mediaStream = null;
let recorder = null;
let chunks = [];
let startTime = 0;
let pausedAt = 0;
let totalPaused = 0;
let timerInterval = null;
let blob = null;
let mimeType = '';

recordBtn.addEventListener('click', async () => {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    status.textContent = '⚠ Your browser does not support audio recording.';
    return;
  }
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Pick the best supported mime
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
    mimeType = types.find(t => MediaRecorder.isTypeSupported(t)) || '';
    recorder = new MediaRecorder(mediaStream, mimeType ? { mimeType } : undefined);
    chunks = [];
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
      audioPreview.src = URL.createObjectURL(blob);
      resultCard.style.display = '';
      mediaStream.getTracks().forEach(t => t.stop());
      mediaStream = null;
    };
    recorder.start(250);
    startTime = Date.now();
    totalPaused = 0;
    timerInterval = setInterval(updateTimer, 200);
    recordBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    recordBtn.classList.add('recording');
    status.textContent = '🔴 Recording…';
    resultCard.style.display = 'none';
  } catch (err) {
    status.textContent = 'Mic access denied: ' + err.message;
  }
});

pauseBtn.addEventListener('click', () => {
  if (!recorder) return;
  if (recorder.state === 'recording') {
    recorder.pause();
    pausedAt = Date.now();
    clearInterval(timerInterval);
    pauseBtn.textContent = '▶ Resume';
    status.textContent = 'Paused';
  } else if (recorder.state === 'paused') {
    recorder.resume();
    totalPaused += Date.now() - pausedAt;
    timerInterval = setInterval(updateTimer, 200);
    pauseBtn.textContent = '⏸ Pause';
    status.textContent = '🔴 Recording…';
  }
});

stopBtn.addEventListener('click', () => {
  if (!recorder) return;
  recorder.stop();
  clearInterval(timerInterval);
  recordBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
  pauseBtn.textContent = '⏸ Pause';
  recordBtn.classList.remove('recording');
  status.textContent = 'Done — preview below';
});

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime - totalPaused) / 1000);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  timer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

document.getElementById('dl-btn').addEventListener('click', () => {
  if (!blob) return;
  const ext = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `recording-${Date.now()}.${ext}`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ Downloaded', 'ok');
});

document.getElementById('clear-btn').addEventListener('click', () => {
  blob = null;
  audioPreview.src = '';
  resultCard.style.display = 'none';
  timer.textContent = '00:00';
  status.textContent = 'Click Record. Your browser will ask for mic permission once.';
});

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg ' + cls;
  setTimeout(() => { statusMsg.textContent = ''; }, 1800);
}
