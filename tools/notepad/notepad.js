/**
 * Online Notepad — localStorage autosave
 */

const KEY = 'sharpdev-notepad-v1';
const SAVE_DELAY = 300;

const noteEl = document.getElementById('notepad');
const status = document.getElementById('save-status');

let saveTimer = null;

// Load
noteEl.value = localStorage.getItem(KEY) || '';
updateStats();

noteEl.addEventListener('input', () => {
  status.textContent = 'Saving…';
  status.className = 'status-msg saving';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, noteEl.value);
      const now = new Date();
      status.textContent = `Saved · ${now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
      status.className = 'status-msg saved';
    } catch (e) {
      status.textContent = '⚠ Could not save: ' + e.message;
      status.className = 'status-msg';
    }
    updateStats();
  }, SAVE_DELAY);
  updateStats();
});

function updateStats() {
  const text = noteEl.value;
  const chars = text.length;
  const words = (text.trim().match(/\S+/g) || []).length;
  const lines = text ? text.split('\n').length : 0;
  const mins = Math.max(1, Math.round(words / 200));
  document.getElementById('char-count').textContent = chars.toLocaleString();
  document.getElementById('word-count').textContent = words.toLocaleString();
  document.getElementById('line-count').textContent = lines.toLocaleString();
  document.getElementById('time-count').textContent = words ? `${mins} min` : '—';
}

document.getElementById('dl-txt').addEventListener('click', () => download('txt', 'text/plain'));
document.getElementById('dl-md').addEventListener('click', () => download('md', 'text/markdown'));

function download(ext, mime) {
  const blob = new Blob([noteEl.value], { type: mime + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notes-${new Date().toISOString().slice(0, 10)}.${ext}`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById('clear-btn').addEventListener('click', () => {
  if (!noteEl.value) return;
  if (!confirm('Delete all notes? This cannot be undone (unless you downloaded a backup).')) return;
  noteEl.value = '';
  localStorage.removeItem(KEY);
  updateStats();
  status.textContent = 'Cleared';
  status.className = 'status-msg';
});

// Status default
if (noteEl.value) {
  status.textContent = 'Saved · (autoloaded)';
  status.className = 'status-msg saved';
} else {
  status.textContent = 'Start typing — autosaves to this browser';
  status.className = 'status-msg';
}
