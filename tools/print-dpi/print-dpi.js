const $=id=>document.getElementById(id);
function go(){const mode=$('mode').value,dpi=+$('dpi').value;
 $('pxrow').style.display=mode==='px2size'?'':'none';
 $('sizerow').style.display=mode==='size2px'?'':'none';
 if(mode==='px2size'){
  $('lbl1').textContent='Print size (inches)';$('lbl2').textContent='Print size (cm)';$('lbl3').textContent='Megapixels';
  const w=+$('pw').value,h=+$('ph').value;
  if(!(w>0&&h>0&&dpi>0)){['r1','r2','r3'].forEach(id=>$(id).textContent='-');return;}
  const wi=w/dpi,hi=h/dpi;
  $('r1').textContent=(Math.round(wi*100)/100)+' x '+(Math.round(hi*100)/100)+' in';
  $('r2').textContent=(Math.round(wi*2.54*10)/10)+' x '+(Math.round(hi*2.54*10)/10)+' cm';
  $('r3').textContent=(Math.round(w*h/1e6*10)/10)+' MP';
 }else{
  $('lbl1').textContent='Required pixels';$('lbl2').textContent='Megapixels';$('lbl3').textContent='Print size (cm)';
  const wi=+$('sw').value,hi=+$('sh').value;
  if(!(wi>0&&hi>0&&dpi>0)){['r1','r2','r3'].forEach(id=>$(id).textContent='-');return;}
  const w=Math.round(wi*dpi),h=Math.round(hi*dpi);
  $('r1').textContent=w.toLocaleString('en-US')+' x '+h.toLocaleString('en-US')+' px';
  $('r2').textContent=(Math.round(w*h/1e6*10)/10)+' MP';
  $('r3').textContent=(Math.round(wi*2.54*10)/10)+' x '+(Math.round(hi*2.54*10)/10)+' cm';}}
['mode','dpi','pw','ph','sw','sh'].forEach(id=>{const e=$(id);if(e){e.addEventListener('input',go);e.addEventListener('change',go);}});go();