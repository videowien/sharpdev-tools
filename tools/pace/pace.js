/**
 * Running Pace Calculator — bidirectional pace/time/distance.
 * Edit any field, others recompute. lastEdited tracks which to hold constant.
 */

const MI_PER_KM = 0.621371;
const KM_PER_MI = 1.609344;

const els = {
  distVal: document.getElementById('dist-val'),
  distUnit: document.getElementById('dist-unit'),
  timeH: document.getElementById('time-h'),
  timeM: document.getElementById('time-m'),
  timeS: document.getElementById('time-s'),
  paceKmM: document.getElementById('pace-km-m'),
  paceKmS: document.getElementById('pace-km-s'),
  paceMiM: document.getElementById('pace-mi-m'),
  paceMiS: document.getElementById('pace-mi-s'),
};

// 'dist' | 'time' | 'paceKm' | 'paceMi' — last user-edited input. We compute the other two.
// Default state: distance + time → derive pace.
let lastEdited = 'time';

function distInKm() {
  const v = parseFloat(els.distVal.value) || 0;
  return els.distUnit.value === 'mi' ? v * KM_PER_MI : v;
}
function setDistKm(km) {
  els.distVal.value = (els.distUnit.value === 'mi' ? km * MI_PER_KM : km).toFixed(2);
}
function getTimeSec() {
  return (parseInt(els.timeH.value, 10) || 0) * 3600
       + (parseInt(els.timeM.value, 10) || 0) * 60
       + (parseInt(els.timeS.value, 10) || 0);
}
function setTimeSec(sec) {
  sec = Math.max(0, Math.round(sec));
  els.timeH.value = Math.floor(sec / 3600);
  els.timeM.value = Math.floor((sec % 3600) / 60);
  els.timeS.value = sec % 60;
}
function getPaceKmSec() {
  return (parseInt(els.paceKmM.value, 10) || 0) * 60 + (parseInt(els.paceKmS.value, 10) || 0);
}
function setPaceKmSec(sec) {
  sec = Math.max(0, Math.round(sec));
  els.paceKmM.value = Math.floor(sec / 60);
  els.paceKmS.value = sec % 60;
}
function getPaceMiSec() {
  return (parseInt(els.paceMiM.value, 10) || 0) * 60 + (parseInt(els.paceMiS.value, 10) || 0);
}
function setPaceMiSec(sec) {
  sec = Math.max(0, Math.round(sec));
  els.paceMiM.value = Math.floor(sec / 60);
  els.paceMiS.value = sec % 60;
}

function fmtTime(sec) {
  sec = Math.round(sec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}
function pad(n) { return String(n).padStart(2, '0'); }

function recompute() {
  const km = distInKm();
  if (lastEdited === 'time' || lastEdited === 'dist') {
    // Have distance + time → derive pace
    const sec = getTimeSec();
    if (km > 0 && sec > 0) {
      const paceKm = sec / km;
      setPaceKmSec(paceKm);
      setPaceMiSec(paceKm * KM_PER_MI);
    }
  } else if (lastEdited === 'paceKm') {
    const paceKm = getPaceKmSec();
    if (km > 0 && paceKm > 0) {
      setTimeSec(paceKm * km);
      setPaceMiSec(paceKm * KM_PER_MI);
    }
  } else if (lastEdited === 'paceMi') {
    const paceMi = getPaceMiSec();
    if (km > 0 && paceMi > 0) {
      const paceKm = paceMi / KM_PER_MI;
      setPaceKmSec(paceKm);
      setTimeSec(paceKm * km);
    }
  }
  renderSplits();
}

function renderSplits() {
  const paceKm = getPaceKmSec();
  const body = document.getElementById('splits-body');
  body.innerHTML = '';
  if (paceKm <= 0) return;
  const distances = [
    { name: '1 km', km: 1 },
    { name: '1 mile', km: KM_PER_MI },
    { name: '5K', km: 5 },
    { name: '10K', km: 10 },
    { name: 'Half marathon (21.0975 km)', km: 21.0975 },
    { name: 'Marathon (42.195 km)', km: 42.195 },
    { name: '50K ultra', km: 50 },
  ];
  for (const d of distances) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${d.name}</td><td>${fmtTime(paceKm * d.km)}</td>`;
    body.appendChild(tr);
  }
}

[els.distVal, els.distUnit].forEach(el => el.addEventListener('input', () => { lastEdited = 'dist'; recompute(); }));
[els.timeH, els.timeM, els.timeS].forEach(el => el.addEventListener('input', () => { lastEdited = 'time'; recompute(); }));
[els.paceKmM, els.paceKmS].forEach(el => el.addEventListener('input', () => { lastEdited = 'paceKm'; recompute(); }));
[els.paceMiM, els.paceMiS].forEach(el => el.addEventListener('input', () => { lastEdited = 'paceMi'; recompute(); }));

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    els.distVal.value = btn.dataset.dist;
    els.distUnit.value = btn.dataset.unit;
    lastEdited = 'paceKm'; // keep current pace, derive new time
    recompute();
  });
});

document.getElementById('reset-btn').addEventListener('click', () => {
  els.distVal.value = 10; els.distUnit.value = 'km';
  els.timeH.value = 0; els.timeM.value = 50; els.timeS.value = 0;
  lastEdited = 'time';
  recompute();
});

recompute();
