/**
 * Sitemap Generator
 */

const urlsEl = document.getElementById('urls');
const lastmodEl = document.getElementById('lastmod');
const changefreqEl = document.getElementById('changefreq');
const priorityEl = document.getElementById('priority');
const output = document.getElementById('output');
const stat = document.getElementById('stat');
const statusMsg = document.getElementById('status-msg');

lastmodEl.value = new Date().toISOString().slice(0, 10);

function build() {
  const urls = urlsEl.value.split('\n').map(s => s.trim()).filter(Boolean);
  const valid = urls.filter(u => /^https?:\/\//.test(u));
  const invalid = urls.length - valid.length;
  stat.textContent = `${valid.length} valid URL(s)` + (invalid ? ` · ${invalid} skipped (missing http/https)` : '');

  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const u of valid) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(u)}</loc>`);
    if (lastmodEl.value) lines.push(`    <lastmod>${lastmodEl.value}</lastmod>`);
    if (changefreqEl.value) lines.push(`    <changefreq>${changefreqEl.value}</changefreq>`);
    if (priorityEl.value) lines.push(`    <priority>${priorityEl.value}</priority>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  output.textContent = lines.join('\n');
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

[urlsEl, lastmodEl, changefreqEl, priorityEl].forEach(el => el.addEventListener('input', build));

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent);
  flash('✓ Copied');
});
document.getElementById('download-btn').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'sitemap.xml';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ Downloaded');
});

function flash(msg) { statusMsg.textContent = msg; statusMsg.className = 'status-msg ok'; setTimeout(() => { statusMsg.textContent = ''; }, 1500); }

build();
