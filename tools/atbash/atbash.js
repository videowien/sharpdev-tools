const $=id=>document.getElementById(id);
function atbash(s){return s.replace(/[a-z]/gi,c=>{const b=c<='Z'?65:97;return String.fromCharCode(b+25-(c.charCodeAt(0)-b));});}
function go(){$('out').value=atbash($('in').value);}
$('in').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
go();