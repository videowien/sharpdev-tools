/**
 * LinkedIn URL Cleaner — SharpDev Tools
 * Strips LinkedIn tracking + UTM params.
 */

const TRACKING_PARAMS = new Set([
  'trackingId', 'lipi', 'refId', 'miniProfileUrn', 'originalSubdomain',
  'ck', 'fbclid', 'gclid',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
]);

function isTracking(key) {
  if (TRACKING_PARAMS.has(key)) return true;
  const k = key.toLowerCase();
  return k.startsWith('utm_') || k.startsWith('ref') || k.startsWith('src') ||
         k.startsWith('tracking') || k.startsWith('lipi') || k.startsWith('fb');
}

const input = document.getElementById('input-url');
const output = document.getElementById('output-url');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const statusMsg = document.getElementById('status-msg');
const infoRow = document.getElementById('info-row');
const removedList = document.getElementById('removed-list');

function clean(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { url: '', removed: [] };
  let url;
  try { url = new URL(trimmed); }
  catch (e) { return { url: '', removed: [], error: 'Not a valid URL' }; }
  const removed = [];
  for (const k of Array.from(url.searchParams.keys())) {
    if (isTracking(k)) {
      removed.push(k);
      url.searchParams.delete(k);
    }
  }
  let cleaned = url.toString();
  if (cleaned.endsWith('?')) cleaned = cleaned.slice(0, -1);
  return { url: cleaned, removed };
}

function update() {
  const result = clean(input.value);
  if (result.error) {
    output.value = '';
    infoRow.style.display = 'none';
    statusMsg.textContent = result.error;
    statusMsg.className = 'status-msg err';
    return;
  }
  output.value = result.url;
  if (result.removed.length) {
    infoRow.style.display = '';
    removedList.textContent = result.removed.join(', ');
  } else {
    infoRow.style.display = 'none';
  }
  statusMsg.textContent = '';
  statusMsg.className = 'status-msg';
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
  infoRow.style.display = 'none';
  statusMsg.textContent = '';
  input.focus();
});
