const $=id=>document.getElementById(id);
function go(){const fl=+$('fl').value,ep=+$('ep').value,b=+$('barlow').value,ap=+$('ap').value;
 if(!(fl>0&&ep>0&&b>0)){['mag','xp','range'].forEach(id=>$(id).textContent='-');return;}
 const m=fl/ep*b;
 $('mag').textContent=(Math.round(m*10)/10)+'x';
 if(ap>0){
  $('xp').textContent=(Math.round(ap/m*100)/100)+' mm';
  $('range').textContent='~'+Math.round(ap/7)+'x to ~'+Math.round(2*ap)+'x for '+ap+' mm';
 }else{$('xp').textContent='-';$('range').textContent='-';}}
['fl','ep','barlow','ap'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();