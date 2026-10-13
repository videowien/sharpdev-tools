/** Discount Calculator — supply any 2, compute the third */
const $ = id => document.getElementById(id);
const orig = $('orig'), pct = $('pct'), final = $('final'), result = $('dc-result');
const stackIn = $('stack-in'), stackResult = $('stack-result');
const fmt = n => (+n.toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2 });
let last = null;

function update(changed) {
  last = changed || last;
  const o = parseFloat(orig.value), p = parseFloat(pct.value), f = parseFloat(final.value);
  // Compute missing value based on what's filled + avoid overwriting what user last edited
  let out = null;
  const hasO = Number.isFinite(o), hasP = Number.isFinite(p), hasF = Number.isFinite(f);
  if (hasO && hasP && last !== 'final') { final.value = (+(o * (1 - p / 100)).toFixed(2)); }
  else if (hasO && hasF && last !== 'pct') { pct.value = (+((1 - f / o) * 100).toFixed(2)); }
  else if (hasP && hasF && last !== 'orig') { orig.value = (+(f / (1 - p / 100)).toFixed(2)); }
  const o2 = parseFloat(orig.value), p2 = parseFloat(pct.value), f2 = parseFloat(final.value);
  if (Number.isFinite(o2) && Number.isFinite(f2)) {
    const save = o2 - f2;
    result.innerHTML = `<span class="big">Final: $${fmt(f2)}</span> &nbsp; You save <strong>$${fmt(save)}</strong> (${fmt(Number.isFinite(p2) ? p2 : 0)}% off).`;
  } else {
    result.textContent = 'Fill any two values to compute.';
  }
}
orig.addEventListener('input', () => update('orig'));
pct.addEventListener('input', () => update('pct'));
final.addEventListener('input', () => update('final'));

function stackDiscounts() {
  const nums = stackIn.value.split(/[\s,]+/).map(s => parseFloat(s)).filter(Number.isFinite);
  if (nums.length === 0) { stackResult.textContent = '—'; return; }
  let remaining = 1;
  nums.forEach(p => remaining *= (1 - p / 100));
  const eff = (1 - remaining) * 100;
  stackResult.textContent = fmt(eff) + '%';
}
stackIn.addEventListener('input', stackDiscounts);
