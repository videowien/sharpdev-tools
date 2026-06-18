/**
 * Text Shadow Generator — single custom shadow plus curated presets.
 */
const preview = document.getElementById('ts-preview');
const textEl = document.getElementById('ts-text');
const tsX = document.getElementById('ts-x');
const tsY = document.getElementById('ts-y');
const tsBlur = document.getElementById('ts-blur');
const tsAlpha = document.getElementById('ts-alpha');
const tsColor = document.getElementById('ts-color');
const tsHex = document.getElementById('ts-hex');
const tsTextColor = document.getElementById('ts-text-color');
const tsTextHex = document.getElementById('ts-text-hex');
const presetsEl = document.getElementById('ts-presets');
const codeOut = document.getElementById('code-out');
const copyBtn = document.getElementById('copy-btn');

const PRESETS = [
  { name: 'Subtle',  shadow: '0 2px 4px rgba(0,0,0,0.5)',                                 text: '#ffffff' },
  { name: 'Hard drop', shadow: '4px 4px 0 rgba(0,0,0,1)',                                  text: '#ffffff' },
  { name: 'Emboss',  shadow: '1px 1px 0 #fff, -1px -1px 0 rgba(0,0,0,0.8)',                text: '#888888' },
  { name: 'Glow',    shadow: '0 0 8px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5)', text: '#ffffff' },
  { name: 'Neon',    shadow: '0 0 4px #fff, 0 0 12px #ff4444, 0 0 24px #ff4444, 0 0 40px #ff4444', text: '#ffffff' },
  { name: '3D',      shadow: '1px 1px 0 #bbb, 2px 2px 0 #aaa, 3px 3px 0 #999, 4px 4px 0 #888, 5px 5px 10px rgba(0,0,0,0.5)', text: '#ffffff' },
  { name: 'Retro',   shadow: '4px 4px 0 #ff4444, 8px 8px 0 #ffce3a',                       text: '#1a1a1a' },
  { name: 'Soft',    shadow: '0 10px 30px rgba(0,0,0,0.35)',                                text: '#ffffff' },
];

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
}

let currentMode = 'custom'; // 'custom' or preset name

function updateFromControls() {
  currentMode = 'custom';
  [...presetsEl.children].forEach(b => b.classList.remove('active'));

  const x = parseInt(tsX.value, 10);
  const y = parseInt(tsY.value, 10);
  const blur = parseInt(tsBlur.value, 10);
  const alpha = parseInt(tsAlpha.value, 10);

  tsX.nextElementSibling.textContent = `${x}px`;
  tsY.nextElementSibling.textContent = `${y}px`;
  tsBlur.nextElementSibling.textContent = `${blur}px`;
  tsAlpha.nextElementSibling.textContent = `${alpha}%`;

  const shadow = `${x}px ${y}px ${blur}px ${hexToRgba(tsColor.value, alpha)}`;
  textEl.style.textShadow = shadow;
  textEl.style.color = tsTextColor.value;
  codeOut.textContent = `text-shadow: ${shadow};\ncolor: ${tsTextColor.value};`;
}

function applyPreset(p) {
  textEl.style.textShadow = p.shadow;
  textEl.style.color = p.text;
  tsTextColor.value = p.text;
  tsTextHex.value = p.text;
  currentMode = p.name;
  [...presetsEl.children].forEach(b => b.classList.toggle('active', b.dataset.name === p.name));
  codeOut.textContent = `text-shadow: ${p.shadow};\ncolor: ${p.text};`;
}

PRESETS.forEach(p => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ts-preset-btn';
  btn.dataset.name = p.name;
  btn.textContent = p.name;
  btn.addEventListener('click', () => applyPreset(p));
  presetsEl.appendChild(btn);
});

[tsX, tsY, tsBlur, tsAlpha].forEach(el => el.addEventListener('input', updateFromControls));

function syncColor(pick, hex) {
  pick.addEventListener('input', () => { hex.value = pick.value; updateFromControls(); });
  hex.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/.test(hex.value)) { pick.value = hex.value; updateFromControls(); }
  });
}
syncColor(tsColor, tsHex);
tsTextColor.addEventListener('input', () => { tsTextHex.value = tsTextColor.value; updateFromControls(); });
tsTextHex.addEventListener('input', () => {
  if (/^#[0-9a-fA-F]{6}$/.test(tsTextHex.value)) { tsTextColor.value = tsTextHex.value; updateFromControls(); }
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(codeOut.textContent);
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 1200);
  } catch { copyBtn.textContent = 'Failed'; }
});

updateFromControls();
