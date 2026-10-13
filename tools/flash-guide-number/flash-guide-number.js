const $=id=>document.getElementById(id);
function go(){const gn=+$('gn').value,iso=+$('iso').value,mode=$('mode').value,v=+$('val').value;
 $('inlabel').textContent=mode==='dist'?'Aperture f/':'Distance (m)';
 $('outlabel').textContent=mode==='dist'?'Subject distance':'Aperture';
 if(!(gn>0&&iso>0&&v>0)){$('out').textContent='-';$('gniso').textContent='-';return;}
 const gnIso=gn*Math.sqrt(iso/100);
 $('gniso').textContent=(Math.round(gnIso*10)/10)+' m';
 if(mode==='dist')$('out').textContent=(Math.round(gnIso/v*100)/100)+' m';
 else $('out').textContent='f/'+(Math.round(gnIso/v*10)/10);}
['gn','iso','mode','val'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();