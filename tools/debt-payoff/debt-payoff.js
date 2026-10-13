const $=id=>document.getElementById(id);
function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
function parse(){return $('debts').value.split('\n').map(function(l){const p=l.split(',');if(p.length<4)return null;const bal=parseFloat(p[1]),apr=parseFloat(p[2]),min=parseFloat(p[3]);if(!(bal>0))return null;return {name:(p[0]||'Debt').trim(),bal:bal,apr:apr||0,min:min||0};}).filter(Boolean);}
function go(){
 const debts=parse();const budget=parseFloat($('budget').value)||0;const strat=$('strat').value;const warn=$('warn');
 if(!debts.length){['time','int','paid'].forEach(id=>$(id).textContent='—');$('order').value='';warn.style.display='none';return;}
 const minSum=debts.reduce((a,d)=>a+d.min,0);
 if(budget<minSum){warn.style.display='block';warn.textContent='Your monthly payment ('+money(budget)+') is less than the sum of minimum payments ('+money(minSum)+'). Increase it to make progress.';['time','int','paid'].forEach(id=>$(id).textContent='—');$('order').value='';return;}
 warn.style.display='none';
 let ds=debts.map(d=>({name:d.name,bal:d.bal,apr:d.apr,min:d.min,done:false}));
 let month=0,totalInt=0,totalPaid=0;const order=[];
 while(ds.some(d=>d.bal>0.005)&&month<600){
  month++;
  ds.forEach(d=>{if(d.bal>0){const i=d.bal*(d.apr/100/12);d.bal+=i;totalInt+=i;}});
  let pool=budget;
  ds.forEach(d=>{if(d.bal>0){const pay=Math.min(d.min,d.bal,pool);d.bal-=pay;pool-=pay;totalPaid+=pay;}});
  const active=ds.filter(d=>d.bal>0.005);
  active.sort(strat==='avalanche'?(a,b)=>b.apr-a.apr:(a,b)=>a.bal-b.bal);
  for(const d of active){if(pool<=0.005)break;const pay=Math.min(pool,d.bal);d.bal-=pay;pool-=pay;totalPaid+=pay;}
  ds.forEach(d=>{if(d.bal<=0.005&&!d.done){d.done=true;order.push(d.name+' — paid off in month '+month);}});
 }
 if(month>=600){$('time').textContent='Over 50 years';warn.style.display='block';warn.textContent='At this payment the debts barely shrink. Increase the monthly amount to clear them in a reasonable time.';}
 else{const y=Math.floor(month/12),mo=month%12;$('time').textContent=(y?y+'y ':'')+mo+'mo';}
 $('int').textContent=money(totalInt);$('paid').textContent=money(totalPaid);$('order').value=order.join('\n');
}
['debts','budget','strat'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();