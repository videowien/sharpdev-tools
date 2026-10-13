const $=id=>document.getElementById(id);
function money(n){return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function go(){
 const bal=parseFloat($('bal').value)||0,apr=parseFloat($('apr').value)||0,mode=$('mode').value,v=parseFloat($('input').value)||0;
 const r=apr/100/12;const warn=$('warn');warn.style.display='none';
 $('inlabel').textContent=mode==='months'?'Monthly payment':'Target months';
 $('r1label').textContent=mode==='months'?'Time to pay off':'Required payment';
 if(bal<=0){['r1','int','paid'].forEach(id=>$(id).textContent='—');return;}
 if(mode==='months'){
  const pay=v;const firstInt=bal*r;
  if(pay<=firstInt){warn.style.display='block';warn.textContent='A payment of '+money(pay)+' does not even cover the first month of interest ('+money(firstInt)+'), so the balance never goes down. Pay more than that.';['r1','int','paid'].forEach(id=>$(id).textContent='—');return;}
  let b=bal,months=0,paid=0;while(b>0.005&&months<1200){const i=b*r;b+=i;const p=Math.min(pay,b);b-=p;paid+=p;months++;}
  const y=Math.floor(months/12),mo=months%12;$('r1').textContent=(y?y+'y ':'')+mo+'mo';$('int').textContent=money(paid-bal);$('paid').textContent=money(paid);
 } else {
  const n=Math.max(1,Math.round(v));let pay;
  if(r===0)pay=bal/n;else pay=bal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  const paid=pay*n;$('r1').textContent=money(pay)+'/mo';$('int').textContent=money(paid-bal);$('paid').textContent=money(paid);
 }
}
['bal','apr','mode','input'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();