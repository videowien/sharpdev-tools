const $=id=>document.getElementById(id);
function f(n){return (Math.round(n*10)/10)+' kg';}
function go(){
 const sex=$('sex').value,cm=+$('ht').value;const note=$('bminote');
 if(!(cm>0)){['devine','robinson','miller','hamwi'].forEach(id=>$(id).textContent='—');note.textContent='';return;}
 const over=Math.max(0,cm/2.54-60);const male=sex==='m';
 $('devine').textContent=f((male?50:45.5)+2.3*over);
 $('robinson').textContent=f((male?52:49)+(male?1.9:1.7)*over);
 $('miller').textContent=f((male?56.2:53.1)+(male?1.41:1.36)*over);
 $('hamwi').textContent=f((male?48:45.5)+(male?2.7:2.2)*over);
 const m=cm/100;
 note.textContent='A healthy BMI of 18.5 to 24.9 for this height is roughly '+Math.round(18.5*m*m)+' to '+Math.round(24.9*m*m)+' kg. The four formulas are classic clinical estimates and differ slightly, so treat the result as a range rather than a single target. They do not account for muscle mass or frame size.';
}
['sex','ht'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();