/**
 * Word Counter — SharpDev Tools
 * Real-time word, character, sentence, paragraph counting.
 * 100% browser-side.
 */

const textInput = document.getElementById('text-input');

// Stats elements
const sWords = document.getElementById('s-words');
const sChars = document.getElementById('s-chars');
const sCharsNs = document.getElementById('s-chars-ns');
const sSentences = document.getElementById('s-sentences');
const sParagraphs = document.getElementById('s-paragraphs');
const dReadtime = document.getElementById('d-readtime');
const dSpeaktime = document.getElementById('d-speaktime');
const dLines = document.getElementById('d-lines');

// Update on every input
textInput.addEventListener('input', update);

function update() {
  const text = textInput.value;

  // Characters
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;

  // Words — split on whitespace, filter empty
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Sentences — split on .!? followed by space or end
  const sentences = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length : 0;

  // Paragraphs — non-empty lines separated by blank lines
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;

  // Lines
  const lines = text ? text.split('\n').length : 0;

  // Reading time (~238 words/min average)
  const readMin = words / 238;
  // Speaking time (~150 words/min average)
  const speakMin = words / 150;

  // Update DOM
  sWords.textContent = words.toLocaleString();
  sChars.textContent = chars.toLocaleString();
  sCharsNs.textContent = charsNoSpaces.toLocaleString();
  sSentences.textContent = sentences.toLocaleString();
  sParagraphs.textContent = paragraphs.toLocaleString();

  dReadtime.textContent = formatTime(readMin);
  dSpeaktime.textContent = formatTime(speakMin);
  dLines.textContent = lines.toLocaleString();
}

function formatTime(minutes) {
  if (minutes < 1) {
    const secs = Math.round(minutes * 60);
    return secs <= 0 ? '0 sec' : secs + ' sec';
  }
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return hrs + ' hr ' + remainMins + ' min';
  }
  return mins + ' min ' + (secs > 0 ? secs + ' sec' : '');
}

function copyText() {
  const text = textInput.value;
  if (!text) return;
  navigator.clipboard.writeText(text).catch(() => {
    textInput.select();
    document.execCommand('copy');
  });
}

function clearText() {
  textInput.value = '';
  update();
  textInput.focus();
}
