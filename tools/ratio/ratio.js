const $=id=>document.getElementById(id);
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}
function go(){
  const a=parseFloat($('a').value),b=parseFloat($('b').value),c=$('c').value===''?null:parseFloat($('c').value),d=$('d').value===''?null:parseFloat($('d').value);
  let cards=[];
  if(isFinite(a)&&isFinite(b)){
    if(Number.isInteger(a)&&Number.isInteger(b)){const g=gcd(a,b);cards.push(['Simplified',a/g+' : '+b/g,true]);}
    cards.push(['Decimal',Math.round(a/b*1e6)/1e6+' : 1',false]);
  }
  // solve proportion a:b = c:d
  if(isFinite(a)&&isFinite(b)){
    if(c!==null&&isFinite(c)&&(d===null||!isFinite(d)))cards.push(['D (solved)',Math.round(b*c/a*1e6)/1e6+'',false]);
    else if(d!==null&&isFinite(d)&&(c===null||!isFinite(c)))cards.push(['C (solved)',Math.round(a*d/b*1e6)/1e6+'',false]);
  }
  $('cards').innerHTML=cards.map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('')||'';
}
['a','b','c','d'].forEach(id=>$(id).addEventListener('input',go));
go();