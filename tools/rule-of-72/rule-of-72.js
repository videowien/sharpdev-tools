const $=id=>document.getElementById(id);
function f(n){return Number.isFinite(n)&&n>0?(Math.round(n*10)/10):'—';}
function go(){
 const rate=parseFloat($('rate').value);
 if(isFinite(rate)&&rate>0){$('dbl').textContent=f(72/rate);$('tpl').textContent=f(114/rate);$('quad').textContent=f(144/rate);}
 else{['dbl','tpl','quad'].forEach(id=>$(id).textContent='—');}
 const yrs=parseFloat($('yrs').value);
 $('reqrate').textContent=(isFinite(yrs)&&yrs>0)?f(72/yrs)+'%':'—';
}
['rate','yrs'].forEach(id=>$(id).addEventListener('input',go));go();