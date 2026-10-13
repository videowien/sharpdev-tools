const $=id=>document.getElementById(id);
function go(){const L=+$('len').value,W=+$('wid').value,t=+$('thick').value,bag=+$('bag').value;
 if(!(L>0&&W>0&&t>0)){['vol','bags','wt'].forEach(id=>$(id).textContent='—');return;}
 const vol=L*W*(t/100);const yieldPerKg=0.00045;const bags=Math.ceil(vol/(bag*yieldPerKg));
 $('vol').textContent=(Math.round(vol*1000)/1000)+' m³';$('bags').textContent=bags+' × '+bag+'kg';$('wt').textContent=(bags*bag).toLocaleString('en-US')+' kg';}
['len','wid','thick','bag'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();