const $=id=>document.getElementById(id);
function go(){const t=+$('target').value,sel=$('matsel').value;
 const s=sel==='custom'?+$('s').value:+sel;
 $('swrap').style.display=sel==='custom'?'':'none';
 if(!(t>0&&s>=0&&s<100)){$('comp').textContent='-';$('scale').textContent='-';return;}
 const f=1/(1-s/100);
 $('comp').textContent=(t*f).toFixed(3)+' mm';
 $('scale').textContent=(f*100).toFixed(3)+'%';}
['target','matsel','s'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();