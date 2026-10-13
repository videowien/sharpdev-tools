/** Temperature converter — C / F / K / Rankine */
const c = document.getElementById('c');
const f = document.getElementById('f');
const k = document.getElementById('k');
const r = document.getElementById('r');

function fmt(n) { return Number.isFinite(n) ? (+n.toFixed(4)) : ''; }

function fromC(v) {
  f.value = fmt(v * 9/5 + 32);
  k.value = fmt(v + 273.15);
  r.value = fmt((v + 273.15) * 9/5);
}
function fromF(v) {
  c.value = fmt((v - 32) * 5/9);
  k.value = fmt((v - 32) * 5/9 + 273.15);
  r.value = fmt(v + 459.67);
}
function fromK(v) {
  c.value = fmt(v - 273.15);
  f.value = fmt((v - 273.15) * 9/5 + 32);
  r.value = fmt(v * 9/5);
}
function fromR(v) {
  c.value = fmt((v - 491.67) * 5/9);
  f.value = fmt(v - 459.67);
  k.value = fmt(v * 5/9);
}

c.addEventListener('input', () => { const v = parseFloat(c.value); if (Number.isFinite(v)) fromC(v); });
f.addEventListener('input', () => { const v = parseFloat(f.value); if (Number.isFinite(v)) fromF(v); });
k.addEventListener('input', () => { const v = parseFloat(k.value); if (Number.isFinite(v)) fromK(v); });
r.addEventListener('input', () => { const v = parseFloat(r.value); if (Number.isFinite(v)) fromR(v); });

document.querySelectorAll('.tc-ref').forEach(el => {
  el.addEventListener('click', () => { c.value = el.dataset.c; fromC(parseFloat(el.dataset.c)); });
});

fromC(0);
