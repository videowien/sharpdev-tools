const $=id=>document.getElementById(id);
function go(){const parts=$('ip').value.trim().split('.');
if(parts.length!==4||parts.some(p=>!/^\d+$/.test(p)||+p>255)){$('cards').innerHTML='<div class="result-card"><div class="label">Enter valid IPv4</div><div class="value">—</div></div>';return;}
const oct=parts.map(Number);
const bin=oct.map(o=>o.toString(2).padStart(8,'0'));
const int=oct.reduce((a,o)=>a*256+o,0);
const hex='0x'+oct.map(o=>o.toString(16).padStart(2,'0')).join('').toUpperCase();
$('cards').innerHTML=[['Binary (dotted)',bin.join('.'),true],['32-bit integer',int.toLocaleString(),false],['Hex',hex,false],['Binary (solid)',bin.join(''),false]].map(([l,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value" style="font-size:14px;word-break:break-all">${v}</div></div>`).join('');}
function rev(){const v=$('int').value.trim();if(!/^\d+$/.test(v)){$('rev').style.display='none';return;}let n=Number(v);if(n>4294967295){$('rev').style.display='block';$('rev').textContent='Out of IPv4 range.';return;}
const ip=[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.');$('rev').style.display='block';$('rev').textContent=v+' → '+ip;}
$('ip').addEventListener('input',go);$('int').addEventListener('input',rev);go();