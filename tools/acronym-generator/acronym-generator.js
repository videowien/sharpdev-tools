const $=id=>document.getElementById(id);
const SKIP=new Set(['a','an','the','of','and','for','to','in','on','at','by','or','with','from','as']);
function go(){const words=$('in').value.split(/\s+/).filter(Boolean);const skip=$('skip').checked;const acr=words.filter(function(w){return !skip||!SKIP.has(w.toLowerCase());}).map(function(w){const m=w.match(/[a-z0-9]/i);return m?m[0].toUpperCase():'';}).join('');$('out').textContent=acr||'—';}
$('in').addEventListener('input',go);$('skip').addEventListener('change',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').textContent));
go();