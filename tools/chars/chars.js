/**
 * Character Counter — SharpDev Tools
 */

const PLATFORMS = [
  { name: 'Twitter / X', limit: 280, note: 'post' },
  { name: 'Bluesky', limit: 300, note: 'post' },
  { name: 'Threads', limit: 500, note: 'post' },
  { name: 'SMS', limit: 160, note: 'single message' },
  { name: 'Instagram caption', limit: 2200, note: 'caption' },
  { name: 'Instagram bio', limit: 150, note: 'bio' },
  { name: 'Facebook post', limit: 63206, note: 'post' },
  { name: 'LinkedIn post', limit: 3000, note: 'post' },
  { name: 'LinkedIn headline', limit: 220, note: 'headline' },
  { name: 'TikTok caption', limit: 2200, note: 'caption' },
  { name: 'YouTube title', limit: 100, note: 'title' },
  { name: 'YouTube description', limit: 5000, note: 'description' },
  { name: 'Meta description (SEO)', limit: 160, note: 'search snippet' },
  { name: 'Title tag (SEO)', limit: 60, note: 'search result title' },
  { name: 'Email subject', limit: 50, note: 'mobile-friendly' },
];

const textIn = document.getElementById('text-in');
const quickStats = document.getElementById('quick-stats');
const platformGrid = document.getElementById('platform-grid');

function update() {
  const text = textIn.value;

  // Character counts
  const charsTotal = [...text].length; // proper Unicode count
  const charsNoSpaces = [...text.replace(/\s/g, '')].length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split('\n').length : 0;
  const sentences = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length : 0;

  quickStats.innerHTML = `
    <div class="stat-chip"><div class="stat-val">${charsTotal.toLocaleString()}</div><div class="stat-label">Characters</div></div>
    <div class="stat-chip"><div class="stat-val">${charsNoSpaces.toLocaleString()}</div><div class="stat-label">No spaces</div></div>
    <div class="stat-chip"><div class="stat-val">${words.toLocaleString()}</div><div class="stat-label">Words</div></div>
    <div class="stat-chip"><div class="stat-val">${sentences.toLocaleString()}</div><div class="stat-label">Sentences</div></div>
    <div class="stat-chip"><div class="stat-val">${lines.toLocaleString()}</div><div class="stat-label">Lines</div></div>
  `;

  // Platforms
  platformGrid.innerHTML = PLATFORMS.map(p => {
    const pct = p.limit ? Math.min(100, (charsTotal / p.limit) * 100) : 0;
    let status = 'ok';
    if (charsTotal > p.limit) status = 'over';
    else if (charsTotal > p.limit * 0.9) status = 'warn';

    const remaining = p.limit - charsTotal;
    const remText = remaining >= 0 ? `${remaining} left` : `${Math.abs(remaining)} over`;

    return `
      <div class="platform ${status}">
        <div class="p-header">
          <div><span class="p-name">${p.name}</span><span class="p-note">${p.note}</span></div>
          <span class="p-count"><span class="used">${charsTotal}</span> / ${p.limit}</span>
        </div>
        <div class="p-bar"><div class="p-fill" style="width:${pct}%"></div></div>
        <div class="p-count" style="margin-top:6px;text-align:right">${remText}</div>
      </div>
    `;
  }).join('');
}

update();
