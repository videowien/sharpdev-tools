const $=id=>document.getElementById(id);
function rot47(s){return s.replace(/[\x21-\x7e]/g,function(c){return String.fromCharCode(33+((c.charCodeAt(0)-33+47)%94));});}
function go(){$('out').value=rot47($('in').value);}
$('run').addEventListener('click',go);$('in').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
go();