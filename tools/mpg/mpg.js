/**
 * Gas Mileage / MPG Calculator
 */

const KM_PER_MI = 1.609344;
const L_PER_GAL_US = 3.785411784;
const L_PER_GAL_UK = 4.54609;

const els = {
  distance: document.getElementById('distance'),
  distUnit: document.getElementById('dist-unit'),
  fuel: document.getElementById('fuel'),
  fuelUnit: document.getElementById('fuel-unit'),
  price: document.getElementById('price'),
  currency: document.getElementById('currency'),
  pricePer: document.getElementById('price-per'),
};

['distance', 'distUnit', 'fuel', 'fuelUnit', 'price', 'currency'].forEach(k => {
  els[k].addEventListener('input', calc);
  if (els[k].tagName === 'SELECT') els[k].addEventListener('change', calc);
});

function calc() {
  // Convert distance to miles and km
  let dist = parseFloat(els.distance.value) || 0;
  let distMi, distKm;
  if (els.distUnit.value === 'mi') { distMi = dist; distKm = dist * KM_PER_MI; }
  else { distKm = dist; distMi = dist / KM_PER_MI; }

  // Convert fuel to gallons (US/UK) and litres
  let fuel = parseFloat(els.fuel.value) || 0;
  let galUS, galUK, litres;
  if (els.fuelUnit.value === 'gal-us') { galUS = fuel; galUK = fuel * L_PER_GAL_US / L_PER_GAL_UK; litres = fuel * L_PER_GAL_US; }
  else if (els.fuelUnit.value === 'gal-uk') { galUK = fuel; galUS = fuel * L_PER_GAL_UK / L_PER_GAL_US; litres = fuel * L_PER_GAL_UK; }
  else { litres = fuel; galUS = fuel / L_PER_GAL_US; galUK = fuel / L_PER_GAL_UK; }

  // Update label
  const fuelLabel = els.fuelUnit.value === 'gal-us' ? 'US gallon' : els.fuelUnit.value === 'gal-uk' ? 'UK gallon' : 'litre';
  els.pricePer.textContent = 'per ' + fuelLabel;

  const cur = els.currency.value;
  const price = parseFloat(els.price.value) || 0;

  if (fuel <= 0 || dist <= 0) {
    setAll('—', cur);
    return;
  }

  const mpgUS = distMi / galUS;
  const mpgUK = distMi / galUK;
  const l100 = (litres / distKm) * 100;
  const kmpl = distKm / litres;
  const totalCost = price * fuel;
  const cpm = totalCost / distMi;

  document.getElementById('r-mpg-us').textContent = mpgUS.toFixed(1);
  document.getElementById('r-mpg-uk').textContent = mpgUK.toFixed(1);
  document.getElementById('r-l100').textContent = l100.toFixed(2);
  document.getElementById('r-kmpl').textContent = kmpl.toFixed(2);
  document.getElementById('r-cpm').textContent = cur + cpm.toFixed(3);
  document.getElementById('r-total').textContent = cur + totalCost.toFixed(2);
}

function setAll(v, cur) {
  ['r-mpg-us', 'r-mpg-uk', 'r-l100', 'r-kmpl'].forEach(id => document.getElementById(id).textContent = v);
  document.getElementById('r-cpm').textContent = v;
  document.getElementById('r-total').textContent = v;
}

calc();
