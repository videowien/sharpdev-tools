/**
 * Twitter Poll Composer — 25 char per option, 2-4 options, duration picker
 */

const OPT_LIMIT = 25;
const Q_LIMIT = 280;

let options = ['', ''];

const qEl = document.getElementById('question');
const optsContainer = document.getElementById('poll-options');
const addBtn = document.getElementById('add-option');
const durationEl = document.getElementById('duration');
const statusMsg = document.getElementById('status-msg');

qEl.value = 'What should I build next on SharpDev.Tools?';
options = ['A PDF cropper', 'A YouTube tag analyzer', 'A bulk CSV editor', 'Other → reply'];

function renderOptions() {
  optsContainer.innerHTML = '';
  options.forEach((opt, idx) => {
    const row = document.createElement('div');
    row.className = 'poll-option';
    row.innerHTML = `
      <input type="text" maxlength="${OPT_LIMIT + 50}" placeholder="Choice ${idx + 1}" value="${escapeAttr(opt)}"/>
      <span class="pc">0 / ${OPT_LIMIT}</span>
      ${options.length > 2 ? '<button type="button" aria-label="Remove">×</button>' : ''}
    `;
    const inp = row.querySelector('input');
    const counter = row.querySelector('.pc');
    inp.addEventListener('input', () => {
      options[idx] = inp.value;
      const n = inp.value.length;
      counter.textContent = `${n} / ${OPT_LIMIT}`;
      counter.style.color = n > OPT_LIMIT ? '#ff4444' : (n > OPT_LIMIT * 0.9 ? '#ffa726' : '#888');
      inp.classList.toggle('over', n > OPT_LIMIT);
      renderPreview();
    });
    // Trigger initial count display
    const n = options[idx].length;
    counter.textContent = `${n} / ${OPT_LIMIT}`;
    counter.style.color = n > OPT_LIMIT ? '#ff4444' : (n > OPT_LIMIT * 0.9 ? '#ffa726' : '#888');
    inp.classList.toggle('over', n > OPT_LIMIT);
    if (options.length > 2) {
      row.querySelector('button').addEventListener('click', () => {
        options.splice(idx, 1);
        renderOptions();
        renderPreview();
      });
    }
    optsContainer.appendChild(row);
  });
  addBtn.classList.toggle('disabled', options.length >= 4);
}

addBtn.addEventListener('click', () => {
  if (options.length >= 4) return;
  options.push('');
  renderOptions();
  renderPreview();
});

qEl.addEventListener('input', () => {
  const n = qEl.value.length;
  const c = document.getElementById('q-counter');
  c.textContent = `${n} / ${Q_LIMIT}`;
  c.className = 'counter' + (n > Q_LIMIT ? ' over' : n > Q_LIMIT * 0.9 ? ' warn' : '');
  renderPreview();
});

durationEl.addEventListener('change', renderPreview);

function renderPreview() {
  document.getElementById('tw-body').textContent = qEl.value || 'Your question will appear here';
  const poll = document.getElementById('tw-poll');
  poll.innerHTML = '';
  options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'tw-poll-option';
    div.textContent = opt || `Choice ${i + 1}`;
    poll.appendChild(div);
  });
  const labels = { '30m': '30 minutes', '1h': '1 hour', '6h': '6 hours', '24h': '1 day', '3d': '3 days', '7d': '7 days' };
  document.getElementById('tw-meta').textContent = `0 votes · ${labels[durationEl.value]} left`;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

document.getElementById('copy-btn').addEventListener('click', async () => {
  const text = qEl.value + '\n\nOptions:\n' + options.map((o, i) => `${i + 1}. ${o}`).join('\n');
  await navigator.clipboard.writeText(text);
  statusMsg.textContent = '✓ Copied';
  statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
});

renderOptions();
renderPreview();
qEl.dispatchEvent(new Event('input'));
