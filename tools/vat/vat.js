/**
 * VAT / Sales Tax Calculator — SharpDev Tools
 */

const rate = document.getElementById('rate');
const net = document.getElementById('net');
const vatAmt = document.getElementById('vat-amt');
const gross = document.getElementById('gross');
const hint = document.getElementById('hint');

let lastEdited = 'net'; // track which field user touched last

function fmt(n) {
  if (!isFinite(n)) return '';
  return (Math.round(n * 100) / 100).toFixed(2);
}

function recompute() {
  const r = parseFloat(rate.value);
  if (isNaN(r) || r < 0) return;
  const factor = 1 + r / 100;

  if (lastEdited === 'net') {
    const n = parseFloat(net.value);
    if (isNaN(n)) { vatAmt.value = ''; gross.value = ''; return; }
    const g = n * factor;
    gross.value = fmt(g);
    vatAmt.value = fmt(g - n);
  } else if (lastEdited === 'gross') {
    const g = parseFloat(gross.value);
    if (isNaN(g)) { vatAmt.value = ''; net.value = ''; return; }
    const n = g / factor;
    net.value = fmt(n);
    vatAmt.value = fmt(g - n);
  }
}

net.addEventListener('input', () => { lastEdited = 'net'; recompute(); });
gross.addEventListener('input', () => { lastEdited = 'gross'; recompute(); });
rate.addEventListener('input', recompute);

document.querySelectorAll('.preset-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    rate.value = btn.dataset.rate;
    recompute();
  });
});

// Start with example
net.value = '100';
lastEdited = 'net';
recompute();
