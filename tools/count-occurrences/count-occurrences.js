const $=id=>document.getElementById(id);
function go(){const text=$('in').value,term=$('term').value;
const words=(text.match(/\S+/g)||[]).length;
if(!term){$('cards').innerHTML=`<div class="result-card hl"><div class="label">Occurrences</div><div class="value">0</div></div><div class="result-card"><div class="label">Total words</div><div class="value">${words}</div></div>`;return;}
const esc=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const pat=$('whole').checked?('\\b'+esc+'\\b'):esc;
let n=0;try{n=(text.match(new RegExp(pat,$('ci').checked?'gi':'g'))||[]).length;}catch(e){}
const pct=words?Math.round(n/words*1000)/10:0;
$('cards').innerHTML=[['Occurrences',n,true],['Total words',words,false],['% of words',pct+'%',false]].map(([l,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');}
['in','term','ci','whole'].forEach(id=>$(id).addEventListener('input',go));go();