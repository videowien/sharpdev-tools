/**
 * Spin Wheel — Canvas wheel with crypto-secure result
 */

const COLORS = ['#ff4444','#ffa726','#ffeb3b','#9ccc65','#26a69a','#42a5f5','#7e57c2','#ab47bc','#ec407a','#ef5350','#ffca28','#66bb6a'];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const entriesEl = document.getElementById('entries');
const spinBtn = document.getElementById('spin-btn');
const removeWinnerEl = document.getElementById('remove-winner');
const winnerBanner = document.getElementById('winner-banner');
const winnerName = document.getElementById('winner-name');

let entries = [];
let rotation = 0;
let isSpinning = false;

function parseEntries() {
  return entriesEl.value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 100);
}

function drawWheel() {
  entries = parseEntries();
  const size = canvas.width;
  const r = size / 2;
  ctx.clearRect(0, 0, size, size);
  if (!entries.length) {
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(r, r, r - 4, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const sliceAngle = (Math.PI * 2) / entries.length;
  entries.forEach((entry, i) => {
    const start = i * sliceAngle - Math.PI / 2;
    const end = start + sliceAngle;
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.arc(r, r, r - 4, start, end);
    ctx.closePath();
    ctx.fill();
    // Border
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(r, r);
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#111';
    const fontSize = Math.max(10, Math.min(20, 280 / entries.length + 8));
    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    let text = entry;
    if (text.length > 18) text = text.slice(0, 17) + '…';
    ctx.fillText(text, r - 18, 0);
    ctx.restore();
  });

  // Center cap
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(r, r, 8, 0, Math.PI * 2);
  ctx.fill();
}

entriesEl.addEventListener('input', drawWheel);

spinBtn.addEventListener('click', spin);

function spin() {
  entries = parseEntries();
  if (!entries.length || isSpinning) return;
  isSpinning = true;
  spinBtn.disabled = true;
  winnerBanner.style.display = 'none';

  // Pick winner securely
  const max = Math.floor(0x100000000 / entries.length) * entries.length;
  const arr = new Uint32Array(1);
  do { crypto.getRandomValues(arr); } while (arr[0] >= max);
  const winnerIdx = arr[0] % entries.length;

  // Compute target rotation: pointer is at top (12 o'clock). Slice i is centered
  // at (i * sliceDeg + sliceDeg/2) clockwise from 12 o'clock.
  // We want slice i centered at top → rotate -(centerAngle) plus 5-10 full rotations.
  const sliceDeg = 360 / entries.length;
  const centerDeg = winnerIdx * sliceDeg + sliceDeg / 2;
  const fullRotations = 6 + Math.floor(Math.random() * 3); // 6-8 spins
  const targetRot = rotation + fullRotations * 360 + (360 - centerDeg);
  rotation = targetRot;

  canvas.style.transform = `rotate(${targetRot}deg)`;
  // Match the 4s transition in CSS
  setTimeout(() => {
    isSpinning = false;
    spinBtn.disabled = false;
    showWinner(entries[winnerIdx], winnerIdx);
  }, 4100);
}

function showWinner(name, idx) {
  winnerBanner.style.display = '';
  winnerName.textContent = name;
  if (removeWinnerEl.checked) {
    entries.splice(idx, 1);
    entriesEl.value = entries.join('\n');
    // Reset rotation visually (without animation) so the wheel doesn't drift wildly
    canvas.style.transition = 'none';
    rotation = rotation % 360;
    canvas.style.transform = `rotate(${rotation}deg)`;
    setTimeout(() => {
      canvas.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.21, 1)';
      drawWheel();
    }, 50);
  }
}

drawWheel();
