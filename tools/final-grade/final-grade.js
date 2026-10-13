const $=id=>document.getElementById(id);
function go(){const cur=+$('cur').value,want=+$('want').value,wt=+$('wt').value;const note=$('note');
 if(!(wt>0&&wt<=100)){$('need').textContent='—';note.textContent='Enter the final exam weight as a percentage between 0 and 100.';return;}
 const w=wt/100;const need=(want-cur*(1-w))/w;
 $('need').textContent=(Math.round(need*100)/100)+'%';
 if(need>100)note.textContent='That target is not reachable with this final alone, even with a perfect score. You would need '+(Math.round(need*10)/10)+'%. Aim a little lower, or check the weight.';
 else if(need<=0)note.textContent='You have already secured your target. Even a zero on the final keeps you at or above '+want+'%.';
 else note.textContent='Score at least '+(Math.round(need*10)/10)+'% on the final (worth '+wt+'%) to finish with '+want+'% overall.';}
['cur','want','wt'].forEach(id=>$(id).addEventListener('input',go));go();