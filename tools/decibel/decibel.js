const $=id=>document.getElementById(id);
function go(){const k=+$('type').value,dir=$('dir').value,v=parseFloat($('val').value);
 $('inlabel').textContent=dir==='r2d'?'Ratio (out / in)':'Decibels (dB)';
 $('outlabel').textContent=dir==='r2d'?'Decibels':'Ratio';
 if(!isFinite(v)){$('out').textContent='—';return;}
 if(dir==='r2d'){if(v<=0){$('out').textContent='ratio must be > 0';return;}$('out').textContent=(Math.round(k*Math.log10(v)*1000)/1000)+' dB';}
 else{$('out').textContent='×'+(Math.round(Math.pow(10,v/k)*1000)/1000);}}
['type','dir','val'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();