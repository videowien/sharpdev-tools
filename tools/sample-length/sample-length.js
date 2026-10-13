const $=id=>document.getElementById(id);
function go(){const bars=+$('bars').value,bpm=+$('bpm').value,sig=+$('sig').value,sr=+$('sr').value,bits=+$('bits').value,ch=+$('ch').value;
 if(!(bars>0&&bpm>0&&sig>0)){['dur','smp','size'].forEach(id=>$(id).textContent='-');return;}
 const sec=bars*sig*60/bpm;
 $('dur').textContent=sec>=60?(Math.floor(sec/60)+' min '+(Math.round((sec%60)*100)/100)+' s'):((Math.round(sec*1000)/1000)+' s');
 const smp=Math.round(sec*sr);
 $('smp').textContent=smp.toLocaleString('en-US');
 const bytes=smp*ch*bits/8;
 $('size').textContent=bytes>=1048576?((Math.round(bytes/1048576*100)/100)+' MB'):(Math.round(bytes/1024)+' KB');}
['bars','bpm','sig','sr','bits','ch'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();