const $=id=>document.getElementById(id);
function go(){const a=+$('a').value,b=+$('b').value,c=+$('c').value,f=n=>(+(n.toFixed(6))).toString();
if(!(a>0&&b>0&&c>0)){$('cards').innerHTML='<div class="result-card"><div class="label">Enter 3 sides</div><div class="value">—</div></div>';return;}
if(a+b<=c||a+c<=b||b+c<=a){$('cards').innerHTML='<div class="result-card hl"><div class="label">Invalid</div><div class="value" style="font-size:15px">These sides cannot form a triangle</div></div>';return;}
const p=a+b+c,s=p/2,area=Math.sqrt(s*(s-a)*(s-b)*(s-c));
let type=(a===b&&b===c)?'Equilateral':(a===b||b===c||a===c)?'Isosceles':'Scalene';
const sides=[a,b,c].sort((x,y)=>x-y);const right=Math.abs(sides[0]**2+sides[1]**2-sides[2]**2)<1e-9?'Yes':'No';
const cards=[['Area',f(area),true],['Perimeter',f(p),false],['Type',type,false],['Right triangle',right,false]];
$('cards').innerHTML=cards.map(([l,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');}
['a','b','c'].forEach(id=>$(id).addEventListener('input',go));go();