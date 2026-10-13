/**
 * YouTube Embed Code Generator — SharpDev Tools
 */

const els = {
  url: document.getElementById('video-url'),
  width: document.getElementById('width'),
  height: document.getElementById('height'),
  responsive: document.getElementById('responsive'),
  start: document.getElementById('start'),
  autoplay: document.getElementById('autoplay'),
  mute: document.getElementById('mute'),
  loop: document.getElementById('loop'),
  controls: document.getElementById('controls'),
  modest: document.getElementById('modest'),
  rel: document.getElementById('rel'),
  nocookie: document.getElementById('nocookie'),
  output: document.getElementById('output'),
  copyBtn: document.getElementById('copy-btn'),
  statusMsg: document.getElementById('status-msg'),
  preview: document.getElementById('preview-box'),
};

function extractVideoId(url) {
  if (!url) return null;
  // Match patterns: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // raw ID
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function parseStartTime(str) {
  if (!str || !str.trim()) return null;
  str = str.trim();
  if (/^\d+$/.test(str)) return parseInt(str, 10);
  const m = str.match(/^(\d+):(\d+)$/);
  if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  const m2 = str.match(/^(\d+):(\d+):(\d+)$/);
  if (m2) return parseInt(m2[1], 10) * 3600 + parseInt(m2[2], 10) * 60 + parseInt(m2[3], 10);
  return null;
}

// The preview loads the video from YouTube (Google), so it only starts once the visitor asks for it.
let previewOn = false;
let pendingHtml = '';

function showPreview(html) {
  if (previewOn) {
    els.preview.innerHTML = html;
    return;
  }
  pendingHtml = html;
  // Keep an existing button: rebuilding it while the visitor presses it (the field's change event fires on
  // mousedown) would swallow the click.
  if (document.getElementById('load-preview')) return;
  els.preview.innerHTML = '<div class="preview-empty"><button type="button" class="btn btn-secondary" id="load-preview">Load preview</button>'
    + '<p class="preview-note">Loading the preview connects to YouTube (Google): Google receives your IP address, may store cookies or similar data on your device and may transfer data to the USA. '
    + '<a href="/datenschutz/">Privacy</a>. The code above works without the preview.</p></div>';
  document.getElementById('load-preview').addEventListener('click', () => {
    previewOn = true;
    els.preview.innerHTML = pendingHtml;
  });
}

function update() {
  const videoId = extractVideoId(els.url.value);
  if (!videoId) {
    els.output.value = '/* Paste a valid YouTube URL above */';
    els.preview.innerHTML = '<div class="preview-empty">Enter a YouTube URL above</div>';
    return;
  }

  // Toggle responsive width/height inputs
  els.width.disabled = els.responsive.checked;
  els.height.disabled = els.responsive.checked;

  const params = [];
  if (els.autoplay.checked) params.push('autoplay=1');
  if (els.mute.checked) params.push('mute=1');
  if (els.loop.checked) {
    params.push('loop=1');
    params.push('playlist=' + videoId); // required for loop to actually work
  }
  if (!els.controls.checked) params.push('controls=0');
  if (els.modest.checked) params.push('modestbranding=1');
  if (!els.rel.checked) params.push('rel=0');
  const start = parseStartTime(els.start.value);
  if (start && start > 0) params.push('start=' + start);

  const domain = els.nocookie.checked ? 'youtube-nocookie.com' : 'youtube.com';
  const src = `https://www.${domain}/embed/${videoId}${params.length ? '?' + params.join('&') : ''}`;

  let html;
  if (els.responsive.checked) {
    html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;">
  <iframe src="${src}"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen></iframe>
</div>`;
  } else {
    const w = parseInt(els.width.value, 10) || 560;
    const h = parseInt(els.height.value, 10) || 315;
    html = `<iframe width="${w}" height="${h}" src="${src}"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen></iframe>`;
  }

  els.output.value = html;
  showPreview(html);
}

Object.values(els).forEach((el) => {
  if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
    el.addEventListener('input', update);
    el.addEventListener('change', update);
  }
});

els.copyBtn.addEventListener('click', async () => {
  if (!els.output.value || els.output.value.startsWith('/*')) return;
  await navigator.clipboard.writeText(els.output.value);
  els.statusMsg.textContent = '✓ Copied';
  els.statusMsg.className = 'status-msg ok';
  setTimeout(() => { els.statusMsg.textContent = ''; }, 1500);
});

update();
