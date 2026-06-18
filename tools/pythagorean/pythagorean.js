const $=id=>document.getElementById(id);
function val(id){const v=$(id).value.trim();return v===''?null:parseFloat(v);}
function go(){const a=val('a'),b=val('b'),c=val('c'),f=n=>(+(n.toFixed(6))).toString();$('err').style.display='none';
const filled=[a,b,c].filter(x=>x!=null&&isFinite(x)).length;
if(filled!==2){$('cards').innerHTML='';$('err').style.display='block';$('err').textContent='Fill in exactly two values, leave the third blank.';return;}
let ra=a,rb=b,rc=c,solved;
if(c==null){rc=Math.sqrt(a*a+b*b);solved='c';}
else if(b==null){if(c<=a){$('cards').innerHTML='';$('err').style.display='block';$('err').textContent='The hypotenuse c must be longer than leg a.';return;}rb=Math.sqrt(c*c-a*a);solved='b';}
else{if(c<=b){$('cards').innerHTML='';$('err').style.display='block';$('err').textContent='The hypotenuse c must be longer than leg b.';return;}ra=Math.sqrt(c*c-b*b);solved='a';}
const cards=[['a',f(ra),solved==='a'],['b',f(rb),solved==='b'],['c (hypotenuse)',f(rc),solved==='c']];
$('cards').innerHTML=cards.map(([l,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');}
['a','b','c'].forEach(id=>$(id).addEventListener('input',go));go();