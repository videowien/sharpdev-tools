const $=id=>document.getElementById(id);
function fmt(n){return n.toLocaleString('en-US',{maximumFractionDigits:2});}
function go(){const p=parseFloat($('p').value)||0,r=(parseFloat($('r').value)||0)/100,t=parseFloat($('t').value)||0;const I=p*r*t;$('int').textContent=fmt(I);$('tot').textContent=fmt(p+I);}
['p','r','t'].forEach(id=>$(id).addEventListener('input',go));go();