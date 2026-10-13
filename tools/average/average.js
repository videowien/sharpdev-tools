const numsEl=document.getElementById('nums'),cards=document.getElementById('cards');
function parseNums(t){return (t.match(/-?\d+(\.\d+)?/g)||[]).map(Number);}
function fmt(n){if(!isFinite(n))return '—';return Math.round(n*1e6)/1e6+'';}
function go(){
  const a=parseNums(numsEl.value);
  if(!a.length){cards.innerHTML='<div class="result-card"><div class="label">Enter numbers</div><div class="value">—</div></div>';return;}
  const n=a.length,sum=a.reduce((x,y)=>x+y,0),mean=sum/n;
  const s=[...a].sort((x,y)=>x-y);
  const median=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
  const freq={};let best=0,modes=[];for(const v of a){freq[v]=(freq[v]||0)+1;if(freq[v]>best)best=freq[v];}
  for(const k in freq)if(freq[k]===best)modes.push(k);
  const modeStr=best<=1?'none':modes.join(', ');
  const min=s[0],max=s[n-1];
  const cardsData=[['Mean (average)',fmt(mean),true],['Median',fmt(median),false],['Mode',modeStr,false],['Range',fmt(max-min),false],['Min',fmt(min),false],['Max',fmt(max),false],['Sum',fmt(sum),false],['Count',n+'',false]];
  cards.innerHTML=cardsData.map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');
}
numsEl.addEventListener('input',go);
go();