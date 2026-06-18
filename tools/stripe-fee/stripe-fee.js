const $=id=>document.getElementById(id);
function fmt(n){return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function go(){const mode=$('mode').value;const amt=parseFloat($('amt').value)||0;const r=(parseFloat($('rate').value)||0)/100;const f=parseFloat($('fixed').value)||0;let charge,fee,net;
if(mode==='fee'){charge=amt;fee=charge*r+f;net=charge-fee;}else{net=amt;charge=(net+f)/(1-r);fee=charge-net;}
$('charge').textContent=fmt(charge);$('fee').textContent=fmt(fee);$('net').textContent=fmt(net);}
['mode','amt','rate','fixed'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();