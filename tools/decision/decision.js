/**
 * Yes/No Decision Maker
 */

let mode = 'yn';
const answerEl = document.getElementById('answer');
const decideBtn = document.getElementById('decide-btn');
const reaction = document.getElementById('reaction');
const customList = document.getElementById('custom-list');

const REACTIONS = [
  '…feel relieved? then it was a yes anyway.',
  '…feel disappointed? then you wanted the other one.',
  '…not sure how you feel? roll again.',
  'noticed your gut reaction yet?',
  'the magic is in the noticing, not the result.',
];

document.querySelectorAll('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    document.querySelector('.mode-custom').style.display = mode === 'custom' ? '' : 'none';
  });
});

decideBtn.addEventListener('click', () => {
  answerEl.classList.add('spinning');
  answerEl.classList.remove('yes', 'no', 'maybe', 'custom');
  decideBtn.disabled = true;
  reaction.textContent = '';

  setTimeout(() => {
    let options;
    if (mode === 'yn') options = [{ t: 'Yes', cls: 'yes' }, { t: 'No', cls: 'no' }];
    else if (mode === 'ynm') options = [{ t: 'Yes', cls: 'yes' }, { t: 'No', cls: 'no' }, { t: 'Maybe', cls: 'maybe' }];
    else {
      const lines = customList.value.split('\n').map(s => s.trim()).filter(Boolean);
      options = lines.length ? lines.map(t => ({ t, cls: 'custom' })) : [{ t: '(add options)', cls: 'custom' }];
    }
    const max = Math.floor(0x100000000 / options.length) * options.length;
    const arr = new Uint32Array(1);
    do { crypto.getRandomValues(arr); } while (arr[0] >= max);
    const pick = options[arr[0] % options.length];

    answerEl.classList.remove('spinning');
    answerEl.className = 'answer ' + pick.cls;
    answerEl.textContent = pick.t;
    reaction.textContent = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    decideBtn.disabled = false;
  }, 800);
});
