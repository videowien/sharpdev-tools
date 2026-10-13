const $=id=>document.getElementById(id);
function go(){
 const sex=$('sex').value,age=+$('age').value,wt=+$('wt').value,ht=+$('ht').value,act=+$('act').value,goal=+$('goal').value;
 if(!(age>0&&wt>0&&ht>0)){['cal','p','c','f'].forEach(id=>$(id).textContent='—');return;}
 const bmr=10*wt+6.25*ht-5*age+(sex==='m'?5:-161);
 const cal=Math.max(0,Math.round(bmr*act+goal));
 const sp=$('split').value.split(',').map(Number);
 $('cal').textContent=cal.toLocaleString('en-US');
 $('p').textContent=Math.round(cal*sp[0]/100/4)+' g';
 $('c').textContent=Math.round(cal*sp[1]/100/4)+' g';
 $('f').textContent=Math.round(cal*sp[2]/100/9)+' g';
}
['sex','age','wt','ht','act','goal','split'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();