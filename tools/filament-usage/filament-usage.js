const $=id=>document.getElementById(id);
const DENS={pla:1.24,petg:1.27,abs:1.04,asa:1.07,tpu:1.21,nylon:1.14,pc:1.20};
function gpm(){const d=+$('dia').value/20;const sel=$('mat').value;
 const rho=sel==='custom'?+$('rho').value:DENS[sel];
 $('rhowrap').style.display=sel==='custom'?'':'none';
 if(!(d>0&&rho>0))return 0;
 return Math.PI*d*d*100*rho;}
function go(){const gm=gpm();const mode=$('mode').value,v=+$('val').value;
 $('vlabel').textContent=mode==='w2l'?'Weight (g)':'Length (m)';
 $('olabel').textContent=mode==='w2l'?'Length':'Weight';
 if(!(gm>0&&v>0)){$('out').textContent='-';$('rate').textContent='-';return;}
 $('rate').textContent=gm.toFixed(3)+' g/m  ('+(1000/gm).toFixed(1)+' m/kg)';
 if(mode==='w2l')$('out').textContent=(v/gm).toFixed(2)+' m';
 else $('out').textContent=(v*gm).toFixed(1)+' g';}
['mat','rho','dia','mode','val'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();