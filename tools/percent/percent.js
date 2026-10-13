/** Percentage Calculator — 3 modes */
const fmt = n => Number.isFinite(n) ? (+n.toFixed(4)).toLocaleString('en-US', {maximumFractionDigits: 4}) : '—';
function wire(ax, ay, r, fn) {
  const update = () => {
    const x = parseFloat(ax.value), y = parseFloat(ay.value);
    r.textContent = (Number.isFinite(x) && Number.isFinite(y)) ? fmt(fn(x, y)) : '—';
  };
  ax.addEventListener('input', update);
  ay.addEventListener('input', update);
}
wire(document.getElementById('a-x'), document.getElementById('a-y'), document.getElementById('a-r'), (x, y) => (x / 100) * y);
wire(document.getElementById('b-x'), document.getElementById('b-y'), document.getElementById('b-r'), (x, y) => y === 0 ? NaN : (x / y) * 100);
wire(document.getElementById('c-x'), document.getElementById('c-y'), document.getElementById('c-r'), (x, y) => x === 0 ? NaN : ((y - x) / x) * 100);
