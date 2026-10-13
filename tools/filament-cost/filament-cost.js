const $=id=>document.getElementById(id);
function go(){const g=+$('g').value,sp=+$('spool').value,h=+$('h').value,w=+$('w').value,kwh=+$('kwh').value,fail=Math.max(0,+$('fail').value||0);
 if(!(g>=0&&sp>=0)){['tot','matc','elec'].forEach(id=>$(id).textContent='-');return;}
 const mat=g/1000*sp;const el=(w>0&&h>0&&kwh>0)?w/1000*h*kwh:0;
 const tot=(mat+el)*(1+fail/100);
 $('matc').textContent=mat.toFixed(2);$('elec').textContent=el.toFixed(2);$('tot').textContent=tot.toFixed(2);}
['g','spool','h','w','kwh','fail'].forEach(id=>$(id).addEventListener('input',go));go();