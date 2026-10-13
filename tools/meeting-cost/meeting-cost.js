/**
 * Meeting Cost Calculator — SharpDev Tools
 * 100% browser-side. Shows the real cost of meetings.
 */

const WORK_HOURS_PER_YEAR = 2080; // 40hr/week * 52 weeks

function calculate() {
  const attendees = Math.max(1, parseInt(document.getElementById('attendees').value) || 1);
  const salary = Math.max(0, parseFloat(document.getElementById('avg-salary').value) || 0);
  const hours = Math.max(0, parseInt(document.getElementById('hours').value) || 0);
  const minutes = Math.max(0, parseInt(document.getElementById('minutes').value) || 0);
  const currency = document.getElementById('currency').value;
  const frequency = document.getElementById('frequency').value;

  const totalMinutes = hours * 60 + minutes;
  const totalHours = totalMinutes / 60;
  const hourlyRate = salary / WORK_HOURS_PER_YEAR;
  const costPerPerson = hourlyRate * totalHours;
  const totalCost = costPerPerson * attendees;
  const costPerMinute = totalMinutes > 0 ? totalCost / totalMinutes : 0;

  // Display
  document.getElementById('cost-total').textContent = formatMoney(totalCost, currency);
  document.getElementById('cost-per-person').textContent = formatMoney(costPerPerson, currency);
  document.getElementById('hourly-rate').textContent = formatMoney(hourlyRate, currency) + '/hr';
  document.getElementById('cost-per-min').textContent = totalMinutes > 0
    ? `That\u2019s ${formatMoney(costPerMinute, currency)} per minute burning away`
    : '';

  // Recurring
  const recurringSection = document.getElementById('recurring-section');
  if (frequency !== 'once') {
    recurringSection.style.display = 'block';
    let perYear;
    switch (frequency) {
      case 'daily': perYear = 260; break;    // ~5 days/week * 52
      case 'weekly': perYear = 52; break;
      case 'biweekly': perYear = 26; break;
      case 'monthly': perYear = 12; break;
      default: perYear = 1;
    }
    const yearly = totalCost * perYear;
    const monthly = yearly / 12;
    document.getElementById('cost-monthly').textContent = formatMoney(monthly, currency);
    document.getElementById('cost-yearly').textContent = formatMoney(yearly, currency);
  } else {
    recurringSection.style.display = 'none';
  }

  // Fun equivalents
  updateEquivalents(totalCost, currency, frequency);
}

function updateEquivalents(cost, currency, frequency) {
  const el = document.getElementById('equivalents');
  if (cost <= 0) { el.innerHTML = ''; return; }

  let annualCost = cost;
  if (frequency === 'daily') annualCost = cost * 260;
  else if (frequency === 'weekly') annualCost = cost * 52;
  else if (frequency === 'biweekly') annualCost = cost * 26;
  else if (frequency === 'monthly') annualCost = cost * 12;

  const items = [];

  // Currency-aware equivalents (rough local prices)
  const coffeePrices = { '$': 5, '€': 4, '£': 3.5, 'CHF': 5, '¥': 500 };
  const netflixPrices = { '$': 15, '€': 13, '£': 11, 'CHF': 13, '¥': 1500 };
  const coffeePrice = coffeePrices[currency] || 5;
  const netflixPrice = netflixPrices[currency] || 15;

  const coffees = Math.round(cost / coffeePrice);
  if (coffees >= 1) items.push(`<span class="eq-val">${coffees}</span> cups of coffee`);

  const netflix = Math.round(cost / netflixPrice);
  if (netflix >= 1) items.push(`<span class="eq-val">${netflix}</span> months of Netflix`);

  if (frequency !== 'once') {
    // Full-time equivalent
    const avgSalary = parseFloat(document.getElementById('avg-salary').value) || 60000;
    if (avgSalary > 0) {
      const fte = annualCost / avgSalary;
      if (fte >= 0.1) items.push(`<span class="eq-val">${fte.toFixed(1)}</span> full-time salaries per year`);
    }

    // Vacation days equivalent (8hr days at hourly rate)
    const hourlyRate = (parseFloat(document.getElementById('avg-salary').value) || 60000) / WORK_HOURS_PER_YEAR;
    const vacationDays = Math.round(annualCost / (hourlyRate * 8));
    if (vacationDays >= 1) items.push(`<span class="eq-val">${vacationDays}</span> person-days of work per year`);
  }

  if (items.length === 0) { el.innerHTML = ''; return; }
  el.innerHTML = '<div style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">That\u2019s equivalent to</div>' +
    items.map(i => `<div class="eq-item">${i}</div>`).join('');
}

function formatMoney(amount, currency) {
  const noDecimals = (currency === '¥');
  if (amount >= 1000000) return currency + (amount / 1000000).toFixed(noDecimals ? 0 : 1) + 'M';
  if (amount >= 100) return currency + Math.round(amount).toLocaleString();
  if (noDecimals) return currency + Math.round(amount).toLocaleString();
  if (amount >= 1) return currency + amount.toFixed(2);
  return currency + amount.toFixed(2);
}

// Salary presets adjusted by currency (rough purchasing power parity)
const SALARY_PRESETS = {
  '$':   [40000, 60000, 90000, 130000, 200000],
  '\u20ac': [35000, 50000, 75000, 110000, 170000],
  '\u00a3': [30000, 45000, 65000, 95000, 150000],
  'CHF': [50000, 75000, 110000, 150000, 230000],
  '\u00a5': [3000000, 5000000, 8000000, 12000000, 20000000],
};

function updatePresets() {
  const currency = document.getElementById('currency').value;
  const presets = SALARY_PRESETS[currency] || SALARY_PRESETS['$'];
  const labels = ['Entry', 'Mid', 'Senior', 'Manager', 'Executive'];
  const container = document.getElementById('salary-presets');
  container.innerHTML = '';
  presets.forEach((val, i) => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.textContent = labels[i];
    btn.onclick = () => setSalary(val);
    container.appendChild(btn);
  });
  // Also update the default salary if it's a round number (user hasn't customized)
  const currentSalary = parseInt(document.getElementById('avg-salary').value);
  const allPresets = Object.values(SALARY_PRESETS).flat();
  if (allPresets.includes(currentSalary)) {
    document.getElementById('avg-salary').value = presets[1]; // Mid level default
  }
}

function setSalary(val) {
  document.getElementById('avg-salary').value = val;
  calculate();
}

function setDuration(h, m) {
  document.getElementById('hours').value = h;
  document.getElementById('minutes').value = m;
  calculate();
}

// Init on load
updatePresets();
calculate();
