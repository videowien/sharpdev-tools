const $=id=>document.getElementById(id);
function go(){const px=+$('px').value,fl=+$('fl').value,w=+$('w').value,h=+$('h').value,see=+$('see').value;
 if(!(px>0&&fl>0)){['scale','fov','samp'].forEach(id=>$(id).textContent='-');return;}
 const s=206.265*px/fl;
 $('scale').textContent=(Math.round(s*1000)/1000)+'″/px';
 if(w>0&&h>0){const fw=w*s/3600,fh=h*s/3600;
  $('fov').textContent=(Math.round(fw*100)/100)+'° x '+(Math.round(fh*100)/100)+'°';}
 else $('fov').textContent='-';
 if(see>0){const lo=see/3,hi=see/2;
  let v;if(s<lo)v='oversampled (finer than '+ (Math.round(lo*100)/100)+'″/px needed)';
  else if(s<=hi)v='well sampled for '+see+'″ seeing';
  else if(s<=see)v='slightly undersampled, fine for widefield';
  else v='undersampled (coarser than the seeing)';
  $('samp').textContent=v;}
 else $('samp').textContent='-';}
['px','fl','w','h','see'].forEach(id=>$(id).addEventListener('input',go));go();