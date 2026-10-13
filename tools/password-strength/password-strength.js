/**
 * Password Strength Checker — entropy estimate + pattern detection (zxcvbn-lite)
 */

const pwEl = document.getElementById('pw');
const toggle = document.getElementById('toggle-pw');

toggle.addEventListener('click', () => {
  pwEl.type = pwEl.type === 'password' ? 'text' : 'password';
  toggle.textContent = pwEl.type === 'password' ? 'Show' : 'Hide';
});

// Common bad passwords (top 200)
const COMMON = new Set([
  '123456','password','12345678','qwerty','123456789','12345','1234','111111','1234567','dragon',
  '123123','baseball','abc123','football','monkey','letmein','shadow','master','666666','qwertyuiop',
  '123321','mustang','1234567890','michael','654321','superman','1qaz2wsx','7777777','121212','000000',
  'qazwsx','123qwe','killer','trustno1','jordan','jennifer','zxcvbnm','asdfgh','hunter','buster','soccer',
  'harley','batman','andrew','tigger','sunshine','iloveyou','fuckme','2000','charlie','robert','thomas',
  'hockey','ranger','daniel','starwars','klaster','112233','george','asshole','computer','michelle',
  'jessica','pepper','1111','zxcvbn','555555','11111111','131313','freedom','777777','pass','fuck',
  'maggie','159753','aaaaaa','ginger','princess','joshua','cheese','amanda','summer','love','ashley','6969',
  'nicole','chelsea','biteme','matthew','access','yankees','987654321','dallas','austin','thunder','taylor',
  'matrix','william','corvette','hello','martin','heather','secret','fucker','merlin','diamond','1234qwer',
  'gfhjkm','hammer','silver','222222','88888888','anthony','justin','test','bailey','q1w2e3r4t5','patrick',
  'internet','scooter','orange','11111','golfer','cookie','richard','samantha','bigdog','guitar','jackson',
  'whatever','mickey','chicken','sparky','snoopy','maverick','phoenix','camaro','sexy','peanut','morgan',
  'welcome','falcon','cowboy','ferrari','samsung','andrea','smokey','steelers','joseph','mercedes','dakota',
  'arsenal','eagles','melissa','boomer','booboo','spider','nascar','monster','tigers','yellow','xxxxxx',
  '123123123','gateway','marina','diablo','bulldog','qwer1234','compaq','purple','hardcore','banana',
  'junior','hannah','123654','porsche','lakers','iceman','money','cowboys','987654','london','tennis',
  'love123','hellokitty','sharpdev','admin'
]);

const KEYBOARD_ROWS = ['qwertyuiop','asdfghjkl','zxcvbnm','1234567890','0987654321','poiuytrewq'];

pwEl.addEventListener('input', update);

function update() {
  const pw = pwEl.value;
  const len = pw.length;
  document.getElementById('r-length').textContent = len;

  if (len === 0) {
    setEntropy(0);
    document.getElementById('findings').innerHTML = '';
    document.getElementById('r-online').textContent = '—';
    document.getElementById('r-offline').textContent = '—';
    return;
  }

  // Character class detection
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  let charset = 0;
  if (hasLower) charset += 26;
  if (hasUpper) charset += 26;
  if (hasDigit) charset += 10;
  if (hasSymbol) charset += 33;

  // Base entropy estimate
  let entropy = len * Math.log2(charset || 1);

  // Penalty for common patterns
  const findings = [];
  const lc = pw.toLowerCase();
  if (COMMON.has(lc)) {
    findings.push({ cls: 'bad', t: 'This is one of the most common passwords ever leaked. Avoid entirely.' });
    entropy = Math.min(entropy, 6);
  }
  // Repeated characters
  const repeatMatch = /(.)\1{2,}/.exec(pw);
  if (repeatMatch) {
    findings.push({ cls: 'warn', t: `Repeated characters detected (${JSON.stringify(repeatMatch[0])}). Reduces entropy.` });
    entropy -= 6;
  }
  // Sequential characters
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i < row.length - 3; i++) {
      const seq = row.slice(i, i + 4);
      if (lc.includes(seq)) {
        findings.push({ cls: 'warn', t: `Keyboard sequence detected ("${seq}"). Reduces entropy.` });
        entropy -= 8;
        break;
      }
    }
  }
  // 4-digit dates
  if (/\b(19|20)\d{2}\b/.test(pw)) {
    findings.push({ cls: 'warn', t: 'Year detected (1900-2099). Predictable.' });
    entropy -= 5;
  }
  // Only digits
  if (/^\d+$/.test(pw)) {
    findings.push({ cls: 'warn', t: 'Digits only. Very easy to brute-force.' });
  }
  // Length-based finding
  if (len < 8) findings.push({ cls: 'bad', t: 'Less than 8 characters — too short for any modern use.' });
  else if (len < 12) findings.push({ cls: 'warn', t: 'Under 12 characters — fine for low-value sites with rate limiting.' });
  else if (len >= 16) findings.push({ cls: 'ok', t: '16+ characters — solid baseline length.' });

  // Character class findings
  if (!hasUpper && !hasSymbol && !hasDigit && hasLower) {
    findings.push({ cls: 'warn', t: 'All lowercase. Add digits / uppercase / symbols to expand the search space.' });
  }

  entropy = Math.max(0, entropy);
  setEntropy(entropy);

  // Crack time
  const guesses = Math.pow(2, entropy);
  document.getElementById('r-online').textContent = humanTime(guesses / 100);
  document.getElementById('r-offline').textContent = humanTime(guesses / 10_000_000_000);

  // Strength label
  const strength = document.getElementById('r-strength');
  let cls, label;
  if (entropy < 28) { cls = 'veryWeak'; label = 'Very weak'; }
  else if (entropy < 40) { cls = 'weak'; label = 'Weak'; }
  else if (entropy < 60) { cls = 'fair'; label = 'Fair'; }
  else if (entropy < 90) { cls = 'strong'; label = 'Strong'; }
  else { cls = 'veryStrong'; label = 'Very strong'; }
  strength.className = 'strength ' + cls;
  strength.textContent = label;

  // Render findings
  const findEl = document.getElementById('findings');
  findEl.innerHTML = '';
  for (const f of findings) {
    const div = document.createElement('div');
    div.className = 'finding ' + f.cls;
    div.textContent = f.t;
    findEl.appendChild(div);
  }
}

function setEntropy(bits) {
  document.getElementById('r-entropy').textContent = bits.toFixed(1);
}

function humanTime(seconds) {
  if (!isFinite(seconds) || seconds <= 0) return '—';
  if (seconds < 1) return 'instantly';
  if (seconds < 60) return Math.round(seconds) + ' sec';
  if (seconds < 3600) return Math.round(seconds / 60) + ' min';
  if (seconds < 86400) return Math.round(seconds / 3600) + ' hr';
  if (seconds < 86400 * 30) return Math.round(seconds / 86400) + ' days';
  if (seconds < 86400 * 365) return Math.round(seconds / (86400 * 30)) + ' months';
  if (seconds < 86400 * 365 * 1000) return Math.round(seconds / (86400 * 365)) + ' years';
  if (seconds < 86400 * 365 * 1_000_000) return (seconds / (86400 * 365 * 1000)).toFixed(1) + 'k years';
  if (seconds < 86400 * 365 * 1_000_000_000) return (seconds / (86400 * 365 * 1_000_000)).toFixed(1) + 'M years';
  return (seconds / (86400 * 365 * 1_000_000_000)).toExponential(1) + ' B years';
}

update();
