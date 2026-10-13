const $=id=>document.getElementById(id);
function go(){const fl=+$('fl').value,ep=+$('ep').value,af=+$('afov').value;
 if(!(fl>0&&ep>0&&af>0)){['tfov','mag','moon'].forEach(id=>$(id).textContent='-');return;}
 const m=fl/ep;const t=af/m;
 $('mag').textContent=(Math.round(m*10)/10)+'x';
 $('tfov').textContent=(Math.round(t*1000)/1000)+'°  ('+(Math.round(t*60*10)/10)+'′)';
 $('moon').textContent=(Math.round(t/0.52*10)/10)+' full Moons (0.52° each)';}
['fl','ep','afov'].forEach(id=>$(id).addEventListener('input',go));go();