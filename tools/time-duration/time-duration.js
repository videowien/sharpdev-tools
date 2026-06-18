const $=id=>document.getElementById(id);
function go(){
  if(!$('start').value||!$('end').value)return;
  let a=new Date($('start').value),b=new Date($('end').value);
  let ms=b-a;const neg=ms<0;ms=Math.abs(ms);
  const sec=Math.floor(ms/1000),min=Math.floor(sec/60),hr=Math.floor(min/60),day=Math.floor(hr/24);
  const d=day,h=hr%24,m=min%60,s=sec%60;
  const breakdown=(neg?'-':'')+d+'d '+h+'h '+m+'m '+s+'s';
  const cards=[['Duration',breakdown,true],['Total days',(Math.round(ms/86400000*100)/100)+'',false],['Total hours',Math.round(ms/3600000*100)/100+'',false],['Total minutes',min.toLocaleString(),false],['Total seconds',sec.toLocaleString(),false],['Weeks + days',Math.floor(d/7)+'w '+(d%7)+'d',false]];
  $('cards').innerHTML=cards.map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value" style="font-size:17px">${v}</div></div>`).join('');
}
['start','end'].forEach(id=>$(id).addEventListener('input',go));
const now=new Date();now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
$('start').value=now.toISOString().slice(0,16);
const later=new Date(now.getTime()+1000*60*60*26);$('end').value=later.toISOString().slice(0,16);
go();