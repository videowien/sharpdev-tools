const $=id=>document.getElementById(id);
function go(){
  const fixed=+$('fixed').value||0,price=+$('price').value||0,vc=+$('var').value||0;
  const cm=price-vc;
  const f=n=>(Math.round(n*100)/100).toLocaleString();
  let cards;
  if(cm<=0){cards=[['Contribution margin',f(cm),false],['Break-even','never',true],['Note','price must exceed variable cost',false]];}
  else{
    const units=fixed/cm;
    cards=[['Contribution margin / unit',f(cm),false],['Break-even units',Math.ceil(units).toLocaleString(),true],['Break-even revenue',f(Math.ceil(units)*price),false],['Margin ratio',Math.round(cm/price*1000)/10+'%',false]];
  }
  $('cards').innerHTML=cards.map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value" style="font-size:18px">${v}</div></div>`).join('');
}
['fixed','price','var'].forEach(id=>$(id).addEventListener('input',go));
go();