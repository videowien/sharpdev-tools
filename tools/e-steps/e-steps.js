const $=id=>document.getElementById(id);
function go(){const cur=+$('cur').value,req=+$('req').value,act=+$('act').value;
 if(!(cur>0&&req>0&&act>0)){['new','err','cmd'].forEach(id=>$(id).textContent='-');return;}
 const ns=cur*req/act;const err=(act-req)/req*100;
 $('new').textContent=ns.toFixed(2);
 $('err').textContent=(err>0?'+':'')+err.toFixed(1)+'% ('+(err>0?'over':'under')+'-extruding)';
 $('cmd').textContent='M92 E'+ns.toFixed(2)+'  →  M500';}
['cur','req','act'].forEach(id=>$(id).addEventListener('input',go));go();