/**
 * Unit Converter — SharpDev Tools
 * 100% browser-side unit conversion.
 */

// Each category has units defined relative to a base unit (factor to multiply to get base).
// Temperature is special — uses functions instead of factors.
const CATEGORIES = {
  Length: {
    units: {
      'Kilometer':  { factor: 1000, abbr: 'km' },
      'Meter':      { factor: 1, abbr: 'm' },
      'Centimeter': { factor: 0.01, abbr: 'cm' },
      'Millimeter': { factor: 0.001, abbr: 'mm' },
      'Mile':       { factor: 1609.344, abbr: 'mi' },
      'Yard':       { factor: 0.9144, abbr: 'yd' },
      'Foot':       { factor: 0.3048, abbr: 'ft' },
      'Inch':       { factor: 0.0254, abbr: 'in' },
      'Nautical Mile': { factor: 1852, abbr: 'nmi' },
      'Micrometer': { factor: 0.000001, abbr: '\u00b5m' },
    },
    defaults: ['Meter', 'Foot'],
  },
  Weight: {
    units: {
      'Kilogram':   { factor: 1, abbr: 'kg' },
      'Gram':       { factor: 0.001, abbr: 'g' },
      'Milligram':  { factor: 0.000001, abbr: 'mg' },
      'Metric Ton': { factor: 1000, abbr: 't' },
      'Pound':      { factor: 0.45359237, abbr: 'lb' },
      'Ounce':      { factor: 0.02834952, abbr: 'oz' },
      'Stone':      { factor: 6.35029, abbr: 'st' },
    },
    defaults: ['Kilogram', 'Pound'],
  },
  Temperature: {
    units: {
      'Celsius':    { abbr: '\u00b0C' },
      'Fahrenheit': { abbr: '\u00b0F' },
      'Kelvin':     { abbr: 'K' },
    },
    defaults: ['Celsius', 'Fahrenheit'],
    custom: true,
  },
  Area: {
    units: {
      'Square Kilometer': { factor: 1000000, abbr: 'km\u00b2' },
      'Square Meter':     { factor: 1, abbr: 'm\u00b2' },
      'Square Centimeter':{ factor: 0.0001, abbr: 'cm\u00b2' },
      'Hectare':          { factor: 10000, abbr: 'ha' },
      'Acre':             { factor: 4046.8564, abbr: 'ac' },
      'Square Mile':      { factor: 2589988.11, abbr: 'mi\u00b2' },
      'Square Foot':      { factor: 0.092903, abbr: 'ft\u00b2' },
      'Square Inch':      { factor: 0.00064516, abbr: 'in\u00b2' },
      'Square Yard':      { factor: 0.836127, abbr: 'yd\u00b2' },
    },
    defaults: ['Square Meter', 'Square Foot'],
  },
  Volume: {
    units: {
      'Liter':       { factor: 1, abbr: 'L' },
      'Milliliter':  { factor: 0.001, abbr: 'mL' },
      'Cubic Meter': { factor: 1000, abbr: 'm\u00b3' },
      'Gallon (US)': { factor: 3.78541, abbr: 'gal' },
      'Quart (US)':  { factor: 0.946353, abbr: 'qt' },
      'Pint (US)':   { factor: 0.473176, abbr: 'pt' },
      'Cup (US)':    { factor: 0.236588, abbr: 'cup' },
      'Fluid Ounce (US)': { factor: 0.0295735, abbr: 'fl oz' },
      'Tablespoon':  { factor: 0.0147868, abbr: 'tbsp' },
      'Teaspoon':    { factor: 0.00492892, abbr: 'tsp' },
    },
    defaults: ['Liter', 'Gallon (US)'],
  },
  Speed: {
    units: {
      'Meter/second':    { factor: 1, abbr: 'm/s' },
      'Kilometer/hour':  { factor: 0.277778, abbr: 'km/h' },
      'Mile/hour':       { factor: 0.44704, abbr: 'mph' },
      'Knot':            { factor: 0.514444, abbr: 'kn' },
      'Foot/second':     { factor: 0.3048, abbr: 'ft/s' },
    },
    defaults: ['Kilometer/hour', 'Mile/hour'],
  },
  'Data Size': {
    units: {
      'Bit':       { factor: 1, abbr: 'b' },
      'Byte':      { factor: 8, abbr: 'B' },
      'Kilobyte':  { factor: 8 * 1000, abbr: 'KB' },
      'Megabyte':  { factor: 8 * 1000 ** 2, abbr: 'MB' },
      'Gigabyte':  { factor: 8 * 1000 ** 3, abbr: 'GB' },
      'Terabyte':  { factor: 8 * 1000 ** 4, abbr: 'TB' },
      'Petabyte':  { factor: 8 * 1000 ** 5, abbr: 'PB' },
      'Kibibyte':  { factor: 8 * 1024, abbr: 'KiB' },
      'Mebibyte':  { factor: 8 * 1024 ** 2, abbr: 'MiB' },
      'Gibibyte':  { factor: 8 * 1024 ** 3, abbr: 'GiB' },
      'Tebibyte':  { factor: 8 * 1024 ** 4, abbr: 'TiB' },
    },
    defaults: ['Megabyte', 'Gigabyte'],
  },
  Time: {
    units: {
      'Second':      { factor: 1, abbr: 's' },
      'Millisecond': { factor: 0.001, abbr: 'ms' },
      'Minute':      { factor: 60, abbr: 'min' },
      'Hour':        { factor: 3600, abbr: 'hr' },
      'Day':         { factor: 86400, abbr: 'd' },
      'Week':        { factor: 604800, abbr: 'wk' },
      'Month (30d)': { factor: 2592000, abbr: 'mo' },
      'Year (365d)': { factor: 31536000, abbr: 'yr' },
    },
    defaults: ['Minute', 'Second'],
  },
  'CSS/Design': {
    units: {
      'Pixel (px)':    { factor: 1, abbr: 'px' },
      'Rem (16px)':    { factor: 16, abbr: 'rem' },
      'Em (16px)':     { factor: 16, abbr: 'em' },
      'Point (pt)':    { factor: 1.333333, abbr: 'pt' },
      'Viewport Width (vw)': { factor: 14.4, abbr: 'vw' },
    },
    defaults: ['Pixel (px)', 'Rem (16px)'],
  },
};

