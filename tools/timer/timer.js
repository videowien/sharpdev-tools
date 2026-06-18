(function () {
  // ---- Tabs ----
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('panel-' + t.dataset.tab).classList.add('active');
  }));

  // ---- Beep ----
  let audioCtx = null;
  function beep(freq, ms) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = freq || 440;
      osc.type = 'sine';
      osc.connect(gain); gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (ms || 200) / 1000);
      osc.start();
      osc.stop(audioCtx.currentTime + (ms || 200) / 1000);
    } catch (e) { /* ignore */ }
  }

  function notify(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, { body, silent: false }); } catch (e) {}
    }
  }
  function askNotif() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  function fmtMMSS(sec) {
    sec = Math.max(0, Math.ceil(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  function fmtHMS(sec) {
    sec = Math.max(0, Math.ceil(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  const RING_LEN = 578; // 2*PI*92 ~ 578

  // ---- Pomodoro ----
  const pomo = {
    running: false,
    phase: 'work', // work | short | long
    session: 1,
    remaining: 25 * 60,
    endTime: null, // wall-clock ms when current phase ends
    timer: null,
  };
  const pomoEls = {
    phase: document.getElementById('pomo-phase'),
    time: document.getElementById('pomo-time'),
    session: document.getElementById('pomo-session'),
    ring: document.getElementById('pomo-ring'),
    start: document.getElementById('pomo-start'),
    pause: document.getElementById('pomo-pause'),
    reset: document.getElementById('pomo-reset'),
    skip: document.getElementById('pomo-skip'),
    work: document.getElementById('pomo-work'),
    short: document.getElementById('pomo-short'),
    long: document.getElementById('pomo-long'),
    count: document.getElementById('pomo-count'),
  };

  function pomoPhaseSec() {
    if (pomo.phase === 'work') return (parseInt(pomoEls.work.value) || 25) * 60;
    if (pomo.phase === 'short') return (parseInt(pomoEls.short.value) || 5) * 60;
    return (parseInt(pomoEls.long.value) || 15) * 60;
  }

  function pomoRender() {
    pomoEls.time.textContent = fmtMMSS(pomo.remaining);
    pomoEls.phase.textContent = pomo.phase === 'work' ? 'Work'
      : pomo.phase === 'short' ? 'Short break' : 'Long break';
    const total = pomoPhaseSec();
    const frac = total > 0 ? (pomo.remaining / total) : 0;
    pomoEls.ring.setAttribute('stroke-dashoffset', String((1 - frac) * RING_LEN));
    pomoEls.session.textContent = 'Session ' + pomo.session + ' of ' + (parseInt(pomoEls.count.value) || 4);
    if (pomo.running) {
      document.title = fmtMMSS(pomo.remaining) + ' - ' + pomoEls.phase.textContent;
    }
  }

  function pomoAdvance(opts) {
    opts = opts || {};
    const totalSessions = parseInt(pomoEls.count.value) || 4;
    if (!opts.silent) {
      beep(660, 250);
      setTimeout(() => beep(880, 250), 280);
    }
    let msg = null;
    if (pomo.phase === 'work') {
      if (pomo.session >= totalSessions) {
        pomo.phase = 'long';
        msg = 'Long break time!';
      } else {
        pomo.phase = 'short';
        msg = 'Short break time!';
      }
    } else {
      if (pomo.phase === 'long') {
        pomo.session = 1;
      } else {
        pomo.session = Math.min(pomo.session + 1, totalSessions);
      }
      pomo.phase = 'work';
      msg = 'Back to work!';
    }
    if (!opts.silent && msg) notify('Pomodoro', msg);
    pomo.remaining = pomoPhaseSec();
  }

  // Advance through any phase boundaries crossed while the tab was hidden.
  // Fires the beep/notification only for the MOST RECENT transition, not every stale one.
  function pomoCatchUp() {
    const now = Date.now();
    let guard = 0;
    while (pomo.running && pomo.endTime <= now && guard++ < 1000) {
      const overrunMs = now - pomo.endTime;
      // Determine if this will be the final transition (phase after advance would still end in future)
      const phaseSecAfter = (() => {
        // Peek next phase duration
        const tot = parseInt(pomoEls.count.value) || 4;
        if (pomo.phase === 'work') {
          if (pomo.session >= tot) return (parseInt(pomoEls.long.value) || 15) * 60;
          return (parseInt(pomoEls.short.value) || 5) * 60;
        }
        return (parseInt(pomoEls.work.value) || 25) * 60;
      })();
      const nextPhaseMs = phaseSecAfter * 1000;
      const isLast = overrunMs < nextPhaseMs;
      pomoAdvance({ silent: !isLast });
      pomo.endTime = pomo.endTime + nextPhaseMs;
    }
    pomo.remaining = (pomo.endTime - Date.now()) / 1000;
  }

  function pomoStartTicking() {
    if (pomo.timer) clearTimeout(pomo.timer);
    pomo.timer = setTimeout(pomoLoop, 250);
  }

  function pomoLoop() {
    if (!pomo.running) return;
    pomoCatchUp();
    pomo.remaining = (pomo.endTime - Date.now()) / 1000;
    pomoRender();
    pomoSave();
    pomo.timer = setTimeout(pomoLoop, 250);
  }

  pomoEls.start.addEventListener('click', () => {
    askNotif();
    if (pomo.running) return;
    pomo.running = true;
    pomo.endTime = Date.now() + pomo.remaining * 1000;
    pomoStartTicking();
  });
  pomoEls.pause.addEventListener('click', () => {
    if (pomo.running) {
      pomo.remaining = (pomo.endTime - Date.now()) / 1000;
    }
    pomo.running = false;
    if (pomo.timer) clearTimeout(pomo.timer);
    pomoSave();
    document.title = 'Timer, Stopwatch & Pomodoro';
  });
  pomoEls.reset.addEventListener('click', () => {
    pomo.running = false;
    if (pomo.timer) clearTimeout(pomo.timer);
    pomo.phase = 'work'; pomo.session = 1;
    pomo.remaining = pomoPhaseSec();
    pomo.endTime = null;
    pomoRender(); pomoSave();
    document.title = 'Timer, Stopwatch & Pomodoro';
  });
  pomoEls.skip.addEventListener('click', () => {
    pomoAdvance();
    if (pomo.running) pomo.endTime = Date.now() + pomo.remaining * 1000;
    pomoRender(); pomoSave();
  });
  [pomoEls.work, pomoEls.short, pomoEls.long, pomoEls.count].forEach(el => {
    el.addEventListener('change', () => {
      if (!pomo.running) {
        pomo.remaining = pomoPhaseSec();
        pomoRender();
      }
    });
  });

  // ---- Stopwatch ----
  const sw = {
    running: false,
    elapsed: 0, // ms
    startAt: null,
    laps: [],
    raf: null,
  };
  const swEls = {
    time: document.getElementById('sw-time'),
    start: document.getElementById('sw-start'),
    pause: document.getElementById('sw-pause'),
    lap: document.getElementById('sw-lap'),
    reset: document.getElementById('sw-reset'),
    laps: document.getElementById('sw-laps'),
  };

  function swFmt(ms) {
    const totalCs = Math.floor(ms / 10);
    const cs = totalCs % 100;
    const s = Math.floor(totalCs / 100) % 60;
    const m = Math.floor(totalCs / 6000);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + String(cs).padStart(2, '0');
  }

  function swTick() {
    if (!sw.running) return;
    const now = performance.now();
    const current = sw.elapsed + (now - sw.startAt);
    swEls.time.textContent = swFmt(current);
    sw.raf = requestAnimationFrame(swTick);
  }

  swEls.start.addEventListener('click', () => {
    if (sw.running) return;
    sw.running = true;
    sw.startAt = performance.now();
    sw.raf = requestAnimationFrame(swTick);
  });
  swEls.pause.addEventListener('click', () => {
    if (!sw.running) return;
    sw.running = false;
    sw.elapsed += performance.now() - sw.startAt;
    if (sw.raf) cancelAnimationFrame(sw.raf);
    swEls.time.textContent = swFmt(sw.elapsed);
  });
  swEls.reset.addEventListener('click', () => {
    sw.running = false;
    sw.elapsed = 0; sw.laps = [];
    if (sw.raf) cancelAnimationFrame(sw.raf);
    swEls.time.textContent = '00:00.00';
    renderLaps();
  });
  swEls.lap.addEventListener('click', () => {
    const current = sw.elapsed + (sw.running ? (performance.now() - sw.startAt) : 0);
    const prevTotal = sw.laps.length ? sw.laps[sw.laps.length - 1].total : 0;
    sw.laps.push({ split: current - prevTotal, total: current });
    renderLaps();
  });
  function renderLaps() {
    swEls.laps.innerHTML = '';
    if (!sw.laps.length) return;
    sw.laps.slice().reverse().forEach((l, i) => {
      const n = sw.laps.length - i;
      const row = document.createElement('div');
      row.className = 'lap-row';
      row.innerHTML = '<span class="lap-num">Lap ' + n + '</span>' +
        '<span>' + swFmt(l.split) + '</span>' +
        '<span class="lap-total">' + swFmt(l.total) + '</span>';
      swEls.laps.appendChild(row);
    });
  }

  // ---- Countdown ----
  const cd = {
    running: false,
    remaining: 0, // sec
    total: 0,
    endTime: null, // wall-clock ms
    timer: null,
  };
  const cdEls = {
    time: document.getElementById('cd-time'),
    ring: document.getElementById('cd-ring'),
    start: document.getElementById('cd-start'),
    pause: document.getElementById('cd-pause'),
    reset: document.getElementById('cd-reset'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s'),
    text: document.getElementById('cd-text'),
  };

  function cdSetFromInputs() {
    const t = (cdEls.text.value || '').trim();
    if (t) {
      const parts = t.split(':').map(x => parseInt(x) || 0);
      let h = 0, m = 0, s = 0;
      if (parts.length === 3) [h, m, s] = parts;
      else if (parts.length === 2) [m, s] = parts;
      else if (parts.length === 1) [s] = parts;
      cd.total = h * 3600 + m * 60 + s;
    } else {
      const h = parseInt(cdEls.h.value) || 0;
      const m = parseInt(cdEls.m.value) || 0;
      const s = parseInt(cdEls.s.value) || 0;
      cd.total = h * 3600 + m * 60 + s;
    }
    cd.remaining = cd.total;
  }

  function cdRender() {
    cdEls.time.textContent = fmtHMS(cd.remaining);
    const frac = cd.total > 0 ? (cd.remaining / cd.total) : 0;
    cdEls.ring.setAttribute('stroke-dashoffset', String((1 - frac) * RING_LEN));
  }

  function cdTick() {
    if (!cd.running) return;
    cd.remaining = (cd.endTime - Date.now()) / 1000;
    if (cd.remaining <= 0) {
      cd.remaining = 0;
      cd.running = false;
      beep(880, 400);
      setTimeout(() => beep(660, 400), 450);
      notify('Countdown', 'Time is up!');
      cdRender();
      return;
    }
    cdRender();
    cd.timer = setTimeout(cdTick, 250);
  }

  cdEls.start.addEventListener('click', () => {
    askNotif();
    if (cd.running) return;
    if (cd.remaining <= 0) cdSetFromInputs();
    if (cd.remaining <= 0) return;
    cd.running = true;
    cd.endTime = Date.now() + cd.remaining * 1000;
    cd.timer = setTimeout(cdTick, 250);
  });
  cdEls.pause.addEventListener('click', () => {
    if (cd.running) {
      cd.remaining = (cd.endTime - Date.now()) / 1000;
    }
    cd.running = false;
    if (cd.timer) clearTimeout(cd.timer);
  });
  cdEls.reset.addEventListener('click', () => {
    cd.running = false;
    if (cd.timer) clearTimeout(cd.timer);
    cdSetFromInputs();
    cdRender();
  });

  // ---- Persistence ----
  function pomoSave() {
    try {
      localStorage.setItem('sd_pomo', JSON.stringify({
        phase: pomo.phase, session: pomo.session, remaining: pomo.remaining,
        running: pomo.running, saved: Date.now()
      }));
    } catch (e) {}
  }
  function pomoLoad() {
    try {
      const s = JSON.parse(localStorage.getItem('sd_pomo') || 'null');
      if (!s) return;
      pomo.phase = s.phase || 'work';
      pomo.session = s.session || 1;
      pomo.remaining = typeof s.remaining === 'number' ? s.remaining : pomoPhaseSec();
      // Don't auto-resume running (require user to re-click Start)
    } catch (e) {}
  }

  pomoLoad();
  pomoRender();
  cdSetFromInputs();
  cdRender();
  [cdEls.h, cdEls.m, cdEls.s, cdEls.text].forEach(el => {
    el.addEventListener('input', () => { if (!cd.running) { cdSetFromInputs(); cdRender(); } });
  });
})();
