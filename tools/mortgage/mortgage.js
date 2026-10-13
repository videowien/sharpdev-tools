const $=id=>document.getElementById(id);
function money(n){return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function go(){
 const P=parseFloat($('amt').value)||0,rate=parseFloat($('rate').value)||0,years=parseFloat($('years').value)||0;
 const tax=parseFloat($('tax').value)||0,ins=parseFloat($('ins').value)||0,pmi=parseFloat($('pmi').value)||0;
 if(!(P>0&&years>0)){['total','pi','escrow','totint'].forEach(id=>$(id).textContent='—');return;}
 const r=rate/100/12,n=years*12;
 const pi=r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
 const escrow=(tax+ins+pmi)/12;
 $('pi').textContent=money(pi);$('escrow').textContent=money(escrow);$('total').textContent=money(pi+escrow);
 $('totint').textContent=money(pi*n-P);
}
['amt','rate','years','tax','ins','pmi'].forEach(id=>$(id).addEventListener('input',go));go();