/**
 * Markdown TOC Generator — GitHub-style slugs
 */

const inputEl = document.getElementById('input');
const minEl = document.getElementById('min-depth');
const maxEl = document.getElementById('max-depth');
const orderedEl = document.getElementById('ordered');
const output = document.getElementById('output');
const statusMsg = document.getElementById('status-msg');

function slugify(heading) {
  // GitHub slugify: lowercase, strip non-alphanumeric except dashes/spaces, collapse spaces to dashes
  return heading.toLowerCase()
    .replace(/[^\w\s-]/g, '')  // strip punctuation except dash, underscore, word chars
    .trim()
    .replace(/\s+/g, '-');
}

function build() {
  const text = inputEl.value;
  const minD = Math.max(1, Math.min(6, parseInt(minEl.value, 10) || 2));
  const maxD = Math.max(minD, Math.min(6, parseInt(maxEl.value, 10) || 4));
  const ordered = orderedEl.checked;

  // Extract headings outside code blocks
  const lines = text.split('\n');
  const headings = [];
  let inCodeBlock = false;
  for (const line of lines) {
    if (/^```/.test(line)) { inCodeBlock = !inCodeBlock; continue; }
    if (inCodeBlock) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (m) headings.push({ depth: m[1].length, text: m[2] });
  }

  // Filter by depth
  const filtered = headings.filter(h => h.depth >= minD && h.depth <= maxD);
  // Track duplicate slugs
  const slugCount = new Map();

  // Build TOC
  const tocLines = filtered.map(h => {
    let slug = slugify(h.text);
    const count = slugCount.get(slug) || 0;
    slugCount.set(slug, count + 1);
    if (count > 0) slug += '-' + count;
    const indent = '  '.repeat(h.depth - minD);
    const bullet = ordered ? '1.' : '-';
    return `${indent}${bullet} [${h.text}](#${slug})`;
  });

  output.textContent = tocLines.length ? tocLines.join('\n') : '— (no headings found in selected depth range)';
}

[inputEl, minEl, maxEl, orderedEl].forEach(el => el.addEventListener('input', build));
orderedEl.addEventListener('change', build);

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent);
  statusMsg.textContent = '✓ Copied'; statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
});

build();
