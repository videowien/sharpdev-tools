const $=id=>document.getElementById(id);
function go(){
 const w=+$('wt').value,r=+$('reps').value;
 if(!(w>0&&r>0)){$('orm').textContent='—';$('epley').textContent='—';$('brzycki').textContent='—';$('table').innerHTML='';return;}
 const epley=w*(1+r/30);
 const brzycki=r<37?w*36/(37-r):epley;
 const orm=(epley+brzycki)/2;
 const f=n=>Math.round(n*10)/10;
 $('orm').textContent=f(orm);$('epley').textContent=f(epley);$('brzycki').textContent=f(brzycki);
 const pct=[100,95,90,85,80,75,70,65,60];const repsAt={100:1,95:2,90:4,85:6,80:8,75:10,70:12,65:16,60:20};
 let html='<div class="cell h">% of 1RM</div><div class="cell h">Weight</div><div class="cell h">approx reps</div>';
 pct.forEach(function(p){html+='<div class="cell">'+p+'%</div><div class="cell">'+f(orm*p/100)+'</div><div class="cell">'+repsAt[p]+'</div>';});
 $('table').innerHTML=html;
}
['wt','reps'].forEach(id=>$(id).addEventListener('input',go));go();