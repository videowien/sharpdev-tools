/**
 * Coin Flip — cryptographically random single-flip and batch-100.
 */
const coin = document.getElementById('coin');
const resultLabel = document.getElementById('result-label');
const flipOnceBtn = document.getElementById('flip-once');
const flip100Btn = document.getElementById('flip-100');
const resetBtn = document.getElementById('reset-btn');
const statsPanel = document.getElementById('stats-panel');
const statHeads = document.getElementById('stat-heads');
const statTails = document.getElementById('stat-tails');
const statRatio = document.getElementById('stat-ratio');
const statStreak = document.getElementById('stat-streak');
const seqPanel = document.getElementById('sequence-panel');
const seqEl = document.getElementById('sequence');

let rotation = 0; // running transform angle
let history = []; // 'H' or 'T'

function flipOne() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] & 1) === 0 ? 'H' : 'T';
}

function flipBatch(n) {
  const arr = [];
  const buf = new Uint32Array(Math.ceil(n / 32));
  crypto.getRandomValues(buf);
  for (let i = 0; i < n; i++) {
    const word = Math.floor(i / 32);
    const bit = i % 32;
    arr.push(((buf[word] >>> bit) & 1) === 0 ? 'H' : 'T');
  }
  return arr;
}

function animateCoin(finalSide) {
  // Coin shows Heads at 0deg, Tails at 180deg (base orientation).
  const targetBase = finalSide === 'H' ? 0 : 180;
  // Rotate between 3 and 5 full turns, landing on the correct side
  const extraTurns = 3 + Math.floor(Math.random() * 3);
  rotation += extraTurns * 360 + (targetBase - (rotation % 360) + 360) % 360;
  coin.classList.add('flipping');
  coin.style.transform = `rotateY(${rotation}deg)`;
  setTimeout(() => coin.classList.remove('flipping'), 1600);
}

function longestStreak(arr) {
  let max = 0, cur = 0, last = null;
  for (const v of arr) {
    if (v === last) cur++;
    else { cur = 1; last = v; }
    if (cur > max) max = cur;
  }
  return max;
}

function renderStats() {
  if (history.length === 0) { statsPanel.style.display = 'none'; seqPanel.style.display = 'none'; return; }
  const h = history.filter(v => v === 'H').length;
  const t = history.length - h;
  statHeads.textContent = h;
  statTails.textContent = t;
  const ratio = t === 0 ? '—' : (h / t).toFixed(2);
  statRatio.textContent = ratio;
  statStreak.textContent = longestStreak(history);
  statsPanel.style.display = 'grid';

  // Only show sequence when we have more than one flip to make it worth the space
  if (history.length > 1) {
    seqPanel.style.display = 'block';
    seqEl.innerHTML = history
      .map(v => `<span class="${v === 'H' ? 'h' : 't'}">${v}</span>`)
      .join('');
  } else {
    seqPanel.style.display = 'none';
  }
  resetBtn.style.display = 'inline-flex';
}

flipOnceBtn.addEventListener('click', () => {
  flipOnceBtn.disabled = true;
  flip100Btn.disabled = true;
  const side = flipOne();
  animateCoin(side);
  history.push(side);
  setTimeout(() => {
    resultLabel.textContent = side === 'H' ? 'Heads' : 'Tails';
    flipOnceBtn.disabled = false;
    flip100Btn.disabled = false;
    renderStats();
  }, 1550);
});

flip100Btn.addEventListener('click', () => {
  flipOnceBtn.disabled = true;
  flip100Btn.disabled = true;
  const batch = flipBatch(100);
  const last = batch[batch.length - 1];
  animateCoin(last);
  history.push(...batch);
  setTimeout(() => {
    const h = batch.filter(v => v === 'H').length;
    resultLabel.textContent = `100 flips: ${h}H / ${100 - h}T`;
    flipOnceBtn.disabled = false;
    flip100Btn.disabled = false;
    renderStats();
  }, 1550);
});

resetBtn.addEventListener('click', () => {
  history = [];
  resultLabel.textContent = 'Ready';
  renderStats();
  resetBtn.style.display = 'none';
});
