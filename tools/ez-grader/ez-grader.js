const $=id=>document.getElementById(id);
function letter(p){return p>=90?'A':p>=80?'B':p>=70?'C':p>=60?'D':'F';}
function go(){const total=+$('total').value,wrong=Math.max(0,+$('wrong').value||0);
 if(!(total>0)){['pct','grade','right'].forEach(id=>$(id).textContent='—');return;}
 const right=Math.max(0,total-wrong);const pct=right/total*100;
 $('pct').textContent=(Math.round(pct*100)/100)+'%';$('grade').textContent=letter(pct);$('right').textContent=right+' / '+total;}
['total','wrong'].forEach(id=>$(id).addEventListener('input',go));go();