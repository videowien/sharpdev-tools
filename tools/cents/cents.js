const $=id=>document.getElementById(id);
function go(){const mode=$('mode').value;
 $('frow').style.display=mode==='f2c'?'':'none';
 $('crow').style.display=mode==='c2r'?'':'none';
 if(mode==='f2c'){
  $('olabel').textContent='Interval';$('l2').textContent='Ratio';
  const f1=+$('f1').value,f2=+$('f2').value;
  if(!(f1>0&&f2>0)){$('out').textContent='-';$('out2').textContent='-';return;}
  const cents=1200*Math.log2(f2/f1);
  $('out').textContent=(Math.round(cents*100)/100)+' cents  ('+(Math.round(cents/100*100)/100)+' semitones)';
  $('out2').textContent='x'+(Math.round(f2/f1*100000)/100000);
 }else{
  $('olabel').textContent='Frequency ratio';$('l2').textContent='Example from 440 Hz';
  const c=+$('c').value;
  if(!isFinite(c)){$('out').textContent='-';$('out2').textContent='-';return;}
  const r=Math.pow(2,c/1200);
  $('out').textContent='x'+(Math.round(r*100000)/100000);
  $('out2').textContent='440 Hz → '+(Math.round(440*r*100)/100)+' Hz';}}
['mode','f1','f2','c'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();