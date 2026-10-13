(function(){
  const fields = {
    title: document.getElementById('f-title'),
    desc: document.getElementById('f-desc'),
    url: document.getElementById('f-url'),
    image: document.getElementById('f-image'),
    site: document.getElementById('f-site'),
    twitter: document.getElementById('f-twitter'),
    card: document.getElementById('f-card'),
    type: document.getElementById('f-type'),
    locale: document.getElementById('f-locale'),
    author: document.getElementById('f-author'),
    pub: document.getElementById('f-pub'),
  };
  const output = document.getElementById('output');
  const warnings = document.getElementById('warnings');
  const titleLimit = document.getElementById('title-limit');
  const descLimit = document.getElementById('desc-limit');
  const copyBtn = document.getElementById('copy-btn');
  const dlBtn = document.getElementById('dl-btn');

  const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#1a1a1a"/><text x="600" y="315" font-family="sans-serif" font-size="32" fill="#555" text-anchor="middle" dominant-baseline="middle">Image preview</text></svg>'
  );

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  function domainFromUrl(u) {
    try { return new URL(u).hostname.replace(/^www\./, ''); }
    catch(e) { return u || ''; }
  }

  function setImg(el, url) {
    if (!url) { el.src = PLACEHOLDER; return; }
    el.src = url;
    el.onerror = () => { el.onerror = null; el.src = PLACEHOLDER; };
  }

  function render() {
    const v = {};
    for (const k in fields) v[k] = fields[k].value.trim();

    // Previews
    document.getElementById('fb-title').textContent = v.title || 'Title';
    document.getElementById('fb-desc').textContent = v.desc || 'Description';
    document.getElementById('fb-url').textContent = domainFromUrl(v.url);
    setImg(document.getElementById('fb-img'), v.image);

    document.getElementById('tw-title').textContent = v.title || 'Title';
    document.getElementById('tw-desc').textContent = v.desc || 'Description';
    document.getElementById('tw-domain').textContent = domainFromUrl(v.url);
    setImg(document.getElementById('tw-img'), v.image);

    document.getElementById('tw-title-small').textContent = v.title || 'Title';
    document.getElementById('tw-desc-small').textContent = v.desc || 'Description';
    document.getElementById('tw-domain-small').textContent = domainFromUrl(v.url);
    setImg(document.getElementById('tw-img-small'), v.image);

    document.getElementById('dc-title').textContent = v.title || 'Title';
    document.getElementById('dc-desc').textContent = v.desc || 'Description';
    document.getElementById('dc-site').textContent = v.site || domainFromUrl(v.url) || 'Site';
    setImg(document.getElementById('dc-img'), v.image);

    // Limits
    const tLen = v.title.length;
    titleLimit.textContent = tLen + ' chars';
    titleLimit.className = 'limit' + (tLen > 60 ? ' err' : tLen > 50 ? ' warn' : '');
    const dLen = v.desc.length;
    descLimit.textContent = dLen + ' chars';
    descLimit.className = 'limit' + (dLen > 160 ? ' err' : dLen > 140 ? ' warn' : '');

    // Build meta tags
    const lines = [];
    lines.push('<title>' + escapeHtml(v.title) + '</title>');
    lines.push('<meta name="description" content="' + escapeAttr(v.desc) + '">');
    if (v.url) lines.push('<link rel="canonical" href="' + escapeAttr(v.url) + '">');
    lines.push('');
    lines.push('<!-- Open Graph -->');
    lines.push('<meta property="og:title" content="' + escapeAttr(v.title) + '">');
    lines.push('<meta property="og:description" content="' + escapeAttr(v.desc) + '">');
    lines.push('<meta property="og:type" content="' + escapeAttr(v.type) + '">');
    if (v.url) lines.push('<meta property="og:url" content="' + escapeAttr(v.url) + '">');
    if (v.image) lines.push('<meta property="og:image" content="' + escapeAttr(v.image) + '">');
    if (v.site) lines.push('<meta property="og:site_name" content="' + escapeAttr(v.site) + '">');
    if (v.locale) lines.push('<meta property="og:locale" content="' + escapeAttr(v.locale) + '">');
    if (v.type === 'article') {
      if (v.author) lines.push('<meta property="article:author" content="' + escapeAttr(v.author) + '">');
      if (v.pub) lines.push('<meta property="article:published_time" content="' + escapeAttr(v.pub) + '">');
    }
    lines.push('');
    lines.push('<!-- Twitter -->');
    lines.push('<meta name="twitter:card" content="' + escapeAttr(v.card) + '">');
    lines.push('<meta name="twitter:title" content="' + escapeAttr(v.title) + '">');
    lines.push('<meta name="twitter:description" content="' + escapeAttr(v.desc) + '">');
    if (v.image) lines.push('<meta name="twitter:image" content="' + escapeAttr(v.image) + '">');
    if (v.twitter) {
      const handle = v.twitter.startsWith('@') ? v.twitter : '@' + v.twitter;
      lines.push('<meta name="twitter:site" content="' + escapeAttr(handle) + '">');
      lines.push('<meta name="twitter:creator" content="' + escapeAttr(handle) + '">');
    }

    // Syntax highlight
    const raw = lines.join('\n');
    output.innerHTML = highlight(raw);

    // Warnings
    const warns = [];
    if (tLen > 60) warns.push('Title over 60 chars — may be truncated.');
    if (dLen > 160) warns.push('Description over 160 chars — may be truncated.');
    if (!v.image) warns.push('No image URL — social previews will look empty.');
    if (v.image && !/^https?:\/\//.test(v.image)) warns.push('Image URL should be absolute (https://).');
    if (v.url && !/^https?:\/\//.test(v.url)) warns.push('Canonical URL should be absolute (https://).');
    warns.push('Recommended image size: 1200×630 pixels.');
    warnings.innerHTML = warns.map(w => '<div class="warn-item">' + escapeHtml(w) + '</div>').join('');
  }

  function highlight(raw) {
    const esc = escapeHtml(raw);
    // Highlight comments
    let html = esc.replace(/(&lt;!--[^]*?--&gt;)/g, '<span style="color:#666">$1</span>');
    // Tags
    html = html.replace(/(&lt;\/?)([a-zA-Z][\w:-]*)/g, '$1<span class="tag">$2</span>');
    // Attributes
    html = html.replace(/([a-zA-Z][\w:-]*)=(&quot;)([^&]*?)(&quot;)/g,
      '<span class="attr">$1</span>=$2<span class="val">$3</span>$4');
    return html;
  }

  function plainText() {
    // Strip the HTML highlighting
    return output.textContent;
  }

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(plainText()).then(() => {
      const o = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = o; }, 1000);
    });
  });
  dlBtn.addEventListener('click', () => {
    const html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      plainText().split('\n').map(l => l ? '  ' + l : l).join('\n') +
      '\n</head>\n<body>\n</body>\n</html>\n';
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'meta-tags.html';
    a.click();
    URL.revokeObjectURL(url);
  });

  for (const k in fields) {
    fields[k].addEventListener('input', render);
    fields[k].addEventListener('change', render);
  }

  render();
})();
