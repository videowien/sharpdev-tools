const $=id=>document.getElementById(id);
const RE=/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
function go(){let m=$('in').value.match(RE)||[];if($('dedupe').checked)m=[...new Set(m.map(e=>e.toLowerCase()))];if($('sort').checked)m=[...m].sort();
$('out').textContent=m.join('\n');$('cnt').textContent=m.length;}
['in','dedupe','sort'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();