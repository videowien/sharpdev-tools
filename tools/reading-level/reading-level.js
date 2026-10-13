(function(){
  const textEl = document.getElementById('text');
  const statsEl = document.getElementById('stats');
  const scoresEl = document.getElementById('scores');
  const avgGrade = document.getElementById('avg-grade');
  const avgDesc = document.getElementById('avg-desc');
  const hlLong = document.getElementById('hl-long');
  const hlComplex = document.getElementById('hl-complex');
  const hlPreview = document.getElementById('hl-preview');

  const SAMPLE = "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet. Readability formulas attempt to estimate how difficult a text is to read, generally by measuring factors like sentence length and word complexity. Shorter sentences and simpler words tend to produce lower grade levels, making the text more accessible to a wider audience.";

  textEl.value = SAMPLE;

  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!word) return 0;
    if (word.length <= 3) return 1;
    // Remove silent e
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  function analyze(text) {
    if (!text.trim()) {
      return { words: 0, sentences: 0, syllables: 0, chars: 0, complex: 0, letters: 0 };
    }
    // Sentences — split on . ! ? followed by space or end
    const sentArr = text.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0);
    const sentences = Math.max(1, sentArr.length);
    // Words
    const wordArr = text.match(/\b[\w'']+\b/g) || [];
    const words = wordArr.length;
    // Chars (excluding spaces)
    const chars = text.replace(/\s/g, '').length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    let syllables = 0;
    let complex = 0;
    for (const w of wordArr) {
      const s = countSyllables(w);
      syllables += s;
      if (s >= 3 && !/^[A-Z]/.test(w)) complex++;
    }
    return { words, sentences, syllables, chars, complex, letters };
  }

  function fleschReadingEase(s) {
    if (!s.words || !s.sentences) return 0;
    return 206.835 - 1.015 * (s.words / s.sentences) - 84.6 * (s.syllables / s.words);
  }
  function fleschKincaidGrade(s) {
    if (!s.words || !s.sentences) return 0;
    return 0.39 * (s.words / s.sentences) + 11.8 * (s.syllables / s.words) - 15.59;
  }
  function gunningFog(s) {
    if (!s.words || !s.sentences) return 0;
    return 0.4 * ((s.words / s.sentences) + 100 * (s.complex / s.words));
  }
  function smog(s) {
    if (!s.sentences) return 0;
    return 1.0430 * Math.sqrt(s.complex * (30 / s.sentences)) + 3.1291;
  }
  function colemanLiau(s) {
    if (!s.words) return 0;
    const L = s.letters / s.words * 100;
    const S = s.sentences / s.words * 100;
    return 0.0588 * L - 0.296 * S - 15.8;
  }
  function ari(s) {
    if (!s.words || !s.sentences) return 0;
    return 4.71 * (s.chars / s.words) + 0.5 * (s.words / s.sentences) - 21.43;
  }

  function fleschInterp(score) {
    if (score >= 90) return 'Very easy — 5th grade';
    if (score >= 80) return 'Easy — 6th grade';
    if (score >= 70) return 'Fairly easy — 7th grade';
    if (score >= 60) return 'Standard — 8th-9th grade';
    if (score >= 50) return 'Fairly difficult — 10th-12th grade';
    if (score >= 30) return 'Difficult — college';
    return 'Very difficult — college graduate';
  }
  function gradeInterp(g) {
    if (g < 1) return 'Kindergarten';
    if (g < 6) return 'Elementary school';
    if (g < 9) return 'Middle school';
    if (g < 13) return 'High school';
    if (g < 17) return 'College';
    return 'Graduate level';
  }

  function render() {
    const text = textEl.value;
    const s = analyze(text);
    const avgWordsPerSent = s.sentences ? (s.words / s.sentences) : 0;
    const avgSylPerWord = s.words ? (s.syllables / s.words) : 0;

    statsEl.innerHTML = [
      { l: 'Words', v: s.words.toLocaleString() },
      { l: 'Sentences', v: s.sentences.toLocaleString() },
      { l: 'Syllables', v: s.syllables.toLocaleString() },
      { l: 'Characters', v: s.chars.toLocaleString() },
      { l: 'Complex words', v: s.complex.toLocaleString() },
      { l: 'Avg words/sentence', v: avgWordsPerSent.toFixed(1) },
      { l: 'Avg syllables/word', v: avgSylPerWord.toFixed(2) },
      { l: 'Reading time', v: Math.max(1, Math.round(s.words / 225)) + ' min' },
    ].map(x => '<div class="stat"><div class="lbl">' + x.l + '</div><div class="val">' + x.v + '</div></div>').join('');

    const fre = fleschReadingEase(s);
    const fkg = fleschKincaidGrade(s);
    const fog = gunningFog(s);
    const sm = smog(s);
    const cl = colemanLiau(s);
    const a = ari(s);

    const grades = [fkg, fog, sm, cl, a].filter(g => isFinite(g) && g > 0);
    const avg = grades.length ? grades.reduce((x,y) => x+y, 0) / grades.length : 0;
    avgGrade.textContent = avg > 0 ? avg.toFixed(1) : '—';
    avgDesc.textContent = avg > 0 ? gradeInterp(avg) : 'Enter some text';

    const scores = [
      {
        name: 'Flesch Reading Ease', sub: '0–100, higher = easier',
        val: fre.toFixed(1), interp: fleschInterp(fre),
        bar: Math.max(0, Math.min(100, fre))
      },
      {
        name: 'Flesch-Kincaid Grade', sub: 'US grade level',
        val: fkg.toFixed(1), interp: gradeInterp(fkg),
        bar: Math.max(0, Math.min(100, fkg / 20 * 100))
      },
      {
        name: 'Gunning Fog', sub: 'Years of education',
        val: fog.toFixed(1), interp: gradeInterp(fog),
        bar: Math.max(0, Math.min(100, fog / 20 * 100))
      },
      {
        name: 'SMOG Index', sub: 'Years of education',
        val: sm.toFixed(1), interp: gradeInterp(sm),
        bar: Math.max(0, Math.min(100, sm / 20 * 100))
      },
      {
        name: 'Coleman-Liau', sub: 'US grade level',
        val: cl.toFixed(1), interp: gradeInterp(cl),
        bar: Math.max(0, Math.min(100, cl / 20 * 100))
      },
      {
        name: 'Auto. Readability', sub: 'US grade level (ARI)',
        val: a.toFixed(1), interp: gradeInterp(a),
        bar: Math.max(0, Math.min(100, a / 20 * 100))
      },
    ];
    scoresEl.innerHTML = scores.map(sc =>
      '<div class="score-card">' +
        '<div class="score-name">' + sc.name + '</div>' +
        '<div class="score-sub">' + sc.sub + '</div>' +
        '<div class="score-val">' + sc.val + '</div>' +
        '<div class="bar"><div class="bar-fill" style="width:' + sc.bar + '%"></div></div>' +
        '<div class="score-interp">' + sc.interp + '</div>' +
      '</div>'
    ).join('');

    updateHighlight(text);
  }

  function updateHighlight(text) {
    if (!hlLong.checked && !hlComplex.checked) {
      hlPreview.style.display = 'none';
      return;
    }
    hlPreview.style.display = '';
    const escHtml = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    let html = '';
    const sentences = text.split(/([.!?]+(?:\s+|$))/);
    let current = '';
    const chunks = [];
    for (let i = 0; i < sentences.length; i++) {
      current += sentences[i];
      if (i % 2 === 1) { chunks.push(current); current = ''; }
    }
    if (current) chunks.push(current);
    for (const chunk of chunks) {
      const words = chunk.match(/\b[\w'']+\b/g) || [];
      const wlen = words.length;
      let processed = escHtml(chunk);
      if (hlComplex.checked) {
        for (const w of words) {
          if (countSyllables(w) >= 3 && !/^[A-Z]/.test(w)) {
            const re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
            processed = processed.replace(re, '<span class="complex-word">' + escHtml(w) + '</span>');
          }
        }
      }
      if (hlLong.checked && wlen > 25) {
        html += '<span class="long-sent">' + processed + '</span>';
      } else {
        html += processed;
      }
    }
    hlPreview.innerHTML = html;
  }

  let timer = null;
  textEl.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(render, 200);
  });
  hlLong.addEventListener('change', () => updateHighlight(textEl.value));
  hlComplex.addEventListener('change', () => updateHighlight(textEl.value));

  render();
})();
