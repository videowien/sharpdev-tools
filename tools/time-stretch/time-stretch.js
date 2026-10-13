const $=id=>document.getElementById(id);
function go(){const a=+$('from').value,b=+$('to').value,len=+$('len').value;
 if(!(a>0&&b>0)){['ratio','st','nlen'].forEach(id=>$(id).textContent='-');return;}
 const r=b/a;const st=12*Math.log2(r);
 $('ratio').textContent='x'+(Math.round(r*10000)/10000)+'  ('+(r>=1?'+':'')+(Math.round((r-1)*1000)/10)+'%)';
 $('st').textContent=(st>=0?'+':'')+(Math.round(st*100)/100)+' semitones';
 if(len>0){const nl=len/r;$('nlen').textContent=Math.floor(nl/60)+' min '+(Math.round(nl%60*10)/10)+' s';}
 else $('nlen').textContent='-';}
['from','to','len'].forEach(id=>$(id).addEventListener('input',go));go();