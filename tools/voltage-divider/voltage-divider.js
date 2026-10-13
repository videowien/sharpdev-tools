const $=id=>document.getElementById(id);
function go(){const vin=+$('vin').value,r1=+$('r1').value,r2=+$('r2').value;
 if(!(r1>=0&&r2>0&&(r1+r2)>0)){['vout','cur','pwr'].forEach(id=>$(id).textContent='—');return;}
 const vout=vin*r2/(r1+r2);const i=vin/(r1+r2);const p=vin*i;
 $('vout').textContent=(Math.round(vout*1000)/1000)+' V';$('cur').textContent=(Math.round(i*1e6)/1e3)+' mA';$('pwr').textContent=(Math.round(p*1e6)/1e3)+' mW';}
['vin','r1','r2'].forEach(id=>$(id).addEventListener('input',go));go();