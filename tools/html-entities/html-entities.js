(function () {
  // Named entity table — name -> codepoint
  const NAMED = {
    quot: 34, amp: 38, apos: 39, lt: 60, gt: 62, nbsp: 160,
    iexcl: 161, cent: 162, pound: 163, curren: 164, yen: 165, brvbar: 166,
    sect: 167, uml: 168, copy: 169, ordf: 170, laquo: 171, not: 172,
    shy: 173, reg: 174, macr: 175, deg: 176, plusmn: 177, sup2: 178,
    sup3: 179, acute: 180, micro: 181, para: 182, middot: 183, cedil: 184,
    sup1: 185, ordm: 186, raquo: 187, frac14: 188, frac12: 189, frac34: 190,
    iquest: 191,
    Agrave: 192, Aacute: 193, Acirc: 194, Atilde: 195, Auml: 196, Aring: 197,
    AElig: 198, Ccedil: 199, Egrave: 200, Eacute: 201, Ecirc: 202, Euml: 203,
    Igrave: 204, Iacute: 205, Icirc: 206, Iuml: 207, ETH: 208, Ntilde: 209,
    Ograve: 210, Oacute: 211, Ocirc: 212, Otilde: 213, Ouml: 214, times: 215,
    Oslash: 216, Ugrave: 217, Uacute: 218, Ucirc: 219, Uuml: 220, Yacute: 221,
    THORN: 222, szlig: 223,
    agrave: 224, aacute: 225, acirc: 226, atilde: 227, auml: 228, aring: 229,
    aelig: 230, ccedil: 231, egrave: 232, eacute: 233, ecirc: 234, euml: 235,
    igrave: 236, iacute: 237, icirc: 238, iuml: 239, eth: 240, ntilde: 241,
    ograve: 242, oacute: 243, ocirc: 244, otilde: 245, ouml: 246, divide: 247,
    oslash: 248, ugrave: 249, uacute: 250, ucirc: 251, uuml: 252, yacute: 253,
    thorn: 254, yuml: 255,
    OElig: 338, oelig: 339, Scaron: 352, scaron: 353, Yuml: 376,
    fnof: 402, circ: 710, tilde: 732,
    Alpha: 913, Beta: 914, Gamma: 915, Delta: 916, Epsilon: 917, Zeta: 918,
    Eta: 919, Theta: 920, Iota: 921, Kappa: 922, Lambda: 923, Mu: 924,
    Nu: 925, Xi: 926, Omicron: 927, Pi: 928, Rho: 929, Sigma: 931, Tau: 932,
    Upsilon: 933, Phi: 934, Chi: 935, Psi: 936, Omega: 937,
    alpha: 945, beta: 946, gamma: 947, delta: 948, epsilon: 949, zeta: 950,
    eta: 951, theta: 952, iota: 953, kappa: 954, lambda: 955, mu: 956,
    nu: 957, xi: 958, omicron: 959, pi: 960, rho: 961, sigmaf: 962,
    sigma: 963, tau: 964, upsilon: 965, phi: 966, chi: 967, psi: 968, omega: 969,
    ensp: 8194, emsp: 8195, thinsp: 8201, zwnj: 8204, zwj: 8205, lrm: 8206, rlm: 8207,
    ndash: 8211, mdash: 8212, lsquo: 8216, rsquo: 8217, sbquo: 8218,
    ldquo: 8220, rdquo: 8221, bdquo: 8222, dagger: 8224, Dagger: 8225,
    bull: 8226, hellip: 8230, permil: 8240, prime: 8242, Prime: 8243,
    lsaquo: 8249, rsaquo: 8250, oline: 8254, frasl: 8260, euro: 8364,
    trade: 8482,
    larr: 8592, uarr: 8593, rarr: 8594, darr: 8595, harr: 8596, crarr: 8629,
    lArr: 8656, uArr: 8657, rArr: 8658, dArr: 8659, hArr: 8660,
    forall: 8704, part: 8706, exist: 8707, empty: 8709, nabla: 8711,
    isin: 8712, notin: 8713, ni: 8715, prod: 8719, sum: 8721, minus: 8722,
    lowast: 8727, radic: 8730, prop: 8733, infin: 8734, ang: 8736, and: 8743,
    or: 8744, cap: 8745, cup: 8746, int: 8747, there4: 8756, sim: 8764,
    cong: 8773, asymp: 8776, ne: 8800, equiv: 8801, le: 8804, ge: 8805,
    sub: 8834, sup: 8835, nsub: 8836, sube: 8838, supe: 8839,
    oplus: 8853, otimes: 8855, perp: 8869, sdot: 8901,
    lceil: 8968, rceil: 8969, lfloor: 8970, rfloor: 8971,
    lang: 9001, rang: 9002, loz: 9674, spades: 9824, clubs: 9827, hearts: 9829, diams: 9830,
  };

  // Reverse lookup: codepoint -> name (prefer lowercase/common)
  const CP_TO_NAME = {};
  for (const name in NAMED) {
    const cp = NAMED[name];
    if (!(cp in CP_TO_NAME)) CP_TO_NAME[cp] = name;
  }

  const SAFE_MAP = { 38: 'amp', 60: 'lt', 62: 'gt', 34: 'quot', 39: '#39' };

  function encSafe(s) {
    return s.replace(/[&<>"']/g, c => {
      const cp = c.charCodeAt(0);
      const ent = SAFE_MAP[cp];
      return ent === '#39' ? '&#39;' : '&' + ent + ';';
    });
  }

  function encAll(s, mode) {
    let out = '';
    for (const ch of s) {
      const cp = ch.codePointAt(0);
      // Always encode the HTML-significant ones
      if (cp === 38 || cp === 60 || cp === 62 || cp === 34 || cp === 39) {
        out += '&' + (SAFE_MAP[cp] === '#39' ? '#39' : SAFE_MAP[cp]) + ';';
        continue;
      }
      if (cp < 128) { out += ch; continue; }
      if (mode === 'named' && CP_TO_NAME[cp]) {
        out += '&' + CP_TO_NAME[cp] + ';';
      } else if (mode === 'hex') {
        out += '&#x' + cp.toString(16).toUpperCase() + ';';
      } else { // dec
        out += '&#' + cp + ';';
      }
    }
    return out;
  }

  function decode(s) {
    return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g, (_m, body) => {
      if (body[0] === '#') {
        let cp;
        if (body[1] === 'x' || body[1] === 'X') cp = parseInt(body.slice(2), 16);
        else cp = parseInt(body.slice(1), 10);
        if (!isFinite(cp) || cp < 0 || cp > 0x10FFFF) return _m;
        try { return String.fromCodePoint(cp); } catch (e) { return _m; }
      }
      if (NAMED[body] != null) return String.fromCodePoint(NAMED[body]);
      return _m;
    });
  }

  const inp = document.getElementById('input');
  const outp = document.getElementById('output');
  const statsIn = document.getElementById('stats-in');
  const statsOut = document.getElementById('stats-out');
  const preview = document.getElementById('preview');

  window.enc = function (mode) {
    outp.value = mode === 'safe' ? encSafe(inp.value) : encAll(inp.value, mode);
    updateStats();
  };
  window.dec = function () {
    outp.value = decode(inp.value);
    updateStats();
  };
  window.swap = function () {
    const tmp = inp.value; inp.value = outp.value; outp.value = tmp;
    updateStats();
  };
  window.copyOut = function () {
    navigator.clipboard.writeText(outp.value).catch(() => {});
  };
  window.clearAll = function () {
    inp.value = ''; outp.value = ''; updateStats();
  };

  function updateStats() {
    statsIn.textContent = inp.value.length + ' chars';
    statsOut.textContent = outp.value.length + ' chars';
    // Preview: render decoded form of output (treat output as HTML entities, text otherwise)
    preview.textContent = decode(outp.value || inp.value);
  }

  inp.addEventListener('input', updateStats);
  updateStats();
})();
