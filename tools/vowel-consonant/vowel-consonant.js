const $=id=>document.getElementById(id);
function go(){const t=$('in').value;const v=(t.match(/[aeiou]/gi)||[]).length;const l=(t.match(/[a-z]/gi)||[]).length;$('v').textContent=v;$('c').textContent=l-v;$('l').textContent=l;$('p').textContent=l?Math.round(v/l*100)+'%':'0%';}
$('in').addEventListener('input',go);go();