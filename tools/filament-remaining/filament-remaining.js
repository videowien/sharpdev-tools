const $=id=>document.getElementById(id);
const DENS={pla:1.24,petg:1.27,abs:1.04,asa:1.07,tpu:1.21,nylon:1.14,pc:1.20};
function gpm(){const d=+$('dia').value/20;const sel=$('mat').value;
 const rho=sel==='custom'?+$('rho').value:DENS[sel];
 $('rhowrap').style.display=sel==='custom'?'':'none';
 if(!(d>0&&rho>0))return 0;
 return Math.PI*d*d*100*rho;}
function go(){const gross=+$('gross').value,tare=+$('tare').value,need=+$('need').value;const gm=gpm();
 const net=gross-tare;
 if(!(gross>0&&tare>=0&&net>=0)){['left','len','fits'].forEach(id=>$(id).textContent='-');return;}
 $('left').textContent=net.toFixed(0)+' g';
 $('len').textContent=gm>0?(net/gm).toFixed(1)+' m':'-';
 if(need>0){const ok=net>=need;$('fits').textContent=ok?('fits ('+(net-need).toFixed(0)+' g spare)'):('needs '+(need-net).toFixed(0)+' g more');$('fits').style.color=ok?'#2e7d32':'#c62828';}
 else{$('fits').textContent='-';$('fits').style.color='';}}
['gross','tare','mat','rho','dia','need'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();