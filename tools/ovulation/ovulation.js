const $=id=>document.getElementById(id);
const DAY=86400000;
function shortD(d){return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});}
function longD(d){return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});}
function go(){
 const v=$('last').value,cyc=+$('cyc').value;
 if(!v||!(cyc>=20)){$('ovu').textContent='—';$('fert').textContent='—';$('next').textContent='—';$('future').value='';return;}
 const start=new Date(v+'T00:00:00');if(isNaN(start)){return;}
 const next=new Date(start.getTime()+cyc*DAY),ovu=new Date(next.getTime()-14*DAY);
 const fa=new Date(ovu.getTime()-5*DAY),fb=new Date(ovu.getTime()+DAY);
 $('ovu').textContent=longD(ovu);
 $('fert').textContent=shortD(fa)+' to '+shortD(fb);
 $('next').textContent=longD(next);
 const lines=[];let s=start;
 for(let i=1;i<=3;i++){const np=new Date(s.getTime()+cyc*DAY),ov=new Date(np.getTime()-14*DAY);lines.push('Cycle '+i+': period '+shortD(np)+', ovulation '+shortD(ov));s=np;}
 $('future').value=lines.join('\n');
}
(function(){const t=new Date();$('last').value=t.toISOString().slice(0,10);})();
['last','cyc'].forEach(id=>$(id).addEventListener('input',go));go();