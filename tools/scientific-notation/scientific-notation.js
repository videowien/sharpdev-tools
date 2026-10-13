const $=id=>document.getElementById(id);
function parseNum(s){
  s=s.trim().replace(/\s/g,'').replace(/[x×]10\^?/i,'e').replace(/\^/,'');
  const v=Number(s);return isFinite(v)?v:NaN;
}
function sci(n){
  if(n===0)return '0 × 10^0';
  const exp=Math.floor(Math.log10(Math.abs(n)));
  const mant=n/Math.pow(10,exp);
  return (Math.round(mant*1e6)/1e6)+' × 10^'+exp;
}
function eng(n){
  if(n===0)return '0e0';
  let exp=Math.floor(Math.log10(Math.abs(n)));
  exp=Math.floor(exp/3)*3;
  const mant=n/Math.pow(10,exp);
  return (Math.round(mant*1e6)/1e6)+'e'+exp;
}
function go(){
  const n=parseNum($('in').value);
  if(!isFinite(n)){$('cards').innerHTML='<div class="result-card"><div class="label">Enter a number</div><div class="value">—</div></div>';return;}
  const cards=[['Scientific',sci(n),true],['E-notation',n.toExponential(6).replace(/(\.\d*?)0+e/,'$1e').replace(/\.e/,'e'),false],['Engineering',eng(n),false],['Decimal',(''+n),false]];
  $('cards').innerHTML=cards.map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value" style="font-size:16px">${v}</div></div>`).join('');
}
$('in').addEventListener('input',go);
go();