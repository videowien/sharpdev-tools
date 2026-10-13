(function(){
  const $ = id => document.getElementById(id);
  const checks = document.querySelectorAll('.cell input[type="checkbox"]');
  const octalIn = $('f-octal'), symIn = $('f-symbolic'), cmdIn = $('f-cmd');

  // State: object with ur,uw,ux,gr,gw,gx,or,ow,ox,suid,sgid,sticky
  const state = {};
  checks.forEach(c => state[c.dataset.p] = false);

  function fromOctal(oct){
    // oct may be 3 or 4 digit string
    let s = String(oct).trim();
    if (!/^[0-7]{3,4}$/.test(s)) return null;
    if (s.length === 3) s = '0' + s;
    const [sp, u, g, o] = s.split('').map(Number);
    return {
      suid: !!(sp & 4), sgid: !!(sp & 2), sticky: !!(sp & 1),
      ur: !!(u & 4), uw: !!(u & 2), ux: !!(u & 1),
      gr: !!(g & 4), gw: !!(g & 2), gx: !!(g & 1),
      or: !!(o & 4), ow: !!(o & 2), ox: !!(o & 1)
    };
  }

  function toOctal(s){
    const sp = (s.suid?4:0)+(s.sgid?2:0)+(s.sticky?1:0);
    const u = (s.ur?4:0)+(s.uw?2:0)+(s.ux?1:0);
    const g = (s.gr?4:0)+(s.gw?2:0)+(s.gx?1:0);
    const o = (s.or?4:0)+(s.ow?2:0)+(s.ox?1:0);
    return (sp?String(sp):'') + '' + u + g + o;
  }

  function toSymbolic(s){
    let ux = s.ux ? (s.suid?'s':'x') : (s.suid?'S':'-');
    let gx = s.gx ? (s.sgid?'s':'x') : (s.sgid?'S':'-');
    let ox = s.ox ? (s.sticky?'t':'x') : (s.sticky?'T':'-');
    return (s.ur?'r':'-')+(s.uw?'w':'-')+ux+
           (s.gr?'r':'-')+(s.gw?'w':'-')+gx+
           (s.or?'r':'-')+(s.ow?'w':'-')+ox;
  }

  function fromSymbolic(str){
    let s = str.trim();
    if (s.length === 10) s = s.slice(1); // strip file type
    if (s.length !== 9) return null;
    if (!/^[rwxsStT-]{9}$/.test(s)) return null;
    const [r1,w1,x1,r2,w2,x2,r3,w3,x3] = s.split('');
    return {
      ur: r1==='r', uw: w1==='w',
      ux: x1==='x' || x1==='s',
      suid: x1==='s' || x1==='S',
      gr: r2==='r', gw: w2==='w',
      gx: x2==='x' || x2==='s',
      sgid: x2==='s' || x2==='S',
      or: r3==='r', ow: w3==='w',
      ox: x3==='x' || x3==='t',
      sticky: x3==='t' || x3==='T'
    };
  }

  function toSymbolicCmd(s){
    // u=rwx,g=rx,o=rx
    const parts = [];
    const ub = (s.ur?'r':'')+(s.uw?'w':'')+(s.ux?'x':'')+(s.suid?'s':'');
    const gb = (s.gr?'r':'')+(s.gw?'w':'')+(s.gx?'x':'')+(s.sgid?'s':'');
    const ob = (s.or?'r':'')+(s.ow?'w':'')+(s.ox?'x':'')+(s.sticky?'t':'');
    parts.push('u=' + (ub||''));
    parts.push('g=' + (gb||''));
    parts.push('o=' + (ob||''));
    return parts.join(',');
  }

  function describe(s){
    function who(r,w,x,label){
      const bits = [];
      if (r) bits.push('read');
      if (w) bits.push('write');
      if (x) bits.push('execute');
      if (bits.length === 0) return label + ' has no access';
      if (bits.length === 1) return label + ' can ' + bits[0];
      if (bits.length === 2) return label + ' can ' + bits.join(' and ');
      return label + ' can ' + bits.slice(0,-1).join(', ') + ', and ' + bits[bits.length-1];
    }
    const parts = [
      who(s.ur,s.uw,s.ux,'Owner'),
      who(s.gr,s.gw,s.gx,'Group'),
      who(s.or,s.ow,s.ox,'Others')
    ];
    let extra = [];
    if (s.suid) extra.push('Setuid: executable runs as the owner');
    if (s.sgid) extra.push('Setgid: executable runs as the group, or new files in a dir inherit the group');
    if (s.sticky) extra.push('Sticky bit: in a directory, only the owner of each file can delete or rename it');
    return parts.join('. ') + '.' + (extra.length ? ' ' + extra.join(' ') + '.' : '');
  }

  function apply(newState){
    Object.assign(state, newState);
    // update checkboxes
    checks.forEach(c => c.checked = !!state[c.dataset.p]);
    // update fields
    const oct = toOctal(state);
    const pref = oct.length === 4 ? '' : '0';
    octalIn.value = pref + oct;
    symIn.value = toSymbolic(state);
    cmdIn.value = 'chmod ' + oct;
    octalIn.classList.remove('invalid');
    symIn.classList.remove('invalid');
    cmdIn.classList.remove('invalid');
    // description
    $('desc').innerHTML = describe(state);
    // commands
    const oo = toOctal(state);
    $('cmd-file').textContent = 'chmod ' + oo + ' ./path';
    $('cmd-files').textContent = "find ./path -type f -exec chmod " + oo + " {} +";
    $('cmd-dirs').textContent = "find ./path -type d -exec chmod " + oo + " {} +";
  }

  // Checkbox events
  checks.forEach(c => c.addEventListener('change', () => {
    const ns = Object.assign({}, state);
    ns[c.dataset.p] = c.checked;
    apply(ns);
  }));

  // Octal input
  octalIn.addEventListener('input', () => {
    const s = fromOctal(octalIn.value);
    if (!s) { octalIn.classList.add('invalid'); return; }
    apply(s);
  });
  // Symbolic input
  symIn.addEventListener('input', () => {
    const s = fromSymbolic(symIn.value);
    if (!s) { symIn.classList.add('invalid'); return; }
    apply(s);
  });
  // Command input
  cmdIn.addEventListener('input', () => {
    let v = cmdIn.value.trim().replace(/^chmod\s+/i,'').split(/\s+/)[0] || '';
    if (/^[0-7]{3,4}$/.test(v)) {
      const s = fromOctal(v);
      if (s) { apply(s); return; }
    }
    // try u=rwx,g=rx,o=rx style - simple parse
    if (/^[ugoa]=[rwxstST]*(,[ugoa]=[rwxstST]*)*$/.test(v)) {
      const ns = Object.assign({}, state);
      // reset all
      Object.keys(ns).forEach(k => ns[k] = false);
      v.split(',').forEach(part => {
        const [who, perms] = part.split('=');
        const targets = who === 'a' ? ['u','g','o'] : [who];
        targets.forEach(t => {
          if (perms.includes('r')) ns[t+'r'] = true;
          if (perms.includes('w')) ns[t+'w'] = true;
          if (perms.includes('x')) ns[t+'x'] = true;
          if (t === 'u' && (perms.includes('s'))) ns.suid = true;
          if (t === 'g' && (perms.includes('s'))) ns.sgid = true;
          if (t === 'o' && (perms.includes('t'))) ns.sticky = true;
        });
      });
      apply(ns);
      return;
    }
    cmdIn.classList.add('invalid');
  });

  // Presets
  document.querySelectorAll('.preset').forEach(p => p.addEventListener('click', () => {
    const s = fromOctal(p.dataset.oct);
    if (s) apply(s);
  }));

  // Init with 755
  apply(fromOctal('755'));
})();
