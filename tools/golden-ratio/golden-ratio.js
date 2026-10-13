const $=id=>document.getElementById(id);
const PHI=(1+Math.sqrt(5))/2;
function f(n){return Math.round(n*1000)/1000;}
function go(){const v=parseFloat($('val').value);const mode=$('mode').value;if(!isFinite(v)||v<=0){['whole','long','short'].forEach(id=>$(id).textContent='—');return;}
 let whole,long,short;
 if(mode==='whole'){whole=v;long=v/PHI;short=v-long;}
 else if(mode==='long'){long=v;short=v/PHI;whole=long+short;}
 else{short=v;long=v*PHI;whole=long+short;}
 $('whole').textContent=f(whole);$('long').textContent=f(long);$('short').textContent=f(short);
 $('bl').style.width=(long/whole*100)+'%';$('bs').style.width=(short/whole*100)+'%';}
['mode','val'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();