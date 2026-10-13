const $=id=>document.getElementById(id);
const MS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmt(d){return MS[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();}
(function(){$('date').value=new Date().toISOString().slice(0,10);})();
function go(){const v=$('date').value;if(!v)return;const d=new Date(v+'T00:00:00');const fy=+$('fy').value;const m=d.getMonth()+1;
 const monthsIn=((m-fy)+12)%12;const q=Math.floor(monthsIn/3)+1;
 const qStartMonth0=((fy-1)+ (q-1)*3)%12;let qStartYear=d.getFullYear();if((d.getMonth())<qStartMonth0)qStartYear--;
 const start=new Date(qStartYear,qStartMonth0,1);const end=new Date(qStartYear,qStartMonth0+3,0);
 const DAY=86400000;const dayOf=Math.floor((d-start)/DAY)+1;const total=Math.round((end-start)/DAY)+1;
 $('q').textContent='Q'+q;$('range').textContent=fmt(start)+' to '+fmt(end);$('dayof').textContent=dayOf+' of '+total;$('left').textContent=(total-dayOf)+' days';}
['date','fy'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();