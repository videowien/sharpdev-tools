/**
 * Tweet to Image — SharpDev Tools
 * Renders a tweet-styled card in DOM, captures it with html2canvas, downloads PNG.
 */

const elName = document.getElementById('f-name');
const elHandle = document.getElementById('f-handle');
const elText = document.getElementById('f-text');
const elDate = document.getElementById('f-date');
const elVerified = document.getElementById('f-verified');
const elReplies = document.getElementById('f-replies');
const elRetweets = document.getElementById('f-retweets');
const elLikes = document.getElementById('f-likes');
const elViews = document.getElementById('f-views');
const elShowEngagement = document.getElementById('f-show-engagement');
const themeInputs = document.querySelectorAll('input[name="theme"]');
const downloadBtn = document.getElementById('download-btn');
const statusMsg = document.getElementById('status-msg');

const canvas = document.getElementById('tweet-canvas');
const tName = document.getElementById('tw-name');
const tHandle = document.getElementById('tw-handle');
const tText = document.getElementById('tw-text');
const tDate = document.getElementById('tw-date');
const tVerified = document.getElementById('tw-verified');
const tAvatar = document.getElementById('tw-avatar');
const tEngagement = document.getElementById('tw-engagement');
const engReplies = document.getElementById('eng-replies');
const engRetweets = document.getElementById('eng-retweets');
const engLikes = document.getElementById('eng-likes');
const engViews = document.getElementById('eng-views');

function avatarInit(name) {
  return (name.trim()[0] || '?').toUpperCase();
}

function update() {
  const name = elName.value || ' ';
  const handle = elHandle.value || ' ';
  tName.textContent = name;
  tHandle.textContent = handle;
  tText.textContent = elText.value;
  tDate.textContent = elDate.value;
  tAvatar.textContent = avatarInit(name);
  tVerified.style.display = elVerified.checked ? '' : 'none';
  engReplies.textContent = elReplies.value;
  engRetweets.textContent = elRetweets.value;
  engLikes.textContent = elLikes.value;
  engViews.textContent = elViews.value;
  tEngagement.style.display = elShowEngagement.checked ? '' : 'none';

  // Theme
  canvas.classList.remove('tw-light', 'tw-dim', 'tw-dark');
  const theme = document.querySelector('input[name="theme"]:checked').value;
  canvas.classList.add('tw-' + theme);
}

[elName, elHandle, elText, elDate, elReplies, elRetweets, elLikes, elViews].forEach((el) =>
  el.addEventListener('input', update)
);
elVerified.addEventListener('change', update);
elShowEngagement.addEventListener('change', update);
themeInputs.forEach((r) => r.addEventListener('change', update));

downloadBtn.addEventListener('click', async () => {
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Rendering...';
  statusMsg.textContent = '';
  try {
    update();
    // Determine background color from theme for transparent edges
    const theme = document.querySelector('input[name="theme"]:checked').value;
    const bg = theme === 'light' ? '#ffffff' : theme === 'dim' ? '#15202b' : '#000000';
    const result = await html2canvas(canvas, {
      backgroundColor: bg,
      scale: 2,
      useCORS: true,
      logging: false,
    });
    result.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tweet-${(elHandle.value || 'user').replace(/[^a-zA-Z0-9-]/g, '')}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
    statusMsg.textContent = '✓ PNG saved';
    statusMsg.className = 'status-msg ok';
  } catch (e) {
    statusMsg.textContent = 'Error: ' + (e.message || e);
    statusMsg.className = 'status-msg err';
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download PNG';
  }
});

update();
