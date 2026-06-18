/**
 * Cooking Measurement Converter — volume + weight + temperature
 */

// Conversion to ml (volume) or g (weight)
const TO_ML = { cup: 240, tbsp: 15, tsp: 5, ml: 1, l: 1000, floz: 29.5735, floz_uk: 28.4131 };
const TO_G  = { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 };
const VOL_UNITS = new Set(['cup', 'tbsp', 'tsp', 'ml', 'l', 'floz', 'floz_uk']);
const WT_UNITS  = new Set(['g', 'kg', 'oz', 'lb']);

const ingredientEl = document.getElementById('ingredient');
const rows = [...document.querySelectorAll('.conv-row')];

let density = 1.0; // g/ml
ingredientEl.addEventListener('change', () => {
  density = parseFloat(ingredientEl.value);
  recalc('cup'); // re-derive
});

let suppress = false;

rows.forEach(r => {
  const qty = r.querySelector('.qty');
  const unit = r.querySelector('.unit');
  qty.addEventListener('input', () => recalcFrom(qty));
  unit.addEventListener('change', () => {
    // Convert current value's underlying ml/g into the new unit display
    qty.dataset.unit = unit.dataset.fixed; // keep dataset stable
    recalcFrom(qty);
  });
});

function recalcFrom(input) {
  if (suppress) return;
  const row = input.closest('.conv-row');
  const unitSel = row.querySelector('.unit');
  const unit = unitSel.value;
  const val = parseFloat(input.value);
  if (isNaN(val)) return;
  // Convert to canonical ml or g
  let ml = null, g = null;
  if (VOL_UNITS.has(unit)) {
    ml = val * TO_ML[unit];
    g = ml * density;
  } else if (WT_UNITS.has(unit)) {
    g = val * TO_G[unit];
    ml = g / density;
  }
  if (ml == null || g == null) return;
  // Update other rows
  suppress = true;
  rows.forEach(r => {
    if (r === row) return;
    const u = r.querySelector('.unit').value;
    const out = r.querySelector('.qty');
    let v;
    if (VOL_UNITS.has(u)) v = ml / TO_ML[u];
    else v = g / TO_G[u];
    out.value = formatNum(v);
  });
  suppress = false;
}

function recalc(unit) {
  // Find the cup row to seed
  rows.forEach(r => {
    if (r.querySelector('.unit').value === unit) {
      recalcFrom(r.querySelector('.qty'));
    }
  });
}

function formatNum(n) {
  if (Math.abs(n) >= 100) return n.toFixed(0);
  if (Math.abs(n) >= 10) return n.toFixed(1);
  if (Math.abs(n) >= 1) return n.toFixed(2);
  return n.toFixed(3);
}

// Initial computation
recalcFrom(document.querySelector('.conv-row .qty'));

// Temperature
const tc = document.getElementById('temp-c');
const tf = document.getElementById('temp-f');
const tg = document.getElementById('temp-gas');
let tempSuppress = false;

tc.addEventListener('input', () => {
  if (tempSuppress) return;
  const c = parseFloat(tc.value);
  if (isNaN(c)) return;
  tempSuppress = true;
  tf.value = (c * 9 / 5 + 32).toFixed(0);
  tg.value = cToGas(c);
  tempSuppress = false;
});
tf.addEventListener('input', () => {
  if (tempSuppress) return;
  const f = parseFloat(tf.value);
  if (isNaN(f)) return;
  tempSuppress = true;
  const c = (f - 32) * 5 / 9;
  tc.value = c.toFixed(0);
  tg.value = cToGas(c);
  tempSuppress = false;
});
tg.addEventListener('input', () => {
  if (tempSuppress) return;
  const g = parseFloat(tg.value);
  if (isNaN(g)) return;
  tempSuppress = true;
  const c = gasToC(g);
  tc.value = c.toFixed(0);
  tf.value = (c * 9 / 5 + 32).toFixed(0);
  tempSuppress = false;
});

// Approximation: gas mark 1 = 140C, +20C per step up to 9 = 240C (it's not linear but close enough)
function cToGas(c) {
  if (c < 135) return 0;
  return Math.max(0, Math.min(10, ((c - 135) / 13.9))).toFixed(1);
}
function gasToC(g) {
  return 135 + g * 13.9;
}
