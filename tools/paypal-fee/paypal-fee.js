const $=id=>document.getElementById(id);
function go(){
  const prov=$('provider').value;
  if(prov!=='custom'){const[p,f]=prov.split(',');$('pct').value=p;$('fixed').value=f;}
  const pct=+$('pct').value/100,fixed=+$('fixed').value,amt=+$('amount').value||0,dir=$('dir').value;
  let charge,fee,net;
  if(dir==='net'){charge=amt;fee=amt*pct+fixed;net=amt-fee;}
  else{net=amt;charge=(amt+fixed)/(1-pct);fee=charge-net;}
  const f=n=>(Math.round(n*100)/100).toFixed(2);
  const cards=[['You charge',f(charge),false],['Fee',f(fee),false],[dir==='net'?'You receive':'You receive',f(net),true],['Effective %',(charge?f(fee/charge*100):'0')+'%',false]];
  $('cards').innerHTML=cards.map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');
}
['provider','pct','fixed','amount','dir'].forEach(id=>$(id).addEventListener('input',go));
go();