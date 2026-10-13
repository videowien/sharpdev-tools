/**
 * Speech-to-Text — Web Speech API SpeechRecognition
 */

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const langEl = document.getElementById('lang');
const recordBtn = document.getElementById('record-btn');
const output = document.getElementById('output');
const statusMsg = document.getElementById('status-msg');
const warnCard = document.getElementById('warn-card');
const mainCard = document.getElementById('main-card');

if (!SR) {
  warnCard.style.display = '';
  mainCard.style.display = 'none';
}

let rec = null;
let recording = false;
let finalText = '';

function start() {
  if (!SR) return;
  rec = new SR();
  rec.lang = langEl.value;
  rec.continuous = true;
  rec.interimResults = true;
  finalText = output.value;
  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) {
        finalText += r[0].transcript;
      } else {
        interim += r[0].transcript;
      }
    }
    output.value = finalText + interim;
  };
  rec.onerror = (e) => {
    statusMsg.textContent = 'Error: ' + e.error;
    statusMsg.className = 'status-msg error';
    stop();
  };
  rec.onend = () => {
    // If still meant to be recording, restart (continuous can drop after silence)
    if (recording) rec.start();
  };
  rec.start();
  recording = true;
  recordBtn.textContent = '■ Stop recording';
  recordBtn.classList.add('recording');
  statusMsg.textContent = 'Listening… speak into your mic';
  statusMsg.className = 'status-msg busy';
}

function stop() {
  recording = false;
  if (rec) { try { rec.stop(); } catch (_) {} rec = null; }
  recordBtn.textContent = '🎤 Start recording';
  recordBtn.classList.remove('recording');
  if (statusMsg.textContent.startsWith('Listening')) statusMsg.textContent = '';
}

recordBtn.addEventListener('click', () => { recording ? stop() : start(); });

document.getElementById('copy-btn').addEventListener('click', async () => {
  if (!output.value) return;
  await navigator.clipboard.writeText(output.value);
  flash('✓ Copied', 'ok');
});
document.getElementById('dl-btn').addEventListener('click', () => {
  if (!output.value) return;
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'transcript.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ Downloaded', 'ok');
});
document.getElementById('clear-btn').addEventListener('click', () => { output.value = ''; finalText = ''; });

function flash(msg, cls) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg ' + cls;
  setTimeout(() => { if (!recording) statusMsg.textContent = ''; }, 1800);
}