// Temperature conversion functions
function tempConvert(value, from, to) {
  // Convert to Celsius first
  let celsius;
  if (from === 'Celsius') celsius = value;
  else if (from === 'Fahrenheit') celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15; // Kelvin

  // Convert from Celsius to target
  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return celsius * 9 / 5 + 32;
  return celsius + 273.15; // Kelvin
}

let currentCategory = 'Length';

const fromVal = document.getElementById('from-val');
const toVal = document.getElementById('to-val');
const fromUnit = document.getElementById('from-unit');
const toUnit = document.getElementById('to-unit');
const formulaEl = document.getElementById('formula');
const allList = document.getElementById('all-list');
const tabsEl = document.getElementById('category-tabs');

// Build category tabs
for (const cat of Object.keys(CATEGORIES)) {
  const btn = document.createElement('button');
  btn.className = 'cat-tab';
  btn.textContent = cat;
  btn.onclick = () => selectCategory(cat);
  tabsEl.appendChild(btn);
}

function selectCategory(cat) {
  currentCategory = cat;
  // Update tabs
  tabsEl.querySelectorAll('.cat-tab').forEach(t => {
    t.classList.toggle('active', t.textContent === cat);
  });

  const config = CATEGORIES[cat];
  const unitNames = Object.keys(config.units);

  // Populate selects
  fromUnit.innerHTML = '';
  toUnit.innerHTML = '';
  for (const name of unitNames) {
    const abbr = config.units[name].abbr;
    fromUnit.innerHTML += `<option value="${name}">${name} (${abbr})</option>`;
    toUnit.innerHTML += `<option value="${name}">${name} (${abbr})</option>`;
  }

  // Set defaults
  fromUnit.value = config.defaults[0];
  toUnit.value = config.defaults[1];

  fromVal.value = 1;
  convertFrom();
}

function convertFrom() {
  const val = parseFloat(fromVal.value);
  if (isNaN(val)) { toVal.value = ''; formulaEl.textContent = ''; allList.innerHTML = ''; return; }

  const config = CATEGORIES[currentCategory];
  const from = fromUnit.value;
  const to = toUnit.value;

  let result;
  if (config.custom) {
    result = tempConvert(val, from, to);
  } else {
    const baseVal = val * config.units[from].factor;
    result = baseVal / config.units[to].factor;
  }

  toVal.value = formatNumber(result);
  updateFormula(val, from, result, to);
  updateAllConversions(val, from);
}

function convertTo() {
  const val = parseFloat(toVal.value);
  if (isNaN(val)) { fromVal.value = ''; formulaEl.textContent = ''; allList.innerHTML = ''; return; }

  const config = CATEGORIES[currentCategory];
  const from = fromUnit.value;
  const to = toUnit.value;

  let result;
  if (config.custom) {
    result = tempConvert(val, to, from);
  } else {
    const baseVal = val * config.units[to].factor;
    result = baseVal / config.units[from].factor;
  }

  fromVal.value = formatNumber(result);
  updateFormula(result, from, val, to);
  updateAllConversions(result, from);
}

function swapUnits() {
  const tmpUnit = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = tmpUnit;
  convertFrom();
}

function updateFormula(fromV, fromName, toV, toName) {
  const config = CATEGORIES[currentCategory];
  const fromAbbr = config.units[fromName].abbr;
  const toAbbr = config.units[toName].abbr;
  formulaEl.textContent = `${formatNumber(fromV)} ${fromAbbr} = ${formatNumber(toV)} ${toAbbr}`;
}

function updateAllConversions(val, fromName) {
  const config = CATEGORIES[currentCategory];
  allList.innerHTML = '';

  for (const [name, unit] of Object.entries(config.units)) {
    if (name === fromName) continue;

    let result;
    if (config.custom) {
      result = tempConvert(val, fromName, name);
    } else {
      const baseVal = val * config.units[fromName].factor;
      result = baseVal / unit.factor;
    }

    const item = document.createElement('div');
    item.className = 'all-item';
    item.innerHTML = `<span class="all-unit">${name}</span><span class="all-val">${formatNumber(result)} ${unit.abbr}</span>`;
    item.onclick = () => {
      toUnit.value = name;
      convertFrom();
    };
    allList.appendChild(item);
  }
}

function formatNumber(n) {
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1000000 || (abs < 0.001 && abs > 0)) {
    return n.toExponential(6);
  }
  // Remove trailing zeros
  if (Number.isInteger(n)) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const decimals = abs >= 100 ? 4 : abs >= 1 ? 6 : 8;
  return parseFloat(n.toFixed(decimals)).toString();
}

// Init
selectCategory('Length');
