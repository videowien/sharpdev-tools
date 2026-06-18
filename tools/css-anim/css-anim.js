(function(){
  const $ = id => document.getElementById(id);
  const track = $('track');
  const stage = $('stage');
  const el = $('anim-el');

  // Each keyframe: { pct, tx, ty, scale, rotate, skew, opacity, bg, radius, blur, brightness, hue }
  function defaultKf(pct, over){
    return Object.assign({
      pct, tx:0, ty:0, scale:1, rotate:0, skew:0,
      opacity:1, bg:'#ff4444', radius:8,
      blur:0, brightness:1, hue:0
    }, over||{});
  }

  let frames = [defaultKf(0, {opacity:0}), defaultKf(100, {opacity:1})];
  let active = 0;
  let styleTag = document.createElement('style');
  document.head.appendChild(styleTag);

  const PRESETS = {
    'pulse': [defaultKf(0,{scale:1}), defaultKf(50,{scale:1.15}), defaultKf(100,{scale:1})],
    'bounce': [defaultKf(0,{ty:0}), defaultKf(30,{ty:-60}), defaultKf(60,{ty:0}), defaultKf(80,{ty:-20}), defaultKf(100,{ty:0})],
    'shake': [defaultKf(0,{tx:0}), defaultKf(25,{tx:-10}), defaultKf(50,{tx:10}), defaultKf(75,{tx:-8}), defaultKf(100,{tx:0})],
    'fade-in': [defaultKf(0,{opacity:0,ty:-10}), defaultKf(100,{opacity:1,ty:0})],
    'slide-in': [defaultKf(0,{tx:-120,opacity:0}), defaultKf(100,{tx:0,opacity:1})],
    'spin': [defaultKf(0,{rotate:0}), defaultKf(100,{rotate:360})],
    'wobble': [defaultKf(0,{rotate:0}), defaultKf(25,{rotate:-10,tx:-8}), defaultKf(50,{rotate:10,tx:8}), defaultKf(75,{rotate:-6,tx:-4}), defaultKf(100,{rotate:0,tx:0})]
  };

  function buildTransform(f){
    return 'translate('+f.tx+'px, '+f.ty+'px) scale('+f.scale+') rotate('+f.rotate+'deg) skew('+f.skew+'deg)';
  }
  function buildFilter(f){
    const parts = [];
    if (f.blur) parts.push('blur('+f.blur+'px)');
    if (f.brightness !== 1) parts.push('brightness('+f.brightness+')');
    if (f.hue) parts.push('hue-rotate('+f.hue+'deg)');
    return parts.length ? parts.join(' ') : 'none';
  }

  function buildCSS(){
    const name = ($('a-name').value || 'myAnim').replace(/[^a-zA-Z0-9_-]/g,'');
    const dur = parseFloat($('a-dur').value) || 2;
    const timing = $('a-timing').value;
    const iter = $('a-iter').value;
    const dir = $('a-dir').value;
    const fill = $('a-fill').value;

    const sorted = [...frames].sort((a,b)=>a.pct-b.pct);
    const kfs = sorted.map(f => {
      return '  ' + f.pct + '% {\n' +
        '    transform: ' + buildTransform(f) + ';\n' +
        '    opacity: ' + f.opacity + ';\n' +
        '    background-color: ' + f.bg + ';\n' +
        '    border-radius: ' + f.radius + 'px;\n' +
        '    filter: ' + buildFilter(f) + ';\n' +
        '  }';
    }).join('\n');

    const css = '@keyframes ' + name + ' {\n' + kfs + '\n}\n\n' +
      '.element {\n' +
      '  animation: ' + name + ' ' + dur + 's ' + timing + ' ' + iter + ' ' + dir + ' ' + fill + ';\n' +
      '}';
    return {css, name, dur, timing, iter, dir, fill};
  }

  function apply(){
    const {css, name, dur, timing, iter, dir, fill} = buildCSS();
    $('code-out').textContent = css;
    const speed = parseFloat($('speed').value) || 1;
    const effDur = (dur / speed).toFixed(3);
    styleTag.textContent = css + '\n#anim-el { animation: ' + name + ' ' + effDur + 's ' + timing + ' ' + iter + ' ' + dir + ' ' + fill + '; }';
    // force restart
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }

  function renderTrack(){
    track.innerHTML = '';
    frames.forEach((f, i) => {
      const d = document.createElement('div');
      d.className = 'kf' + (i === active ? ' active' : '');
      d.style.left = f.pct + '%';
      d.innerHTML = '<span class="kf-pct">' + f.pct + '%</span>';
      d.addEventListener('mousedown', e => startDrag(e, i));
      d.addEventListener('click', e => { e.stopPropagation(); active = i; renderTrack(); renderProps(); });
      track.appendChild(d);
    });
  }

  function renderProps(){
    const f = frames[active];
    if (!f) { $('frame-props').innerHTML = ''; return; }
    $('frame-props').innerHTML =
      '<h4><span>Keyframe at ' + f.pct + '%</span>' +
      (frames.length > 2 ? '<button id="del-kf">Delete</button>' : '') + '</h4>' +
      inpN('tx','translateX (px)',f.tx) +
      inpN('ty','translateY (px)',f.ty) +
      inpN('scale','scale',f.scale, 0.1) +
      inpN('rotate','rotate (deg)',f.rotate) +
      inpN('skew','skew (deg)',f.skew) +
      inpN('opacity','opacity',f.opacity, 0.1) +
      '<div class="inp"><label>background</label><input type="color" data-prop="bg" value="'+f.bg+'"></div>' +
      inpN('radius','border-radius (px)',f.radius) +
      inpN('blur','blur (px)',f.blur) +
      inpN('brightness','brightness',f.brightness, 0.1) +
      inpN('hue','hue-rotate (deg)',f.hue);

    $('frame-props').querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', () => {
        const p = inp.dataset.prop;
        const v = inp.type === 'color' ? inp.value : parseFloat(inp.value);
        if (inp.type !== 'color' && isNaN(v)) return;
        frames[active][p] = v;
        apply();
      });
    });
    const del = $('del-kf');
    if (del) del.addEventListener('click', () => {
      if (frames.length <= 2) return;
      frames.splice(active, 1);
      active = Math.max(0, active - 1);
      renderTrack(); renderProps(); apply();
    });
  }

  function inpN(prop, label, val, step){
    return '<div class="inp"><label>'+label+'</label><input type="number" data-prop="'+prop+'" value="'+val+'" step="'+(step||1)+'"></div>';
  }

  // Track click: add keyframe
  track.addEventListener('click', e => {
    if (e.target !== track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    frames.push(defaultKf(Math.max(0, Math.min(100, pct))));
    active = frames.length - 1;
    renderTrack(); renderProps(); apply();
  });

  function startDrag(e, i){
    e.preventDefault();
    active = i;
    const kf = track.children[i];
    kf.classList.add('dragging');
    const rect = track.getBoundingClientRect();
    function move(ev){
      const pct = Math.round(((ev.clientX - rect.left) / rect.width) * 100);
      frames[i].pct = Math.max(0, Math.min(100, pct));
      renderTrack(); renderProps(); apply();
    }
    function up(){
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  // Global controls
  ['a-name','a-dur','a-timing','a-iter','a-dir','a-fill'].forEach(id => $(id).addEventListener('input', apply));
  $('speed').addEventListener('input', () => {
    $('speed-val').textContent = parseFloat($('speed').value).toFixed(2) + 'x';
    apply();
  });
  $('play-btn').addEventListener('click', () => {
    if (el.style.animationPlayState === 'paused') {
      el.style.animationPlayState = 'running'; $('play-btn').textContent = 'Pause';
    } else {
      el.style.animationPlayState = 'paused'; $('play-btn').textContent = 'Play';
    }
  });
  $('replay-btn').addEventListener('click', () => {
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; apply();
    el.style.animationPlayState = 'running'; $('play-btn').textContent = 'Pause';
  });

  document.querySelectorAll('.preset-btn').forEach(b => b.addEventListener('click', () => {
    frames = PRESETS[b.dataset.preset].map(f => Object.assign({}, f));
    $('a-name').value = b.dataset.preset.replace(/-/g,'') + 'Anim';
    active = 0;
    renderTrack(); renderProps(); apply();
  }));

  $('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText($('code-out').textContent).then(() => {
      const b = $('copy-btn'); b.textContent = 'Copied'; b.classList.add('copied');
      setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('copied'); }, 1200);
    });
  });

  renderTrack(); renderProps(); apply();
})();
