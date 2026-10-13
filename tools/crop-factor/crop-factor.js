const $=id=>document.getElementById(id);
const CF={ff:1,apsc:1.5,canon:1.6,mft:2.0,one:2.7};
function go(){const f=+$('f').value,sel=$('sensor').value;let cf=sel==='custom'?+$('cf').value:CF[sel];
 $('cfwrap').style.display=sel==='custom'?'':'none';
 const N=parseFloat($('N').value);
 if(!(f>0&&cf>0)){$('eq').textContent='-';$('aper').textContent='-';return;}
 $('eq').textContent=(Math.round(f*cf*10)/10)+' mm';
 if(isFinite(N)&&N>0)$('aper').textContent='f/'+(Math.round(N*cf*10)/10);else $('aper').textContent='-';}
['f','sensor','cf','N'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();