const $=id=>document.getElementById(id);
function go(){const L=+$('len').value,W=+$('wid').value,H=+$('hgt').value,coats=+$('coats').value||1,cov=+$('cov').value||10,op=+$('open').value||0;
 if(!(L>0&&W>0&&H>0)){['area','litres','gal'].forEach(id=>$(id).textContent='—');return;}
 const area=Math.max(0,2*(L+W)*H-op*2);const litres=area*coats/cov;
 $('area').textContent=(Math.round(area*10)/10)+' m²';$('litres').textContent=(Math.round(litres*10)/10)+' L';$('gal').textContent=(Math.round(litres*0.264172*10)/10)+' gal';}
['len','wid','hgt','coats','cov','open'].forEach(id=>$(id).addEventListener('input',go));go();