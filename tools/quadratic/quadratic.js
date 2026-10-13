const $=id=>document.getElementById(id);function f(n){return(+(n.toFixed(5))).toString();}
function go(){const a=+$('a').value,b=+$('b').value,c=+$('c').value;$('err').style.display='none';
if(a===0){$('cards').innerHTML='';$('err').style.display='block';$('err').textContent='a cannot be 0 (that is a linear equation, not quadratic).';return;}
const disc=b*b-4*a*c;let roots;
if(disc>0){const s=Math.sqrt(disc);roots=[f((-b+s)/(2*a)),f((-b-s)/(2*a))].join(',  ');}
else if(disc===0){roots=f(-b/(2*a))+' (double root)';}
else{const re=f(-b/(2*a)),im=f(Math.sqrt(-disc)/(2*a));roots=`${re} ± ${im}i`;}
const vx=f(-b/(2*a)),vy=f(c-b*b/(4*a));
$('cards').innerHTML=[['Roots (x)',roots,true],['Discriminant',f(disc),false],['Nature',disc>0?'2 real':disc===0?'1 real':'2 complex',false],['Vertex',`(${vx}, ${vy})`,false]].map(([l,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value" style="font-size:16px">${v}</div></div>`).join('');}
['a','b','c'].forEach(id=>$(id).addEventListener('input',go));go();