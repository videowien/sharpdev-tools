const $=id=>document.getElementById(id);
function go(){$('out').value=$('in').value.split('\n').map(function(l){return l.trim()===''?'':l.trim().split(/\s+/).reverse().join(' ');}).join('\n');}
$('in').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
go();