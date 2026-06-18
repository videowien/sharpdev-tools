// XML Formatter & XML <-> JSON
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const inputEl = $('input');
  const outputEl = $('output');
  const statsIn = $('stats-in');
  const statsOut = $('stats-out');
  const errBox = $('error-box');
  const okBox = $('success-box');
  const indentSel = $('opt-indent');
  const rootInput = $('opt-root');
  const simplifyChk = $('opt-simplify');

  function indentStr() {
    const v = indentSel.value;
    if (v === 'tab') return '\t';
    return ' '.repeat(parseInt(v, 10) || 2);
  }

  function escapeHTML(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

  function showError(msg) { errBox.style.display = 'block'; errBox.innerHTML = '<strong>Error</strong>' + escapeHTML(msg); okBox.style.display = 'none'; }
  function showSuccess(msg) { okBox.style.display = 'block'; okBox.textContent = msg; errBox.style.display = 'none'; }
  function clearMsg() { okBox.style.display = 'none'; errBox.style.display = 'none'; }

  /* ============ XML parse via DOMParser ============ */
  function parseXML(src) {
    const p = new DOMParser();
    const doc = p.parseFromString(src, 'application/xml');
    const err = doc.getElementsByTagName('parsererror')[0];
    if (err) {
      // extract message
      const msg = err.textContent.replace(/\s+/g, ' ').trim();
      throw new Error(msg);
    }
    return doc;
  }

  /* ============ Pretty format ============ */
  function formatXML(src, indent) {
    const doc = parseXML(src);
    let out = '';
    // Handle XML declaration separately — DOMParser strips it but we can preserve from source
    const declMatch = src.match(/^\s*<\?xml[^?]*\?>/);
    if (declMatch) out += declMatch[0] + '\n';
    // Serialize children of document
    for (const node of doc.childNodes) {
      out += serializeNode(node, indent, 0);
    }
    return out.replace(/\n+$/, '');
  }

  function isAllText(node) {
    if (!node.childNodes.length) return true;
    for (const c of node.childNodes) {
      if (c.nodeType !== 3 && c.nodeType !== 4) return false;
    }
    return true;
  }

  function serializeNode(node, indent, depth) {
    const pad = indent.repeat ? indent.repeat(depth) : indent.repeat(depth);
    switch (node.nodeType) {
      case 1: { // element
        const name = node.nodeName;
        let s = pad + '<' + name;
        for (const a of node.attributes) s += ' ' + a.name + '="' + escapeAttr(a.value) + '"';
        if (!node.childNodes.length) return s + '/>\n';
        if (isAllText(node)) {
          const txt = Array.from(node.childNodes).map(c => c.nodeType === 4 ? '<![CDATA[' + c.nodeValue + ']]>' : escapeText(c.nodeValue)).join('');
          return s + '>' + txt + '</' + name + '>\n';
        }
        s += '>\n';
        for (const c of node.childNodes) {
          if (c.nodeType === 3) {
            const t = c.nodeValue.trim();
            if (t) s += indent.repeat(depth + 1) + escapeText(t) + '\n';
          } else {
            s += serializeNode(c, indent, depth + 1);
          }
        }
        s += pad + '</' + name + '>\n';
        return s;
      }
      case 3: { // text
        const t = node.nodeValue.trim();
        return t ? pad + escapeText(t) + '\n' : '';
      }
      case 4: return pad + '<![CDATA[' + node.nodeValue + ']]>\n';
      case 7: return pad + '<?' + node.target + ' ' + node.data + '?>\n';
      case 8: return pad + '<!--' + node.nodeValue + '-->\n';
      case 9: case 11: {
        let s = '';
        for (const c of node.childNodes) s += serializeNode(c, indent, depth);
        return s;
      }
    }
    return '';
  }

  function escapeAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function escapeText(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function minifyXML(src) {
    const doc = parseXML(src);
    let out = '';
    const declMatch = src.match(/^\s*<\?xml[^?]*\?>/);
    if (declMatch) out += declMatch[0];
    for (const node of doc.childNodes) out += minifyNode(node);
    return out;
  }

  function minifyNode(node) {
    switch (node.nodeType) {
      case 1: {
        let s = '<' + node.nodeName;
        for (const a of node.attributes) s += ' ' + a.name + '="' + escapeAttr(a.value) + '"';
        if (!node.childNodes.length) return s + '/>';
        s += '>';
        for (const c of node.childNodes) s += minifyNode(c);
        return s + '</' + node.nodeName + '>';
      }
      case 3: return escapeText(node.nodeValue.trim());
      case 4: return '<![CDATA[' + node.nodeValue + ']]>';
      case 7: return '<?' + node.target + ' ' + node.data + '?>';
      case 8: return '<!--' + node.nodeValue + '-->';
      case 9: case 11: {
        let s = '';
        for (const c of node.childNodes) s += minifyNode(c);
        return s;
      }
    }
    return '';
  }

  /* ============ XML -> JSON ============ */
  function xmlToJSON(src, simplify) {
    const doc = parseXML(src);
    const root = doc.documentElement;
    return { [root.nodeName]: elementToObj(root, simplify) };
  }

  function elementToObj(el, simplify) {
    const obj = {};
    // attributes
    for (const a of el.attributes) obj['@' + a.name] = a.value;
    // text content
    let textParts = [];
    for (const c of el.childNodes) {
      if (c.nodeType === 3) {
        const t = c.nodeValue;
        if (t.trim()) textParts.push(t);
      } else if (c.nodeType === 4) {
        textParts.push(c.nodeValue);
      } else if (c.nodeType === 1) {
        const childObj = elementToObj(c, simplify);
        const name = c.nodeName;
        if (name in obj) {
          if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
          obj[name].push(childObj);
        } else {
          obj[name] = childObj;
        }
      } else if (c.nodeType === 8) {
        // comment — skip
      }
    }
    if (textParts.length) {
      const txt = textParts.join('').trim();
      if (Object.keys(obj).length === 0) {
        if (simplify) return txt;
        return { '#text': txt };
      } else {
        obj['#text'] = txt;
      }
    }
    if (Object.keys(obj).length === 0) return simplify ? null : {};
    return obj;
  }

  /* ============ JSON -> XML ============ */
  function jsonToXML(jsonStr, rootName, indent) {
    const obj = JSON.parse(jsonStr);
    let inner;
    let root = rootName;
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      const keys = Object.keys(obj).filter(k => !k.startsWith('@') && k !== '#text');
      if (keys.length === 1) {
        root = keys[0];
        inner = obj[root];
      } else {
        inner = obj;
      }
    } else {
      inner = obj;
    }
    return emitXMLElement(root, inner, indent, 0);
  }

  function emitXMLElement(name, val, indent, depth) {
    const pad = indent.repeat(depth);
    if (val === null || val === undefined) return pad + '<' + name + '/>\n';
    if (typeof val !== 'object') {
      return pad + '<' + name + '>' + escapeText(String(val)) + '</' + name + '>\n';
    }
    if (Array.isArray(val)) {
      let out = '';
      for (const v of val) out += emitXMLElement(name, v, indent, depth);
      return out;
    }
    // object
    const attrs = [];
    const children = [];
    let textContent = null;
    for (const k of Object.keys(val)) {
      if (k.startsWith('@')) attrs.push([k.slice(1), val[k]]);
      else if (k === '#text') textContent = val[k];
      else children.push([k, val[k]]);
    }
    let open = '<' + name;
    for (const [k, v] of attrs) open += ' ' + k + '="' + escapeAttr(String(v)) + '"';
    if (!children.length && textContent === null) return pad + open + '/>\n';
    if (!children.length) return pad + open + '>' + escapeText(String(textContent)) + '</' + name + '>\n';
    let out = pad + open + '>\n';
    if (textContent !== null) out += indent.repeat(depth + 1) + escapeText(String(textContent)) + '\n';
    for (const [k, v] of children) out += emitXMLElement(k, v, indent, depth + 1);
    out += pad + '</' + name + '>\n';
    return out;
  }

  /* ============ UI ============ */
  function updateStats() {
    statsIn.textContent = inputEl.value.length + ' chars';
    statsOut.textContent = outputEl.value.length + ' chars';
  }
  function detectIsJSON(text) { const t = text.trim(); return t.startsWith('{') || t.startsWith('['); }

  function doFormat() {
    clearMsg();
    try { outputEl.value = formatXML(inputEl.value, indentStr()); updateStats(); showSuccess('Formatted'); }
    catch (e) { showError(e.message); }
  }
  function doMin() {
    clearMsg();
    try { outputEl.value = minifyXML(inputEl.value); updateStats(); showSuccess('Minified'); }
    catch (e) { showError(e.message); }
  }
  function doX2J() {
    clearMsg();
    try {
      const obj = xmlToJSON(inputEl.value, simplifyChk.checked);
      outputEl.value = JSON.stringify(obj, null, indentStr() === '\t' ? '\t' : parseInt(indentSel.value, 10));
      updateStats(); showSuccess('XML converted to JSON');
    } catch (e) { showError(e.message); }
  }
  function doJ2X() {
    clearMsg();
    try {
      outputEl.value = jsonToXML(inputEl.value, rootInput.value || 'root', indentStr()).replace(/\n+$/, '');
      updateStats(); showSuccess('JSON converted to XML');
    } catch (e) { showError(e.message); }
  }
  function swap() { const t = inputEl.value; inputEl.value = outputEl.value; outputEl.value = t; updateStats(); }
  function clearAll() { inputEl.value = ''; outputEl.value = ''; updateStats(); clearMsg(); }
  function copyOut() { if (!outputEl.value) return; navigator.clipboard.writeText(outputEl.value).then(() => showSuccess('Copied')); }
  function autoRun() {
    if (!inputEl.value.trim()) { outputEl.value = ''; updateStats(); return; }
    if (detectIsJSON(inputEl.value)) doJ2X();
    else doFormat();
  }

  document.getElementById('btn-format').addEventListener('click', doFormat);
  document.getElementById('btn-min').addEventListener('click', doMin);
  document.getElementById('btn-x2j').addEventListener('click', doX2J);
  document.getElementById('btn-j2x').addEventListener('click', doJ2X);
  document.getElementById('btn-swap').addEventListener('click', swap);
  document.getElementById('btn-copy').addEventListener('click', copyOut);
  document.getElementById('btn-clear').addEventListener('click', clearAll);
  inputEl.addEventListener('input', updateStats);

  inputEl.value = '<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n<book id="1" genre="fiction"><title>The Example</title><author>Jane Doe</author><price currency="USD">12.99</price></book>\n<book id="2" genre="nonfiction"><title>Reference</title><author>John Smith</author><price currency="EUR">8.50</price></book>\n</catalog>';
  autoRun();
})();
