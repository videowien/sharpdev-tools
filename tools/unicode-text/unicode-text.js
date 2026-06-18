// Unicode Text Stylizer
(function () {
  'use strict';

  // Map A-Z, a-z, 0-9 from a starting codepoint (assuming contiguous)
  function mapFromRange(upperStart, lowerStart, digitStart) {
    return function (str) {
      let out = '';
      for (const ch of str) {
        const cp = ch.codePointAt(0);
        if (cp >= 65 && cp <= 90 && upperStart != null) out += String.fromCodePoint(upperStart + (cp - 65));
        else if (cp >= 97 && cp <= 122 && lowerStart != null) out += String.fromCodePoint(lowerStart + (cp - 97));
        else if (cp >= 48 && cp <= 57 && digitStart != null) out += String.fromCodePoint(digitStart + (cp - 48));
        else out += ch;
      }
      return out;
    };
  }

  function combining(str, combChar) {
    let out = '';
    for (const ch of str) {
      out += ch;
      if (ch !== ' ' && ch !== '\n') out += combChar;
    }
    return out;
  }

  function upsideDown(str) {
    const m = {
      'a':'\u0250','b':'q','c':'\u0254','d':'p','e':'\u01DD','f':'\u025F','g':'\u0183','h':'\u0265','i':'\u1D09','j':'\u027E','k':'\u029E','l':'l','m':'\u026F','n':'u','o':'o','p':'d','q':'b','r':'\u0279','s':'s','t':'\u0287','u':'n','v':'\u028C','w':'\u028D','x':'x','y':'\u028E','z':'z',
      'A':'\u2200','B':'\u{10412}','C':'\u0186','D':'\u15E1','E':'\u018E','F':'\u2132','G':'\u2141','H':'H','I':'I','J':'\u017F','K':'\u22CA','L':'\u2142','M':'W','N':'N','O':'O','P':'\u0500','Q':'\u038C','R':'\u1D1A','S':'S','T':'\u22A5','U':'\u2229','V':'\u039B','W':'M','X':'X','Y':'\u2144','Z':'Z',
      '0':'0','1':'\u0196','2':'\u1105','3':'\u0190','4':'\u3123','5':'\u03DB','6':'9','7':'\u3125','8':'8','9':'6',
      '.':'\u02D9',',':"'",'?':'\u00BF','!':'\u00A1','"':',,','\'':',','(':')',')':'(','[':']',']':'['
    };
    return [...str].reverse().map(c => m[c] || c).join('');
  }

  function tinyCaps(str) {
    const m = {
      'a':'\u1D00','b':'\u0299','c':'\u1D04','d':'\u1D05','e':'\u1D07','f':'\uA730','g':'\u0262','h':'\u029C','i':'\u026A','j':'\u1D0A','k':'\u1D0B','l':'\u029F','m':'\u1D0D','n':'\u0274','o':'\u1D0F','p':'\u1D18','q':'Q','r':'\u0280','s':'\uA731','t':'\u1D1B','u':'\u1D1C','v':'\u1D20','w':'\u1D21','x':'X','y':'\u028F','z':'\u1D22'
    };
    return [...str].map(c => m[c.toLowerCase()] || c).join('');
  }

  function circledLetter(str) {
    let out = '';
    for (const ch of str) {
      const cp = ch.codePointAt(0);
      if (cp >= 65 && cp <= 90) out += String.fromCodePoint(0x24B6 + (cp - 65));
      else if (cp >= 97 && cp <= 122) out += String.fromCodePoint(0x24D0 + (cp - 97));
      else if (cp >= 49 && cp <= 57) out += String.fromCodePoint(0x2460 + (cp - 49));
      else if (cp === 48) out += '\u24EA';
      else out += ch;
    }
    return out;
  }

  function squared(str) {
    let out = '';
    for (const ch of str) {
      const cp = ch.codePointAt(0);
      if (cp >= 65 && cp <= 90) out += String.fromCodePoint(0x1F130 + (cp - 65));
      else if (cp >= 97 && cp <= 122) out += String.fromCodePoint(0x1F130 + (cp - 97));
      else out += ch;
    }
    return out;
  }

  const STYLES = [
    { name: 'Bold sans-serif', fn: mapFromRange(0x1D5D4, 0x1D5EE, 0x1D7EC) },
    { name: 'Italic sans-serif', fn: mapFromRange(0x1D608, 0x1D622, null) },
    { name: 'Bold italic sans-serif', fn: mapFromRange(0x1D63C, 0x1D656, null) },
    { name: 'Bold serif', fn: mapFromRange(0x1D400, 0x1D41A, 0x1D7CE) },
    { name: 'Italic serif', fn: mapFromRange(0x1D434, 0x1D44E, null) },
    { name: 'Monospace', fn: mapFromRange(0x1D670, 0x1D68A, 0x1D7F6) },
    { name: 'Script', fn: mapFromRange(0x1D49C, 0x1D4B6, null) },
    { name: 'Bold script', fn: mapFromRange(0x1D4D0, 0x1D4EA, null) },
    { name: 'Fraktur', fn: mapFromRange(0x1D504, 0x1D51E, null) },
    { name: 'Double-struck', fn: mapFromRange(0x1D538, 0x1D552, 0x1D7D8) },
    { name: 'Circled', fn: circledLetter },
    { name: 'Squared', fn: squared },
    { name: 'Fullwidth', fn: mapFromRange(0xFF21, 0xFF41, 0xFF10) },
    { name: 'Strikethrough', fn: (s) => combining(s, '\u0336') },
    { name: 'Underline', fn: (s) => combining(s, '\u0332') },
    { name: 'Upside-down', fn: upsideDown },
    { name: 'Tiny caps', fn: tinyCaps }
  ];

  const inputEl = document.getElementById('input');
  const stylesEl = document.getElementById('styles');

  function render() {
    stylesEl.innerHTML = '';
    const text = inputEl.value;
    for (const style of STYLES) {
      const row = document.createElement('div');
      row.className = 'style-row';
      const name = document.createElement('div');
      name.className = 'style-name';
      name.textContent = style.name;
      const out = document.createElement('div');
      out.className = 'style-output';
      let result;
      try { result = style.fn(text); } catch (e) { result = ''; }
      out.textContent = result;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(result).then(() => {
          btn.textContent = 'Copied';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1200);
        });
      });
      row.appendChild(name);
      row.appendChild(out);
      row.appendChild(btn);
      stylesEl.appendChild(row);
    }
  }

  inputEl.addEventListener('input', render);
  render();
})();
