/**
 * TDEE Calculator — Mifflin-St Jeor formula, BMR + activity multiplier
 */

let units = 'metric';
let gender = 'male';

const ageEl = document.getElementById('age');
const weightEl = document.getElementById('weight');
const heightEl = document.getElementById('height');
const activityEl = document.getElementById('activity');
const weightUnitEl = document.getElementById('weight-unit');
const heightUnitEl = document.getElementById('height-unit');

document.querySelectorAll('[data-units]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-units]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const newUnits = btn.dataset.units;
    if (newUnits === units) return;
    // Convert existing values
    if (newUnits === 'imperial') {
      weightEl.value = (parseFloat(weightEl.value) * 2.20462).toFixed(1);
      heightEl.value = (parseFloat(heightEl.value) / 2.54).toFixed(1);
      weightUnitEl.textContent = 'lb';
      heightUnitEl.textContent = 'in';
    } else {
      weightEl.value = (parseFloat(weightEl.value) / 2.20462).toFixed(1);
      heightEl.value = (parseFloat(heightEl.value) * 2.54).toFixed(1);
      weightUnitEl.textContent = 'kg';
      heightUnitEl.textContent = 'cm';
    }
    units = newUnits;
    calc();
  });
});

document.querySelectorAll('[data-gender]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-gender]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    gender = btn.dataset.gender;
    calc();
  });
});

[ageEl, weightEl, heightEl, activityEl].forEach(el => el.addEventListener('input', calc));

function calc() {
  const age = parseInt(ageEl.value, 10);
  let weight = parseFloat(weightEl.value);
  let height = parseFloat(heightEl.value);
  const activity = parseFloat(activityEl.value);
  if (isNaN(age) || isNaN(weight) || isNaN(height) || age < 14 || weight <= 0 || height <= 0) {
    setAll('—');
    return;
  }
  // Convert imperial → metric for the formula
  if (units === 'imperial') {
    weight = weight / 2.20462;
    height = height * 2.54;
  }
  // Mifflin-St Jeor
  const base = 10 * weight + 6.25 * height - 5 * age;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  const tdee = bmr * activity;
  document.getElementById('bmr-val').textContent = Math.round(bmr).toLocaleString();
  document.getElementById('tdee-val').textContent = Math.round(tdee).toLocaleString();
  document.getElementById('t-cut2').textContent = Math.round(tdee * 0.75).toLocaleString() + ' kcal';
  document.getElementById('t-cut1').textContent = Math.round(tdee * 0.85).toLocaleString() + ' kcal';
  document.getElementById('t-maintain').textContent = Math.round(tdee).toLocaleString() + ' kcal';
  document.getElementById('t-bulk1').textContent = Math.round(tdee * 1.10).toLocaleString() + ' kcal';
  document.getElementById('t-bulk2').textContent = Math.round(tdee * 1.20).toLocaleString() + ' kcal';
}

function setAll(v) {
  ['bmr-val', 'tdee-val', 't-cut2', 't-cut1', 't-maintain', 't-bulk1', 't-bulk2']
    .forEach(id => document.getElementById(id).textContent = v);
}

calc();
