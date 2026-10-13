const $=id=>document.getElementById(id);
function go(){const iv=+$('iv').value,durS=(+$('dur').value)*60,fps=+$('fps').value,mb=+$('mb').value;
 if(!(iv>0&&durS>0&&fps>0)){['frames','clip','store'].forEach(id=>$(id).textContent='-');return;}
 const frames=Math.floor(durS/iv),clip=frames/fps;
 $('frames').textContent=frames.toLocaleString('en-US');
 $('clip').textContent=clip>=60?(Math.floor(clip/60)+' min '+Math.round(clip%60)+' s'):((Math.round(clip*10)/10)+' s');
 if(mb>0){const tot=frames*mb;$('store').textContent=tot>=1024?((Math.round(tot/1024*100)/100)+' GB'):(Math.round(tot)+' MB');}else $('store').textContent='-';}
['iv','dur','fps','mb'].forEach(id=>$(id).addEventListener('input',go));go();