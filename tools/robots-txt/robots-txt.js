/**
 * Robots.txt Generator — visual builder
 */

const AI_AGENTS = ['GPTBot', 'ChatGPT-User', 'CCBot', 'ClaudeBot', 'Google-Extended', 'anthropic-ai', 'cohere-ai', 'PerplexityBot', 'YouBot'];

const PRESETS = {
  'allow-all': [{ ua: '*', paths: [['Disallow', '']] }],
  'block-all': [{ ua: '*', paths: [['Disallow', '/']] }],
  'block-admin': [{ ua: '*', paths: [['Disallow', '/admin/'], ['Disallow', '/private/']] }],
  'ai-block': AI_AGENTS.map(ua => ({ ua, paths: [['Disallow', '/']] }))
    .concat([{ ua: '*', paths: [['Disallow', '']] }]),
  'seo-only': [
    { ua: 'Googlebot', paths: [['Allow', '/']] },
    { ua: 'Bingbot', paths: [['Allow', '/']] },
    { ua: '*', paths: [['Disallow', '/']] },
  ],
};

let rules = []; // [{ ua: '*', paths: [['Disallow', '/path']] }]

const presetEl = document.getElementById('preset');
const sitemapEl = document.getElementById('sitemap');
const delayEl = document.getElementById('crawl-delay');
const rulesList = document.getElementById('rules-list');
const output = document.getElementById('output');
const statusMsg = document.getElementById('status-msg');

presetEl.addEventListener('change', () => {
  rules = JSON.parse(JSON.stringify(PRESETS[presetEl.value] || PRESETS['allow-all']));
  renderRules();
  build();
});

sitemapEl.addEventListener('input', build);
delayEl.addEventListener('input', build);

document.getElementById('add-rule').addEventListener('click', () => {
  rules.push({ ua: '*', paths: [['Disallow', '']] });
  renderRules();
  build();
});

function renderRules() {
  rulesList.innerHTML = '';
  rules.forEach((rule, ri) => {
    const g = document.createElement('div');
    g.className = 'rule-group';
    g.innerHTML = `
      <div class="rule-head">
        <span class="label">User-agent:</span>
        <input type="text" value="${escapeAttr(rule.ua)}"/>
        <button class="remove" type="button" aria-label="Remove">×</button>
      </div>
      <div class="rule-paths"></div>
      <button class="add-path" type="button">+ Path</button>
    `;
    const uaInput = g.querySelector('.rule-head input');
    uaInput.addEventListener('input', () => { rule.ua = uaInput.value; build(); });
    g.querySelector('.rule-head .remove').addEventListener('click', () => {
      rules.splice(ri, 1); renderRules(); build();
    });
    const pathsDiv = g.querySelector('.rule-paths');
    rule.paths.forEach((p, pi) => {
      const pd = document.createElement('div');
      pd.className = 'rule-path';
      pd.innerHTML = `
        <select>
          <option value="Disallow"${p[0] === 'Disallow' ? ' selected' : ''}>Disallow</option>
          <option value="Allow"${p[0] === 'Allow' ? ' selected' : ''}>Allow</option>
        </select>
        <input type="text" value="${escapeAttr(p[1])}" placeholder="/path/ or leave empty"/>
        <button class="x" type="button" aria-label="Remove">×</button>
      `;
      pd.querySelector('select').addEventListener('change', (e) => { rule.paths[pi][0] = e.target.value; build(); });
      pd.querySelector('input').addEventListener('input', (e) => { rule.paths[pi][1] = e.target.value; build(); });
      pd.querySelector('.x').addEventListener('click', () => { rule.paths.splice(pi, 1); renderRules(); build(); });
      pathsDiv.appendChild(pd);
    });
    g.querySelector('.add-path').addEventListener('click', () => {
      rule.paths.push(['Disallow', '']); renderRules(); build();
    });
    rulesList.appendChild(g);
  });
}

function build() {
  const lines = [];
  rules.forEach((rule, idx) => {
    if (idx > 0) lines.push('');
    lines.push(`User-agent: ${rule.ua}`);
    rule.paths.forEach(p => lines.push(`${p[0]}: ${p[1]}`));
    if (parseInt(delayEl.value, 10) > 0) lines.push(`Crawl-delay: ${parseInt(delayEl.value, 10)}`);
  });
  if (sitemapEl.value.trim()) {
    lines.push('');
    lines.push(`Sitemap: ${sitemapEl.value.trim()}`);
  }
  output.textContent = lines.join('\n');
}

function escapeAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent);
  flash('✓ Copied');
});
document.getElementById('download-btn').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'robots.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flash('✓ Downloaded');
});

function flash(msg) {
  statusMsg.textContent = msg; statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
}

// Init
presetEl.dispatchEvent(new Event('change'));
