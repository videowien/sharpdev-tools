/**
 * UTM Builder — SharpDev Tools
 */

const els = {
  base: document.getElementById('base-url'),
  source: document.getElementById('utm-source'),
  medium: document.getElementById('utm-medium'),
  campaign: document.getElementById('utm-campaign'),
  content: document.getElementById('utm-content'),
  term: document.getElementById('utm-term'),
  lowercase: document.getElementById('lowercase'),
  output: document.getElementById('output'),
  copyBtn: document.getElementById('copy-btn'),
  clearBtn: document.getElementById('clear-btn'),
  statusMsg: document.getElementById('status-msg'),
};

function normalize(v) {
  if (!v) return '';
  v = v.trim();
  if (els.lowercase.checked) v = v.toLowerCase();
  return v;
}

function update() {
  const base = els.base.value.trim();
  if (!base) { els.output.value = ''; return; }
  let baseUrl;
  try { baseUrl = new URL(base); }
  catch (e) {
    els.output.value = '/* Invalid destination URL */';
    return;
  }
  const fields = [
    ['utm_source', els.source.value],
    ['utm_medium', els.medium.value],
    ['utm_campaign', els.campaign.value],
    ['utm_content', els.content.value],
    ['utm_term', els.term.value],
  ];
  for (const [k, v] of fields) {
    baseUrl.searchParams.delete(k); // overwrite any existing
    const n = normalize(v);
    if (n) baseUrl.searchParams.set(k, n);
  }
  els.output.value = baseUrl.toString();
}

['base', 'source', 'medium', 'campaign', 'content', 'term'].forEach((k) => {
  els[k].addEventListener('input', update);
});
els.lowercase.addEventListener('change', update);

els.copyBtn.addEventListener('click', async () => {
  if (!els.output.value || els.output.value.startsWith('/*')) return;
  await navigator.clipboard.writeText(els.output.value);
  els.statusMsg.textContent = '✓ Copied';
  els.statusMsg.className = 'status-msg ok';
  setTimeout(() => { els.statusMsg.textContent = ''; }, 1500);
});

els.clearBtn.addEventListener('click', () => {
  els.source.value = '';
  els.medium.value = '';
  els.campaign.value = '';
  els.content.value = '';
  els.term.value = '';
  update();
});

update();
