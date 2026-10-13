const $=id=>document.getElementById(id);
const SENS={ff:[36,24],apsc:[23.5,15.6],canon:[22.3,14.9],mft:[17.3,13.0],one:[13.2,8.8]};
const deg=r=>r*180/Math.PI;
function go(){const f=+$('f').value,sz=SENS[$('sensor').value],D=+$('d').value;
 if(!(f>0)){['h','v','dg','fw'].forEach(id=>$(id).textContent='-');return;}
 const w=sz[0],ht=sz[1],dd=Math.sqrt(w*w+ht*ht);
 const ah=2*Math.atan(w/(2*f)),av=2*Math.atan(ht/(2*f)),ad=2*Math.atan(dd/(2*f));
 $('h').textContent=(Math.round(deg(ah)*10)/10)+'°';
 $('v').textContent=(Math.round(deg(av)*10)/10)+'°';
 $('dg').textContent=(Math.round(deg(ad)*10)/10)+'°';
 if(D>0){const fw=2*D*Math.tan(ah/2);$('fw').textContent=(Math.round(fw*100)/100)+' m wide';}else $('fw').textContent='-';}
['f','sensor','d'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();