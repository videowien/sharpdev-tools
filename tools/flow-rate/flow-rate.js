const $=id=>document.getElementById(id);
function go(){const cur=+$('cur').value,exp=+$('exp').value,meas=+$('meas').value;
 if(!(cur>0&&exp>0&&meas>0)){$('new').textContent='-';$('dev').textContent='-';return;}
 const nf=cur*exp/meas;const dev=(meas-exp)/exp*100;
 $('new').textContent=nf.toFixed(2)+'%  ('+(nf/100).toFixed(3)+')';
 $('dev').textContent=(dev>0?'+':'')+dev.toFixed(1)+'% ('+(dev>0?'over':'under')+'-extruding)';}
['cur','exp','meas'].forEach(id=>$(id).addEventListener('input',go));go();