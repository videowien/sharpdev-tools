const $=id=>document.getElementById(id);
function parse(s){s=s.trim();if(/^0x/i.test(s))return parseInt(s,16);if(/^0b/i.test(s))return parseInt(s.slice(2),2);return parseInt(s,10);}
function go(){const a=parse($('a').value),b=parse($('b').value),op=$('op').value;
if(!isFinite(a)||(op!=='not'&&!isFinite(b))){$('cards').innerHTML='<div class="result-card"><div class="label">Enter integers</div><div class="value">—</div></div>';return;}
let r;if(op==='and')r=a&b;else if(op==='or')r=a|b;else if(op==='xor')r=a^b;else if(op==='not')r=~a;else if(op==='shl')r=a<<b;else r=a>>b;
const u=r>>>0;
$('cards').innerHTML=[['Decimal',r,true],['Hex','0x'+u.toString(16).toUpperCase(),false],['Binary',u.toString(2),false],['Unsigned 32-bit',u,false]].map(([l,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value" style="font-size:15px;word-break:break-all">${v}</div></div>`).join('');}
['a','b','op'].forEach(id=>$(id).addEventListener('input',go));go();