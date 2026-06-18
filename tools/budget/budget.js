const $=id=>document.getElementById(id);
function fmt(n){return n.toLocaleString('en-US',{maximumFractionDigits:0});}
function go(){const inc=parseFloat($('inc').value)||0;$('needs').textContent=fmt(inc*0.5);$('wants').textContent=fmt(inc*0.3);$('save').textContent=fmt(inc*0.2);}
$('inc').addEventListener('input',go);go();