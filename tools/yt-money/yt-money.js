/**
 * YouTube Revenue Estimator — views × RPM range per niche
 */

const viewsEl = document.getElementById('views');
const nicheEl = document.getElementById('niche');
const customRpmEl = document.getElementById('custom-rpm');
const customGroup = document.getElementById('custom-rpm-group');

function fmt(n) {
  return '$' + Math.round(n).toLocaleString();
}
function fmtRange(low, high) {
  return fmt(low) + ' – ' + fmt(high);
}

function update() {
  const views = Math.max(0, parseFloat(viewsEl.value) || 0);
  let low, high;
  if (nicheEl.value === 'custom') {
    customGroup.style.display = '';
    const rpm = Math.max(0, parseFloat(customRpmEl.value) || 0);
    low = rpm * 0.7; // ±30% range around custom
    high = rpm * 1.3;
  } else {
    customGroup.style.display = 'none';
    const [lo, hi] = nicheEl.value.split(',').map(parseFloat);
    low = lo; high = hi;
  }
  const lowRev = (views / 1000) * low;
  const highRev = (views / 1000) * high;
  const midRev = (lowRev + highRev) / 2;

  document.getElementById('r-low').textContent = fmt(lowRev);
  document.getElementById('r-mid').textContent = fmt(midRev);
  document.getElementById('r-high').textContent = fmt(highRev);
  document.getElementById('r-annual').textContent = fmtRange(lowRev * 12, highRev * 12) + ' / year';
}

[viewsEl, nicheEl, customRpmEl].forEach(el => el.addEventListener('input', update));
nicheEl.addEventListener('change', update);
update();
