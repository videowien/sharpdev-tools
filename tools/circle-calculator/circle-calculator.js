const $=id=>document.getElementById(id);
function go(){const v=parseFloat($('val').value),k=$('known').value;
if(!isFinite(v)||v<=0){$('cards').innerHTML='<div class="result-card"><div class="label">Enter a value</div><div class="value">—</div></div>';return;}
let r;if(k==='radius')r=v;else if(k==='diameter')r=v/2;else if(k==='circumference')r=v/(2*Math.PI);else r=Math.sqrt(v/Math.PI);
const f=n=>(+(n.toFixed(6))).toString();
const cards=[['Radius',f(r),k==='radius'],['Diameter',f(2*r),k==='diameter'],['Circumference',f(2*Math.PI*r),k==='circumference'],['Area',f(Math.PI*r*r),k==='area']];
$('cards').innerHTML=cards.map(([l,vv,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value">${vv}</div></div>`).join('');}
['val','known'].forEach(id=>$(id).addEventListener('input',go));go();