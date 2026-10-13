// Mock Data Generator
(function () {
  'use strict';

  const FIRST_NAMES = ['Alex','Jordan','Taylor','Morgan','Casey','Riley','Sam','Jamie','Avery','Parker','Quinn','Reese','Rowan','Sage','Skyler','Blake','Cameron','Drew','Ellis','Finley','Harper','Hayden','Kai','Kennedy','Lane','Logan','Marlow','Micah','Noel','Oakley','Peyton','Phoenix','Remy','Robin','Sawyer','Shay','Sloane','Tatum','Tristan','River','Rory','Sasha','Shiloh','Sutton','Teagan','Toby','Val','West','Wren','Zion'];
  const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts'];
  const CITIES = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte','Indianapolis','Seattle','Denver','Washington','Boston','Nashville','Baltimore','Portland','Las Vegas','Milwaukee','Albuquerque','Tucson','Fresno','Sacramento','Kansas City'];
  const STATES = ['CA','TX','FL','NY','PA','IL','OH','GA','NC','MI','NJ','VA','WA','AZ','MA','TN','IN','MD','MO','WI'];
  const COUNTRIES = ['United States','Canada','United Kingdom','Germany','France','Spain','Italy','Netherlands','Sweden','Japan','Australia','Brazil','Mexico'];
  const COMPANIES = ['Acme','Globex','Initech','Umbrella','Stark','Wayne','Hooli','Pied Piper','Vandelay','Wonka','Cyberdyne','Tyrell','Massive Dynamic','Oscorp','Weyland','LexCorp','Aperture','Black Mesa','Soylent','Gringotts','Nakatomi','Duff','Los Pollos','Dunder Mifflin','Prestige','Duncan Hines','Virtucon','Stockwell','Genco','Parker Industries'];
  const JOBS = ['Software Engineer','Product Manager','Designer','Data Analyst','Marketing Lead','CEO','CTO','Accountant','HR Manager','Sales Rep','Consultant','Architect','Researcher','Developer','Support Specialist'];
  const DEPTS = ['Engineering','Product','Design','Marketing','Sales','HR','Finance','Operations','Support','Research','Legal'];
  const STREETS = ['Main','Oak','Pine','Maple','Cedar','Elm','Park','Washington','Lake','Hill','Sunset','River','Church','High','Spring'];
  const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

  const FIELD_TYPES = [
    { key: 'firstName', label: 'First name' },
    { key: 'lastName', label: 'Last name' },
    { key: 'fullName', label: 'Full name' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'password', label: 'Password' },
    { key: 'phone', label: 'Phone' },
    { key: 'street', label: 'Street' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'country', label: 'Country' },
    { key: 'zip', label: 'Zip' },
    { key: 'address', label: 'Full address' },
    { key: 'latlng', label: 'Lat/Lng' },
    { key: 'company', label: 'Company' },
    { key: 'jobTitle', label: 'Job title' },
    { key: 'department', label: 'Department' },
    { key: 'date', label: 'Date' },
    { key: 'datetime', label: 'Date-time' },
    { key: 'age', label: 'Age' },
    { key: 'uuid', label: 'UUID' },
    { key: 'int', label: 'Integer' },
    { key: 'float', label: 'Float' },
    { key: 'bool', label: 'Boolean' },
    { key: 'loremSentence', label: 'Lorem sentence' },
    { key: 'loremParagraph', label: 'Lorem paragraph' },
    { key: 'url', label: 'URL' },
    { key: 'ip', label: 'IP' },
    { key: 'color', label: 'Color (hex)' },
    { key: 'avatar', label: 'Avatar URL' },
    { key: 'index', label: 'Index' },
    { key: 'enum', label: 'Enum (custom)' }
  ];

  /* ========== Seedable RNG ========== */
  function hashSeed(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let rng = null;
  function setSeed(seed) {
    if (seed) rng = mulberry32(hashSeed(seed));
    else {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      rng = mulberry32(arr[0]);
    }
  }
  function rand() { return rng(); }
  function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }

  /* ========== Generators ========== */
  function genByType(type, opts, i) {
    switch (type) {
      case 'firstName': return pick(FIRST_NAMES);
      case 'lastName': return pick(LAST_NAMES);
      case 'fullName': return pick(FIRST_NAMES) + ' ' + pick(LAST_NAMES);
      case 'username': return (pick(FIRST_NAMES) + pick(LAST_NAMES)).toLowerCase() + randInt(1, 999);
      case 'email': {
        const fn = pick(FIRST_NAMES).toLowerCase(); const ln = pick(LAST_NAMES).toLowerCase();
        const doms = ['example.com', 'test.io', 'mail.co', 'fake.net', 'demo.org'];
        return fn + '.' + ln + '@' + pick(doms);
      }
      case 'password': {
        const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
        let s = ''; for (let j = 0; j < 12; j++) s += chars[Math.floor(rand() * chars.length)]; return s;
      }
      case 'phone': return '+1 (' + randInt(200, 999) + ') ' + String(randInt(100, 999)).padStart(3, '0') + '-' + String(randInt(1000, 9999)).padStart(4, '0');
      case 'street': return randInt(1, 9999) + ' ' + pick(STREETS) + ' ' + pick(['St', 'Ave', 'Rd', 'Blvd', 'Ln']);
      case 'city': return pick(CITIES);
      case 'state': return pick(STATES);
      case 'country': return pick(COUNTRIES);
      case 'zip': return String(randInt(10000, 99999));
      case 'address': return randInt(1, 9999) + ' ' + pick(STREETS) + ' ' + pick(['St','Ave','Rd']) + ', ' + pick(CITIES) + ', ' + pick(STATES) + ' ' + randInt(10000, 99999);
      case 'latlng': return { lat: +((rand() * 180 - 90).toFixed(5)), lng: +((rand() * 360 - 180).toFixed(5)) };
      case 'company': return pick(COMPANIES);
      case 'jobTitle': return pick(JOBS);
      case 'department': return pick(DEPTS);
      case 'date': {
        const from = opts.from ? new Date(opts.from).getTime() : Date.now() - 5 * 365 * 864e5;
        const to = opts.to ? new Date(opts.to).getTime() : Date.now();
        const t = from + rand() * (to - from);
        return new Date(t).toISOString().slice(0, 10);
      }
      case 'datetime': {
        const from = opts.from ? new Date(opts.from).getTime() : Date.now() - 5 * 365 * 864e5;
        const to = opts.to ? new Date(opts.to).getTime() : Date.now();
        return new Date(from + rand() * (to - from)).toISOString();
      }
      case 'age': return randInt(+opts.min || 18, +opts.max || 80);
      case 'uuid': return uuid();
      case 'int': return randInt(+opts.min || 0, +opts.max || 1000);
      case 'float': return +(((+opts.min || 0) + rand() * ((+opts.max || 1000) - (+opts.min || 0))).toFixed(opts.decimals != null ? +opts.decimals : 2));
      case 'bool': return rand() < 0.5;
      case 'loremSentence': return loremSentence(randInt(6, 14));
      case 'loremParagraph': {
        const n = randInt(3, 6); return Array.from({ length: n }, () => loremSentence(randInt(6, 14))).join(' ');
      }
      case 'url': return 'https://' + pick(COMPANIES).toLowerCase().replace(/[^a-z0-9]/g, '') + '.com/' + pick(LOREM_WORDS);
      case 'ip': return randInt(1, 255) + '.' + randInt(0, 255) + '.' + randInt(0, 255) + '.' + randInt(1, 254);
      case 'color': return '#' + Math.floor(rand() * 0xffffff).toString(16).padStart(6, '0');
      case 'avatar': return 'https://i.pravatar.cc/150?u=' + randInt(1, 1000);
      case 'index': return i + 1;
      case 'enum': {
        const opts_ = (opts.values || '').split(',').map(s => s.trim()).filter(Boolean);
        return opts_.length ? pick(opts_) : null;
      }
    }
    return null;
  }
  function loremSentence(n) {
    const w = []; for (let i = 0; i < n; i++) w.push(pick(LOREM_WORDS));
    w[0] = w[0][0].toUpperCase() + w[0].slice(1);
    return w.join(' ') + '.';
  }
  function uuid() {
    const b = new Uint8Array(16);
    for (let i = 0; i < 16; i++) b[i] = Math.floor(rand() * 256);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
    return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
  }

  /* ========== Schema UI ========== */
  const PRESETS = {
    user: [
      { name: 'id', type: 'uuid' },
      { name: 'firstName', type: 'firstName' },
      { name: 'lastName', type: 'lastName' },
      { name: 'email', type: 'email' },
      { name: 'age', type: 'age', opts: { min: 18, max: 80 } },
      { name: 'isActive', type: 'bool' }
    ],
    customer: [
      { name: 'id', type: 'uuid' },
      { name: 'name', type: 'fullName' },
      { name: 'email', type: 'email' },
      { name: 'phone', type: 'phone' },
      { name: 'address', type: 'address' },
      { name: 'company', type: 'company' },
      { name: 'signupDate', type: 'date' }
    ],
    product: [
      { name: 'id', type: 'uuid' },
      { name: 'name', type: 'loremSentence' },
      { name: 'sku', type: 'int', opts: { min: 1000, max: 99999 } },
      { name: 'price', type: 'float', opts: { min: 1, max: 999, decimals: 2 } },
      { name: 'inStock', type: 'bool' },
      { name: 'category', type: 'enum', opts: { values: 'Electronics,Clothing,Books,Home,Toys' } }
    ],
    transaction: [
      { name: 'id', type: 'uuid' },
      { name: 'userId', type: 'uuid' },
      { name: 'amount', type: 'float', opts: { min: 1, max: 500, decimals: 2 } },
      { name: 'currency', type: 'enum', opts: { values: 'USD,EUR,GBP,JPY' } },
      { name: 'date', type: 'datetime' },
      { name: 'status', type: 'enum', opts: { values: 'pending,completed,failed' } }
    ],
    post: [
      { name: 'id', type: 'uuid' },
      { name: 'title', type: 'loremSentence' },
      { name: 'body', type: 'loremParagraph' },
      { name: 'author', type: 'fullName' },
      { name: 'published', type: 'bool' },
      { name: 'publishedAt', type: 'datetime' }
    ]
  };

  let schema = [...PRESETS.user];
  const fieldsEl = document.getElementById('fields');
  const outputEl = document.getElementById('output');
  const statsEl = document.getElementById('stats');
  const fmtSel = document.getElementById('opt-format');
  const countInput = document.getElementById('opt-count');
  const tableInput = document.getElementById('opt-table');
  const seedInput = document.getElementById('opt-seed');

  function renderFields() {
    fieldsEl.innerHTML = '';
    schema.forEach((f, idx) => {
      const row = document.createElement('div');
      row.className = 'field';
      row.innerHTML = `
        <span class="handle" title="Reorder">${idx + 1}</span>
        <input type="text" data-role="name" value="${escape(f.name)}" placeholder="name">
        <select data-role="type">${FIELD_TYPES.map(t => `<option value="${t.key}"${t.key === f.type ? ' selected' : ''}>${t.label}</option>`).join('')}</select>
        <input type="text" data-role="opts" value="${escape(optsToStr(f))}" placeholder="${optsHint(f.type)}">
        <button class="del" title="Remove">&times;</button>
      `;
      row.querySelector('[data-role="name"]').addEventListener('input', e => { schema[idx].name = e.target.value; });
      row.querySelector('[data-role="type"]').addEventListener('change', e => { schema[idx].type = e.target.value; schema[idx].opts = {}; renderFields(); regenerate(); });
      row.querySelector('[data-role="opts"]').addEventListener('input', e => { schema[idx].opts = parseOptsStr(schema[idx].type, e.target.value); });
      row.querySelector('[data-role="opts"]').addEventListener('blur', regenerate);
      row.querySelector('[data-role="name"]').addEventListener('blur', regenerate);
      row.querySelector('.del').addEventListener('click', () => { schema.splice(idx, 1); renderFields(); regenerate(); });
      // simple up/down via handle
      row.querySelector('.handle').addEventListener('click', () => {
        if (idx < schema.length - 1) { const t = schema[idx]; schema[idx] = schema[idx + 1]; schema[idx + 1] = t; renderFields(); regenerate(); }
      });
      fieldsEl.appendChild(row);
    });
  }
  function escape(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]); }
  function optsHint(type) {
    if (type === 'int' || type === 'float' || type === 'age') return 'min, max';
    if (type === 'date' || type === 'datetime') return 'from, to (YYYY-MM-DD)';
    if (type === 'enum') return 'comma,separated,values';
    return '';
  }
  function optsToStr(f) {
    if (!f.opts) return '';
    const o = f.opts;
    if (f.type === 'int' || f.type === 'float' || f.type === 'age') return [o.min, o.max].filter(x => x != null).join(', ');
    if (f.type === 'date' || f.type === 'datetime') return [o.from, o.to].filter(Boolean).join(', ');
    if (f.type === 'enum') return o.values || '';
    return '';
  }
  function parseOptsStr(type, s) {
    if (type === 'int' || type === 'float' || type === 'age') {
      const p = s.split(',').map(x => x.trim());
      return { min: p[0] !== '' ? +p[0] : undefined, max: p[1] !== '' ? +p[1] : undefined };
    }
    if (type === 'date' || type === 'datetime') {
      const p = s.split(',').map(x => x.trim());
      return { from: p[0] || undefined, to: p[1] || undefined };
    }
    if (type === 'enum') return { values: s };
    return {};
  }

  function generate() {
    setSeed(seedInput.value.trim());
    const n = Math.min(1000, Math.max(1, +countInput.value || 10));
    const rows = [];
    for (let i = 0; i < n; i++) {
      const obj = {};
      for (const f of schema) obj[f.name] = genByType(f.type, f.opts || {}, i);
      rows.push(obj);
    }
    return rows;
  }

  function formatOutput(rows) {
    const fmt = fmtSel.value;
    if (fmt === 'json') return JSON.stringify(rows, null, 2);
    if (fmt === 'ndjson') return rows.map(r => JSON.stringify(r)).join('\n');
    if (fmt === 'csv') return toCSV(rows);
    if (fmt === 'sql') return toSQL(rows, tableInput.value || 'data');
    if (fmt === 'ts') return toTS(rows, tableInput.value || 'Data');
    return '';
  }
  function toCSV(rows) {
    if (!rows.length) return '';
    const keys = Object.keys(rows[0]);
    const esc = (v) => {
      if (v == null) return '';
      let s = typeof v === 'object' ? JSON.stringify(v) : String(v);
      if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
      return s;
    };
    return [keys.join(','), ...rows.map(r => keys.map(k => esc(r[k])).join(','))].join('\n');
  }
  function sqlVal(v) {
    if (v == null) return 'NULL';
    if (typeof v === 'number') return String(v);
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    if (typeof v === 'object') return "'" + JSON.stringify(v).replace(/'/g, "''") + "'";
    return "'" + String(v).replace(/'/g, "''") + "'";
  }
  function toSQL(rows, table) {
    if (!rows.length) return '';
    const keys = Object.keys(rows[0]);
    return rows.map(r => `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(k => sqlVal(r[k])).join(', ')});`).join('\n');
  }
  function toTS(rows, name) {
    if (!rows.length) return '';
    const sample = rows[0];
    const lines = [`interface ${name} {`];
    for (const k of Object.keys(sample)) {
      const v = sample[k];
      let t = 'string';
      if (typeof v === 'number') t = 'number';
      else if (typeof v === 'boolean') t = 'boolean';
      else if (v === null) t = 'string | null';
      else if (typeof v === 'object') t = 'Record<string, any>';
      lines.push(`  ${k}: ${t};`);
    }
    lines.push('}');
    lines.push('');
    lines.push(`const data: ${name}[] = ${JSON.stringify(rows, null, 2)};`);
    return lines.join('\n');
  }

  function regenerate() {
    const rows = generate();
    outputEl.value = formatOutput(rows);
    statsEl.textContent = outputEl.value.length + ' chars \u00b7 ' + rows.length + ' rows';
  }

  document.getElementById('btn-add').addEventListener('click', () => { schema.push({ name: 'field' + (schema.length + 1), type: 'firstName' }); renderFields(); regenerate(); });
  document.getElementById('btn-gen').addEventListener('click', regenerate);
  document.getElementById('btn-copy').addEventListener('click', () => { if (outputEl.value) navigator.clipboard.writeText(outputEl.value); });
  document.getElementById('btn-dl').addEventListener('click', () => {
    const fmt = fmtSel.value;
    const ext = { json: 'json', ndjson: 'ndjson', csv: 'csv', sql: 'sql', ts: 'ts' }[fmt] || 'txt';
    const blob = new Blob([outputEl.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'mock-data.' + ext;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  });
  fmtSel.addEventListener('change', regenerate);
  countInput.addEventListener('change', regenerate);
  tableInput.addEventListener('change', regenerate);
  seedInput.addEventListener('change', regenerate);
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      schema = JSON.parse(JSON.stringify(PRESETS[btn.dataset.preset]));
      if (btn.dataset.preset === 'user') tableInput.value = 'users';
      else if (btn.dataset.preset === 'customer') tableInput.value = 'customers';
      else if (btn.dataset.preset === 'product') tableInput.value = 'products';
      else if (btn.dataset.preset === 'transaction') tableInput.value = 'transactions';
      else if (btn.dataset.preset === 'post') tableInput.value = 'posts';
      renderFields(); regenerate();
    });
  });

  renderFields();
  regenerate();
})();
