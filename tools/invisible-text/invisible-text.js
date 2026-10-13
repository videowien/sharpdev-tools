const $=id=>document.getElementById(id);
function go(){const n=Math.min(1000,Math.max(1,parseInt($('n').value)||1));const code=parseInt($('type').value,16);$('out').value=String.fromCharCode(code).repeat(n);}
$('n').addEventListener('input',go);$('type').addEventListener('change',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
go();