const $=id=>document.getElementById(id);
function f(n){return isFinite(n)?(+(n.toFixed(6))).toString():'—';}
function go(){const a=($('in').value.match(/-?\d+(\.\d+)?/g)||[]).map(Number);
if(a.length<2){$('cards').innerHTML='<div class="result-card"><div class="label">Enter 2+ numbers</div><div class="value">—</div></div>';return;}
const n=a.length,mean=a.reduce((x,y)=>x+y,0)/n;
const sq=a.reduce((s,x)=>s+(x-mean)**2,0);
const popVar=sq/n,sampVar=sq/(n-1);
const cards=[['Sample SD',f(Math.sqrt(sampVar)),true],['Population SD',f(Math.sqrt(popVar)),false],['Mean',f(mean),false],['Sample variance',f(sampVar),false],['Population variance',f(popVar),false],['Count',n,false]];
$('cards').innerHTML=cards.map(([l,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');}
$('in').addEventListener('input',go);go();