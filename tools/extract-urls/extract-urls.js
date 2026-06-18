const $=id=>document.getElementById(id);
const RE=/\b(?:https?:\/\/|www\.)[^\s<>"'\)\]]+/gi;
function go(){let m=$('in').value.match(RE)||[];m=m.map(u=>u.replace(/[.,;:]+$/,''));if($('dedupe').checked)m=[...new Set(m)];if($('sort').checked)m=[...m].sort();
$('out').textContent=m.join('\n');$('cnt').textContent=m.length;}
['in','dedupe','sort'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();