const $=id=>document.getElementById(id);
const NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
function go(){const mode=$('mode').value,ref=+$('ref').value;
 $('noterow').style.display=mode==='n2f'?'':'none';
 $('freqrow').style.display=mode==='f2n'?'':'none';
 $('olabel').textContent=mode==='n2f'?'Frequency':'Nearest note';
 if(!(ref>0)){$('out').textContent='-';$('midi').textContent='-';return;}
 if(mode==='n2f'){
  const midi=(+$('oct').value+1)*12+NAMES.indexOf($('note').value);
  const f=ref*Math.pow(2,(midi-69)/12);
  $('out').textContent=(Math.round(f*10000)/10000)+' Hz';
  $('midi').textContent=midi;
 }else{
  const f=+$('freq').value;
  if(!(f>0)){$('out').textContent='-';$('midi').textContent='-';return;}
  const m=69+12*Math.log2(f/ref);
  const midi=Math.round(m);
  const cents=(m-midi)*100;
  const name=NAMES[((midi%12)+12)%12]+(Math.floor(midi/12)-1);
  $('out').textContent=name+'  ('+(cents>=0?'+':'')+(Math.round(cents*10)/10)+' cents)';
  $('midi').textContent=midi;}}
['mode','ref','note','oct','freq'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();