/** Salary Converter — hourly/daily/weekly/monthly/yearly */
const PERIODS = [
  { key: 'hour',  label: 'Hourly',  hoursFn: (h, w) => 1 },
  { key: 'day',   label: 'Daily',   hoursFn: (h, w) => h / 5 },    // 5 workdays per week
  { key: 'week',  label: 'Weekly',  hoursFn: (h, w) => h },
  { key: 'month', label: 'Monthly', hoursFn: (h, w) => (h * w) / 12 },
  { key: 'year',  label: 'Yearly',  hoursFn: (h, w) => h * w },
];
const grid = document.getElementById('sl-grid');
const hpwEl = document.getElementById('hpw');
const wpyEl = document.getElementById('wpy');

// state in hourly rate (base)
let hourly = 25;

const fields = {};
function renderFields() {
  grid.innerHTML = '';
  PERIODS.forEach(p => {
    const el = document.createElement('div');
    el.className = 'sl-field';
    el.innerHTML = `<label>${p.label}</label><div class="sl-input-wrap"><span class="cur">$</span><input type="number" step="any" data-key="${p.key}"></div>`;
    const inp = el.querySelector('input');
    fields[p.key] = { el, inp, def: p };
    inp.addEventListener('input', () => {
      const h = parseFloat(hpwEl.value) || 40;
      const w = parseFloat(wpyEl.value) || 50;
      const v = parseFloat(inp.value);
      if (!Number.isFinite(v)) return;
      const factor = p.hoursFn(h, w);
      hourly = v / factor;
      render();
    });
    inp.addEventListener('focus', () => { Object.values(fields).forEach(f => f.el.classList.remove('active')); el.classList.add('active'); });
    grid.appendChild(el);
  });
}

function render() {
  const h = parseFloat(hpwEl.value) || 40;
  const w = parseFloat(wpyEl.value) || 50;
  Object.values(fields).forEach(f => {
    if (document.activeElement === f.inp) return;
    const val = hourly * f.def.hoursFn(h, w);
    f.inp.value = (+val.toFixed(2));
  });
}

hpwEl.addEventListener('input', render);
wpyEl.addEventListener('input', render);

renderFields();
render();
