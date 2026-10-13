/**
 * YouTube Chapters Generator — SharpDev Tools
 * Parses + validates + reformats chapter timestamps to YouTube's rules.
 */

const input = document.getElementById('input-text');
const output = document.getElementById('output-text');
const validation = document.getElementById('validation');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const statusMsg = document.getElementById('status-msg');

// Parse a single timestamp string into seconds. Accepts:
//   M:SS, MM:SS, H:MM:SS, HH:MM:SS
function parseTime(s) {
  s = s.trim();
  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  if (m[3] !== undefined) {
    return parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseInt(m[3], 10);
  }
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Parse a line: "MM:SS Title" or "MM:SS - Title" or "MM:SS – Title"
function parseLine(line) {
  const m = line.match(/^\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]?\s*(.+?)\s*$/);
  if (!m) return null;
  const seconds = parseTime(m[1]);
  if (seconds === null) return null;
  return { seconds, title: m[2].trim() };
}

function update() {
  const lines = input.value.split(/\r?\n/);
  const chapters = [];
  const issues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const parsed = parseLine(line);
    if (!parsed) {
      issues.push(`Line ${i + 1}: could not parse — expected "MM:SS Title"`);
      continue;
    }
    chapters.push(parsed);
  }

  if (chapters.length === 0) {
    output.value = '';
    validation.innerHTML = '';
    return;
  }

  // Validate YouTube rules
  if (chapters[0].seconds !== 0) {
    issues.push(`First chapter must be at 00:00 — yours starts at ${formatTime(chapters[0].seconds)}`);
  }
  if (chapters.length < 3) {
    issues.push(`Need at least 3 chapters — you have ${chapters.length}`);
  }
  for (let i = 1; i < chapters.length; i++) {
    const gap = chapters[i].seconds - chapters[i - 1].seconds;
    if (gap < 10) {
      issues.push(`Gap between "${chapters[i - 1].title}" and "${chapters[i].title}" is only ${gap}s — minimum is 10s`);
    }
    if (chapters[i].seconds <= chapters[i - 1].seconds) {
      issues.push(`"${chapters[i].title}" timestamp must be after "${chapters[i - 1].title}"`);
    }
  }

  // Format output (normalized timestamps with leading zeros)
  output.value = chapters
    .map((c) => `${formatTime(c.seconds)} ${c.title}`)
    .join('\n');

  // Render validation
  if (issues.length === 0) {
    validation.innerHTML =
      '<div class="val-ok">✓ Looks good — YouTube will render ' + chapters.length + ' chapters</div>';
  } else {
    validation.innerHTML =
      '<div class="val-bad"><strong>YouTube would reject these chapters:</strong><ul>' +
      issues.map((i) => '<li>' + i.replace(/</g, '&lt;') + '</li>').join('') +
      '</ul></div>';
  }
}

input.addEventListener('input', update);

copyBtn.addEventListener('click', async () => {
  if (!output.value) return;
  await navigator.clipboard.writeText(output.value);
  statusMsg.textContent = '✓ Copied';
  statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  output.value = '';
  validation.innerHTML = '';
  input.focus();
});

update();
