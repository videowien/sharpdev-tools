(function(){
  const unitBtns = document.querySelectorAll('.unit-btn');
  const metricInputs = document.getElementById('metric-inputs');
  const imperialInputs = document.getElementById('imperial-inputs');
  const hCm = document.getElementById('h-cm');
  const wKg = document.getElementById('w-kg');
  const hFt = document.getElementById('h-ft');
  const hIn = document.getElementById('h-in');
  const wLb = document.getElementById('w-lb');
  const ageEl = document.getElementById('age');
  const sexEl = document.getElementById('sex');
  const activityEl = document.getElementById('activity');
  const waistEl = document.getElementById('waist');
  const neckEl = document.getElementById('neck');
  const hipEl = document.getElementById('hip');
  const hipRow = document.getElementById('hip-row');
  const waistLabel = document.getElementById('waist-label');
  const neckLabel = document.getElementById('neck-label');
  const hipLabel = document.getElementById('hip-label');

  let unit = 'metric';

  function getHeightCm() {
    if (unit === 'metric') return parseFloat(hCm.value);
    const ft = parseFloat(hFt.value) || 0;
    const inch = parseFloat(hIn.value) || 0;
    return (ft * 12 + inch) * 2.54;
  }
  function getWeightKg() {
    if (unit === 'metric') return parseFloat(wKg.value);
    return (parseFloat(wLb.value) || 0) / 2.20462;
  }
  function cmToIn(cm) { return cm / 2.54; }
  function kgToLb(kg) { return kg * 2.20462; }

  function bmiCat(b) {
    if (b < 18.5) return { cls: 'under', text: 'Underweight' };
    if (b < 25) return { cls: 'normal', text: 'Normal' };
    if (b < 30) return { cls: 'over', text: 'Overweight' };
    return { cls: 'obese', text: 'Obese' };
  }

  function fmtWeight(kg) {
    if (unit === 'metric') return kg.toFixed(1) + ' kg';
    return kgToLb(kg).toFixed(1) + ' lb';
  }
  function fmtWeightRange(a, b) {
    return fmtWeight(a) + ' – ' + fmtWeight(b);
  }

  function calc() {
    const h = getHeightCm();
    const w = getWeightKg();
    const age = parseFloat(ageEl.value);
    const sex = sexEl.value;
    const act = parseFloat(activityEl.value);
    if (!h || !w || !age || h <= 0 || w <= 0) return;
    const hM = h / 100;
    const bmi = w / (hM * hM);
    const cat = bmiCat(bmi);
    document.getElementById('bmi-val').textContent = bmi.toFixed(1);
    const badge = document.getElementById('bmi-badge');
    badge.className = 'bmi-badge ' + cat.cls;
    badge.textContent = cat.text;

    // scale: BMI 15 = 0%, BMI 40 = 100%
    const pct = Math.max(0, Math.min(100, (bmi - 15) / 25 * 100));
    document.getElementById('bmi-marker').style.left = pct + '%';

    // Ideal weight formulas (for height in inches above 5 ft)
    const hIn2 = cmToIn(h);
    const over5ft = Math.max(0, hIn2 - 60);
    const isMale = sex === 'male';
    // Devine
    const devine = isMale ? 50 + 2.3 * over5ft : 45.5 + 2.3 * over5ft;
    // Robinson
    const robinson = isMale ? 52 + 1.9 * over5ft : 49 + 1.7 * over5ft;
    // Miller
    const miller = isMale ? 56.2 + 1.41 * over5ft : 53.1 + 1.36 * over5ft;
    // Hamwi
    const hamwi = isMale ? 48 + 2.7 * over5ft : 45.5 + 2.2 * over5ft;
    // BMI-based range: 18.5 to 24.9
    const ideal_low = 18.5 * hM * hM;
    const ideal_high = 24.9 * hM * hM;

    const ideals = [
      { name: 'Devine', val: devine },
      { name: 'Robinson', val: robinson },
      { name: 'Miller', val: miller },
      { name: 'Hamwi', val: hamwi },
    ];
    const formulaValues = ideals.map(i => i.val);
    const consensusLow = Math.min(...formulaValues);
    const consensusHigh = Math.max(...formulaValues);

    document.getElementById('ideal-grid').innerHTML = ideals.map(i =>
      '<div class="ideal-item"><div class="lbl">' + i.name + '</div><div class="val">' + fmtWeight(i.val) + '</div></div>'
    ).join('');
    document.getElementById('consensus').textContent =
      'BMI healthy range: ' + fmtWeightRange(ideal_low, ideal_high) +
      '   ·   Formula consensus: ' + fmtWeightRange(consensusLow, consensusHigh);

    // Mifflin-St Jeor BMR
    let bmr;
    if (isMale) {
      bmr = 10 * w + 6.25 * h - 5 * age + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * age - 161;
    }
    const tdee = bmr * act;
    document.getElementById('bmr-val').textContent = Math.round(bmr).toLocaleString('en-US');
    document.getElementById('tdee-val').textContent = Math.round(tdee).toLocaleString('en-US');

    // Macros: protein 2g/kg, fat 25% cals, rest carbs
    const calGoals = [
      { name: 'Cut', cal: tdee - 500 },
      { name: 'Maintain', cal: tdee },
      { name: 'Bulk', cal: tdee + 300 },
    ];
    let macroHtml = '<div class="macro-row head"><div>Goal</div><div>Protein</div><div>Fat</div><div>Carbs</div></div>';
    for (const g of calGoals) {
      const protein = 2 * w; // g
      const fat = (g.cal * 0.25) / 9;
      const carbs = (g.cal - protein * 4 - fat * 9) / 4;
      macroHtml += '<div class="macro-row">' +
        '<div class="mn">' + g.name + '</div>' +
        '<div class="v">' + Math.round(protein) + ' <span class="u">g</span></div>' +
        '<div class="v">' + Math.round(fat) + ' <span class="u">g</span></div>' +
        '<div class="v">' + Math.max(0, Math.round(carbs)) + ' <span class="u">g</span></div>' +
        '</div>';
    }
    document.getElementById('macro-table').innerHTML = macroHtml;

    // Body fat — US Navy (metric formula; convert from inches if needed)
    const toCm = x => (unit === 'metric' ? x : x * 2.54);
    const waist = toCm(parseFloat(waistEl.value));
    const neck = toCm(parseFloat(neckEl.value));
    const hip = toCm(parseFloat(hipEl.value));
    const bfCard = document.getElementById('bf-card');
    if (waist && neck && (isMale || hip)) {
      let bf;
      if (isMale) {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
      } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450;
      }
      if (isFinite(bf) && bf > 0 && bf < 70) {
        bfCard.style.display = '';
        document.getElementById('bf-val').textContent = bf.toFixed(1) + '%';
        let bfCat = '';
        if (isMale) {
          if (bf < 6) bfCat = 'Essential fat';
          else if (bf < 14) bfCat = 'Athletes';
          else if (bf < 18) bfCat = 'Fitness';
          else if (bf < 25) bfCat = 'Average';
          else bfCat = 'Obese';
        } else {
          if (bf < 14) bfCat = 'Essential fat';
          else if (bf < 21) bfCat = 'Athletes';
          else if (bf < 25) bfCat = 'Fitness';
          else if (bf < 32) bfCat = 'Average';
          else bfCat = 'Obese';
        }
        document.getElementById('bf-cat').textContent = bfCat;
      } else {
        bfCard.style.display = 'none';
      }
    } else {
      bfCard.style.display = 'none';
    }
  }

  // Unit toggle
  unitBtns.forEach(b => b.addEventListener('click', () => {
    unitBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    unit = b.dataset.unit;
    if (unit === 'metric') {
      metricInputs.style.display = 'contents';
      imperialInputs.style.display = 'none';
      waistLabel.textContent = 'Waist (cm)';
      neckLabel.textContent = 'Neck (cm)';
      hipLabel.textContent = 'Hip (cm)';
    } else {
      metricInputs.style.display = 'none';
      imperialInputs.style.display = 'contents';
      waistLabel.textContent = 'Waist (in)';
      neckLabel.textContent = 'Neck (in)';
      hipLabel.textContent = 'Hip (in)';
    }
    calc();
  }));

  // Sex — show hip for female
  sexEl.addEventListener('change', () => {
    hipRow.style.display = sexEl.value === 'female' ? '' : 'none';
    calc();
  });

  // Live update for all inputs
  const allInputs = [hCm, wKg, hFt, hIn, wLb, ageEl, activityEl, waistEl, neckEl, hipEl];
  allInputs.forEach(i => i.addEventListener('input', calc));

  // Unit conversion for waist/neck/hip when toggled: simpler to keep user entered — just relabel
  calc();
})();
