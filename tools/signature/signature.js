(function(){
  const $ = id => document.getElementById(id);
  const STORE_KEY = 'sd-signature-v1';
  let template = 'minimal';

  const fields = ['f-name','f-pronouns','f-title','f-company','f-tagline','f-phone','f-email','f-site','f-addr','f-li','f-tw','f-avatar','f-logo','f-accent','f-font'];

  function load(){
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      fields.forEach(k => { if (d[k] != null && $(k)) $(k).value = d[k]; });
      if (d.template) {
        template = d.template;
        document.querySelectorAll('.tmpl').forEach(t => t.classList.toggle('active', t.dataset.t === template));
      }
    } catch(e){}
  }
  function save(){
    const d = {};
    fields.forEach(k => d[k] = $(k).value);
    d.template = template;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch(e){}
  }

  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function getVals(){
    return {
      name: $('f-name').value.trim(),
      pronouns: $('f-pronouns').value.trim(),
      title: $('f-title').value.trim(),
      company: $('f-company').value.trim(),
      tagline: $('f-tagline').value.trim(),
      phone: $('f-phone').value.trim(),
      email: $('f-email').value.trim(),
      site: $('f-site').value.trim(),
      addr: $('f-addr').value.trim(),
      li: $('f-li').value.trim(),
      tw: $('f-tw').value.trim().replace(/^@/,''),
      avatar: $('f-avatar').value.trim(),
      logo: $('f-logo').value.trim(),
      accent: $('f-accent').value || '#ff4444',
      font: $('f-font').value
    };
  }

  function fontStack(f){
    if (f === 'serif') return "Georgia, 'Times New Roman', serif";
    if (f === 'mono') return "'SF Mono', Menlo, Consolas, monospace";
    return "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";
  }

  function siteUrl(s){
    if (!s) return '';
    if (/^https?:\/\//i.test(s)) return s;
    return 'https://' + s;
  }

  function line(label, value, color){
    if (!value) return '';
    return '<tr><td style="font-size:12px;color:'+color+';padding:2px 0;font-family:inherit;"><span style="color:#888;">'+label+'</span>&nbsp;'+value+'</td></tr>';
  }

  function socialLinks(v){
    const parts = [];
    if (v.li) parts.push('<a href="'+esc(v.li)+'" style="color:'+v.accent+';text-decoration:none;">LinkedIn</a>');
    if (v.tw) parts.push('<a href="https://twitter.com/'+esc(v.tw)+'" style="color:'+v.accent+';text-decoration:none;">@'+esc(v.tw)+'</a>');
    if (parts.length === 0) return '';
    return '<tr><td style="font-size:12px;padding:6px 0 0;font-family:inherit;">'+parts.join(' &nbsp;·&nbsp; ')+'</td></tr>';
  }

  function buildMinimal(v, font){
    const mail = v.email ? '<a href="mailto:'+esc(v.email)+'" style="color:'+v.accent+';text-decoration:none;">'+esc(v.email)+'</a>' : '';
    const web = v.site ? '<a href="'+esc(siteUrl(v.site))+'" style="color:'+v.accent+';text-decoration:none;">'+esc(v.site)+'</a>' : '';
    return '<table cellpadding="0" cellspacing="0" border="0" style="font-family:'+font+';color:#222;font-size:13px;line-height:1.5;">' +
      '<tr><td style="padding:0;font-family:inherit;">' +
      '<div style="font-size:15px;font-weight:700;color:#111;">'+esc(v.name)+ (v.pronouns?' <span style="font-weight:400;color:#777;font-size:12px;">('+esc(v.pronouns)+')</span>':'') +'</div>' +
      (v.tagline?'<div style="color:#666;font-size:12px;margin-top:2px;">'+esc(v.tagline)+'</div>':'') +
      '<div style="color:#555;font-size:13px;margin-top:2px;">'+esc(v.title)+(v.title&&v.company?' · ':'')+'<span style="color:'+v.accent+';font-weight:600;">'+esc(v.company)+'</span></div>' +
      '<table cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;font-family:inherit;">' +
        line('T', esc(v.phone), '#444') +
        (v.email?'<tr><td style="font-size:12px;color:#444;padding:2px 0;font-family:inherit;"><span style="color:#888;">E</span>&nbsp;'+mail+'</td></tr>':'') +
        (v.site?'<tr><td style="font-size:12px;color:#444;padding:2px 0;font-family:inherit;"><span style="color:#888;">W</span>&nbsp;'+web+'</td></tr>':'') +
        line('A', esc(v.addr), '#444') +
        socialLinks(v) +
      '</table>' +
      '</td></tr></table>';
  }

  function buildClassic(v, font){
    const avatar = v.avatar ? '<td valign="top" style="padding-right:14px;"><img src="'+esc(v.avatar)+'" width="68" height="68" alt="" style="border-radius:50%;display:block;"></td>' : '';
    const body = buildMinimal(v, font);
    return '<table cellpadding="0" cellspacing="0" border="0" style="font-family:'+font+';"><tr>' + avatar +
      '<td valign="top" style="border-left:3px solid '+v.accent+';padding-left:14px;">' + body + '</td></tr></table>';
  }

  function buildTwoCol(v, font){
    const body = buildMinimal(v, font);
    const logo = v.logo ? '<img src="'+esc(v.logo)+'" height="44" alt="" style="display:block;margin-bottom:8px;">' : '';
    return '<table cellpadding="0" cellspacing="0" border="0" style="font-family:'+font+';"><tr>' +
      '<td valign="top" style="padding-right:20px;border-right:1px solid #ddd;">'+body+'</td>' +
      '<td valign="top" style="padding-left:20px;">'+logo+'<div style="font-size:11px;color:#888;max-width:160px;">Sent from '+esc(v.company||'work')+'</div></td>' +
      '</tr></table>';
  }

  function buildBanner(v, font){
    return '<table cellpadding="0" cellspacing="0" border="0" style="font-family:'+font+';width:100%;max-width:500px;">' +
      '<tr><td style="background:'+v.accent+';padding:10px 14px;color:#fff;font-weight:700;font-size:14px;font-family:inherit;">' +
        esc(v.name) + ' &middot; '+ esc(v.title) + '</td></tr>' +
      '<tr><td style="padding:12px 14px;background:#f8f8f8;font-family:inherit;">'+ buildMinimal(v, font) +'</td></tr>' +
    '</table>';
  }

  function build(){
    const v = getVals();
    const font = fontStack(v.font);
    let html;
    switch(template){
      case 'classic': html = buildClassic(v, font); break;
      case 'two-col': html = buildTwoCol(v, font); break;
      case 'banner': html = buildBanner(v, font); break;
      default: html = buildMinimal(v, font);
    }
    $('preview').innerHTML = html;
    $('out-html').textContent = html;
    save();
  }

  // Template pills
  document.querySelectorAll('.tmpl').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tmpl').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    template = t.dataset.t;
    build();
  }));

  fields.forEach(k => {
    const el = $(k);
    if (el) el.addEventListener('input', build);
  });

  $('copy-html-btn').addEventListener('click', () => {
    navigator.clipboard.writeText($('out-html').textContent).then(() => flash('copy-html-btn','Copied'));
  });

  $('copy-rich-btn').addEventListener('click', () => {
    const p = $('preview');
    const r = document.createRange();
    r.selectNodeContents(p);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    try {
      document.execCommand('copy');
      flash('copy-rich-btn','Copied rich text');
    } catch(e){ flash('copy-rich-btn','Copy failed'); }
    sel.removeAllRanges();
  });

  $('dl-btn').addEventListener('click', () => {
    const html = '<!DOCTYPE html><html><body>' + $('out-html').textContent + '</body></html>';
    const blob = new Blob([html], {type:'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'signature.html';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  });

  function flash(id, msg){
    const b = $(id); const orig = b.textContent;
    b.textContent = msg; setTimeout(()=>b.textContent = orig, 1500);
  }

  load();
  build();
})();
