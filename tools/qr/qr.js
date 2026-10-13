/**
 * QR Code Generator — SharpDev Tools
 * 100% browser-side. No server, no tracking, no redirects.
 * Uses qrcode-generator library (MIT license).
 */

let currentType = 'url';
let currentData = '';
let qrModules = null; // store for SVG export
let qrModuleCount = 0;

const canvas = document.getElementById('qr-canvas');
const ctx = canvas.getContext('2d');
const canvasWrap = document.getElementById('qr-canvas-wrap');
const placeholder = document.getElementById('qr-placeholder');
const downloadRow = document.getElementById('download-row');
const infoEl = document.getElementById('qr-info');
const placeholderP = placeholder ? placeholder.querySelector('p') : null;
const ORIGINAL_PLACEHOLDER = placeholderP ? placeholderP.textContent : '';

function setType(type) {
  currentType = type;
  // Update tabs
  document.querySelectorAll('.type-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.type === type);
  });
  // Show/hide inputs
  document.querySelectorAll('.type-input').forEach(el => {
    el.style.display = el.id === 'input-' + type ? 'block' : 'none';
  });
  generate();
}

function getContent() {
  switch (currentType) {
    case 'url': {
      let val = document.getElementById('input-url-val').value.trim();
      if (val && !/^https?:\/\//i.test(val) && !val.startsWith('mailto:')) val = 'https://' + val;
      return val;
    }
    case 'text':
      return document.getElementById('input-text-val').value;
    case 'email': {
      const email = document.getElementById('input-email-val').value.trim();
      return email ? 'mailto:' + email : '';
    }
    case 'wifi': {
      const ssid = document.getElementById('input-wifi-ssid').value;
      const pass = document.getElementById('input-wifi-pass').value;
      const enc = document.getElementById('input-wifi-enc').value;
      if (!ssid) return '';
      // WiFi QR format: WIFI:T:<enc>;S:<ssid>;P:<password>;;
      const escapedSsid = ssid.replace(/[\\;,:]/g, '\\$&');
      const escapedPass = pass.replace(/[\\;,:]/g, '\\$&');
      return `WIFI:T:${enc};S:${escapedSsid};P:${escapedPass};;`;
    }
    case 'phone': {
      const phone = document.getElementById('input-phone-val').value.trim();
      return phone ? 'tel:' + phone : '';
    }
    default:
      return '';
  }
}

let generateTimer = null;
function generate() {
  // Update color hex displays
  document.getElementById('qr-fg-hex').textContent = document.getElementById('qr-fg').value;
  document.getElementById('qr-bg-hex').textContent = document.getElementById('qr-bg').value;

  clearTimeout(generateTimer);
  generateTimer = setTimeout(doGenerate, 100);
}

function doGenerate() {
  const content = getContent();
  currentData = content;

  if (!content) {
    canvasWrap.style.display = 'none';
    placeholder.style.display = 'block';
    if (placeholderP) placeholderP.textContent = ORIGINAL_PLACEHOLDER;
    downloadRow.style.display = 'none';
    infoEl.textContent = '';
    qrModules = null;
    return;
  }

  const errLevel = document.getElementById('qr-errlevel').value;
  const cellSize = parseInt(document.getElementById('qr-size').value);
  const fg = document.getElementById('qr-fg').value;
  const bg = document.getElementById('qr-bg').value;

  // Map error level
  const errMap = { L: 1, M: 0, Q: 3, H: 2 }; // qrcode-generator uses 0=M, 1=L, 2=H, 3=Q
  const typeNumber = 0; // auto-detect

  try {
    const qr = qrcode(typeNumber, errLevel);
    qr.addData(content);
    qr.make();

    const count = qr.getModuleCount();
    qrModuleCount = count;
    const margin = 4; // quiet zone in modules
    const totalModules = count + margin * 2;
    const size = totalModules * cellSize;

    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // Modules
    ctx.fillStyle = fg;
    // Store module data for SVG export
    qrModules = [];
    for (let row = 0; row < count; row++) {
      const moduleRow = [];
      for (let col = 0; col < count; col++) {
        const dark = qr.isDark(row, col);
        moduleRow.push(dark);
        if (dark) {
          ctx.fillRect((col + margin) * cellSize, (row + margin) * cellSize, cellSize, cellSize);
        }
      }
      qrModules.push(moduleRow);
    }

    // Show
    placeholder.style.display = 'none';
    canvasWrap.style.display = 'flex';
    downloadRow.style.display = 'flex';

    const charCount = content.length;
    infoEl.textContent = `${count}x${count} modules \u2022 ${size}x${size}px \u2022 ${charCount} characters`;

  } catch (e) {
    placeholder.style.display = 'block';
    placeholder.querySelector('p').textContent = 'Content too long for QR code. Try shorter text or lower error correction.';
    canvasWrap.style.display = 'none';
    downloadRow.style.display = 'none';
    infoEl.textContent = '';
    qrModules = null;
  }
}

function downloadPng() {
  if (!currentData) return;
  // Re-render at high resolution for download (3x current size)
  const errLevel = document.getElementById('qr-errlevel').value;
  const cellSize = parseInt(document.getElementById('qr-size').value) * 3;
  const fg = document.getElementById('qr-fg').value;
  const bg = document.getElementById('qr-bg').value;

  const qr = qrcode(0, errLevel);
  qr.addData(currentData);
  qr.make();

  const count = qr.getModuleCount();
  const margin = 4;
  const totalModules = count + margin * 2;
  const size = totalModules * cellSize;

  const offscreen = document.createElement('canvas');
  offscreen.width = size;
  offscreen.height = size;
  const offCtx = offscreen.getContext('2d');

  offCtx.fillStyle = bg;
  offCtx.fillRect(0, 0, size, size);
  offCtx.fillStyle = fg;
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) {
        offCtx.fillRect((col + margin) * cellSize, (row + margin) * cellSize, cellSize, cellSize);
      }
    }
  }

  offscreen.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

function downloadSvg() {
  if (!qrModules || !currentData) return;

  const fg = document.getElementById('qr-fg').value;
  const bg = document.getElementById('qr-bg').value;
  const count = qrModuleCount;
  const margin = 4;
  const total = count + margin * 2;

  let paths = '';
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qrModules[row][col]) {
        paths += `<rect x="${col + margin}" y="${row + margin}" width="1" height="1"/>`;
      }
    }
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total * 10}" height="${total * 10}">
  <rect width="${total}" height="${total}" fill="${bg}"/>
  <g fill="${fg}">${paths}</g>
</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qr-code.svg';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Generate on load if there's a hash/query param
(function init() {
  const params = new URLSearchParams(window.location.search);
  const preload = params.get('text') || params.get('url');
  if (preload) {
    document.getElementById('input-url-val').value = preload;
    generate();
  }
})();
