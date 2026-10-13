(function(){
  const $ = id => document.getElementById(id);
  const input = $('input'), output = $('output');

  const EXAMPLE = {
    id: "c4c3f0b2-9c4e-4c0e-8f0f-1e0b7c7f6d2a",
    name: "Alex Rivera",
    email: "alex@example.com",
    age: 32,
    is_active: true,
    website: "https://example.com",
    tags: ["designer","remote"],
    address: {
      street: "123 Main St",
      city: "Berlin",
      zip: "10115"
    },
    friends: [
      { name: "Jess", age: 30 },
      { name: "Sam", age: 34 }
    ],
    created_at: "2024-11-20T10:15:30Z"
  };

  function draftUri(d){
    if (d === '2020-12') return 'https://json-schema.org/draft/2020-12/schema';
    if (d === '2019-09') return 'https://json-schema.org/draft/2019-09/schema';
    if (d === 'draft-07') return 'http://json-schema.org/draft-07/schema#';
    return 'http://json-schema.org/draft-04/schema#';
  }

  const FORMATS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    uri: /^https?:\/\/[^\s]+$/i,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    'date-time': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    time: /^\d{2}:\d{2}:\d{2}/,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)$/
  };

  function detectFormat(s){
    for (const k in FORMATS) if (FORMATS[k].test(s)) return k;
    return null;
  }

  function inferValue(v, opts){
    if (v === null) return { type: 'null' };
    if (Array.isArray(v)) {
      const sch = { type: 'array' };
      if (v.length === 0) return sch;
      // Merge item schemas
      const itemSchemas = v.map(x => inferValue(x, opts));
      sch.items = mergeSchemas(itemSchemas, v, opts);
      return sch;
    }
    const t = typeof v;
    if (t === 'string') {
      const sch = { type: 'string' };
      if (opts.formats) {
        const f = detectFormat(v);
        if (f) sch.format = f;
      }
      if (opts.examples) sch.examples = [v];
      return sch;
    }
    if (t === 'number') {
      const sch = { type: Number.isInteger(v) ? 'integer' : 'number' };
      if (opts.examples) sch.examples = [v];
      return sch;
    }
    if (t === 'boolean') return { type: 'boolean' };
    if (t === 'object') {
      const sch = { type: 'object', properties: {} };
      const req = [];
      for (const k of Object.keys(v)) {
        sch.properties[k] = inferValue(v[k], opts);
        if (opts.titles) {
          sch.properties[k].title = k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g,' ');
          sch.properties[k].description = 'The ' + k + ' property.';
        }
        if (opts.required === 'all') req.push(k);
      }
      if (req.length) sch.required = req;
      return sch;
    }
    return {};
  }

  function mergeSchemas(schemas, rawItems, opts){
    if (schemas.length === 0) return {};
    if (schemas.length === 1) return schemas[0];
    // If all same simple type
    const types = new Set(schemas.map(s => s.type));
    if (types.size === 1) {
      const t = [...types][0];
      if (t === 'object') {
        // Union of properties; required = common keys
        const allKeys = new Set();
        const propSchemas = {};
        const keyCount = {};
        schemas.forEach((s, idx) => {
          const ks = Object.keys(s.properties || {});
          ks.forEach(k => {
            allKeys.add(k);
            keyCount[k] = (keyCount[k]||0) + 1;
            if (!propSchemas[k]) propSchemas[k] = [];
            propSchemas[k].push(s.properties[k]);
          });
        });
        const outProps = {};
        const rawValsByKey = {};
        rawItems.forEach(item => {
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            Object.keys(item).forEach(k => {
              if (!rawValsByKey[k]) rawValsByKey[k] = [];
              rawValsByKey[k].push(item[k]);
            });
          }
        });
        allKeys.forEach(k => {
          outProps[k] = mergeSchemas(propSchemas[k], rawValsByKey[k] || [], opts);
          // Enum detection on strings
          if (opts.enum && outProps[k].type === 'string' && rawValsByKey[k]) {
            const distinct = [...new Set(rawValsByKey[k].filter(x => typeof x === 'string'))];
            if (distinct.length > 1 && distinct.length < 8 && rawValsByKey[k].length >= distinct.length * 2) {
              outProps[k].enum = distinct;
            }
          }
          if (opts.bounds && (outProps[k].type === 'number' || outProps[k].type === 'integer') && rawValsByKey[k]) {
            const nums = rawValsByKey[k].filter(x => typeof x === 'number');
            if (nums.length > 1) {
              outProps[k].minimum = Math.min(...nums);
              outProps[k].maximum = Math.max(...nums);
            }
          }
        });
        const merged = { type: 'object', properties: outProps };
        if (opts.required === 'detect' || opts.required === 'all') {
          const req = [];
          allKeys.forEach(k => {
            if (keyCount[k] === schemas.length) req.push(k);
          });
          if (req.length) merged.required = req;
        }
        return merged;
      }
      // Arrays: merge items too
      if (t === 'array') {
        const itemSubs = schemas.map(s => s.items).filter(Boolean);
        const rawAllItems = [];
        rawItems.forEach(it => { if (Array.isArray(it)) rawAllItems.push(...it); });
        return { type: 'array', items: itemSubs.length ? mergeSchemas(itemSubs, rawAllItems, opts) : {} };
      }
      // Return first (or merge examples)
      return schemas[0];
    }
    // Multiple types: use anyOf
    return { anyOf: schemas };
  }

  function generate(){
    $('error-box').style.display = 'none';
    const txt = input.value.trim();
    if (!txt) { output.value = ''; updateStats(); return; }
    let data;
    try { data = JSON.parse(txt); }
    catch(e) {
      $('error-box').style.display = 'block';
      $('error-box').textContent = 'Invalid JSON: ' + e.message;
      return;
    }
    const opts = {
      required: $('opt-req').value,
      examples: $('opt-examples').checked,
      titles: $('opt-titles').checked,
      formats: $('opt-formats').checked,
      enum: $('opt-enum').checked,
      bounds: $('opt-bounds').checked
    };
    const schema = inferValue(data, opts);
    const out = Object.assign({ $schema: draftUri($('opt-draft').value) }, schema);
    if (opts.titles) { out.title = 'Root'; out.description = 'Generated schema.'; }
    output.value = JSON.stringify(out, null, 2);
    updateStats();
  }

  function updateStats(){
    $('stats-in').textContent = input.value.length + ' chars';
    $('stats-out').textContent = output.value.length + ' chars';
  }

  $('gen-btn').addEventListener('click', generate);
  $('clear-btn').addEventListener('click', () => { input.value = ''; output.value = ''; updateStats(); });
  $('swap-btn').addEventListener('click', () => { const a = input.value; input.value = output.value; output.value = a; updateStats(); });
  $('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(output.value).then(() => {
      const b = $('copy-btn'); const o = b.textContent; b.textContent = 'Copied'; setTimeout(()=>b.textContent = o, 1200);
    });
  });
  $('ex-btn').addEventListener('click', () => {
    input.value = JSON.stringify(EXAMPLE, null, 2);
    generate();
  });
  input.addEventListener('input', () => { generate(); });
  document.querySelectorAll('.options input, .options select').forEach(el => el.addEventListener('change', generate));

  // Seed
  input.value = JSON.stringify(EXAMPLE, null, 2);
  generate();
})();
