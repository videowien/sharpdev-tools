/** Random Number Generator — crypto, with unique + sorted options */
const $ = id => document.getElementById(id);
const minE = $('rn-min'), maxE = $('rn-max'), cntE = $('rn-count'), uniqE = $('rn-unique'), sortE = $('rn-sort');
const gen = $('rn-gen'), err = $('rn-err'), out = $('rn-output');
out.textContent = 'Click Generate.';
out.classList.add('empty');

function randomInt(min, max) {
  const range = max - min + 1;
  const bits = Math.ceil(Math.log2(range));
  const bytes = Math.ceil(bits / 8);
  const maxValid = Math.floor((256 ** bytes) / range) * range;
  const buf = new Uint8Array(bytes);
  while (true) {
    crypto.getRandomValues(buf);
    let v = 0;
    for (let i = 0; i < bytes; i++) v = v * 256 + buf[i];
    if (v < maxValid) return min + (v % range);
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

gen.addEventListener('click', () => {
  err.textContent = '';
  const min = parseInt(minE.value, 10);
  const max = parseInt(maxE.value, 10);
  const count = parseInt(cntE.value, 10);
  if (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(count)) {
    err.textContent = 'Min, max and count must be integers.'; return;
  }
  if (min >= max) { err.textContent = 'Max must be greater than min.'; return; }
  if (count < 1 || count > 10000) { err.textContent = 'Count must be between 1 and 10000.'; return; }
  const range = max - min + 1;
  if (uniqE.checked && count > range) {
    err.textContent = `Cannot pick ${count} unique numbers from range of ${range}.`; return;
  }
  let results;
  if (uniqE.checked) {
    // Fisher-Yates over a pool for unique sampling
    const pool = Array.from({ length: range }, (_, i) => i + min);
    shuffle(pool);
    results = pool.slice(0, count);
  } else {
    results = Array.from({ length: count }, () => randomInt(min, max));
  }
  if (sortE.checked) results.sort((a, b) => a - b);
  out.textContent = results.join(', ');
  out.classList.remove('empty');
});
