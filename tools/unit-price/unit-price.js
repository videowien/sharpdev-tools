const $=id=>document.getElementById(id);const rows=$('rows');
function addRow(p,q){const d=document.createElement('div');d.className='uprow';
d.innerHTML='<div class="field"><label>Price</label><input type="number" class="p" step="any" value="'+(p||'')+'" placeholder="2.49"></div><div class="field"><label>Quantity / amount</label><input type="number" class="q" step="any" value="'+(q||'')+'" placeholder="500"></div><button class="rm">&times;</button>';
d.querySelector('.rm').onclick=()=>{d.remove();go();};d.querySelectorAll('input').forEach(i=>i.addEventListener('input',go));rows.appendChild(d);}
function go(){const data=[...rows.querySelectorAll('.uprow')].map((r,i)=>{const p=parseFloat(r.querySelector('.p').value),q=parseFloat(r.querySelector('.q').value);return{i:i+1,unit:(p>0&&q>0)?p/q:null};}).filter(x=>x.unit!=null);
if(!data.length){$('result').innerHTML='';return;}
const best=Math.min(...data.map(d=>d.unit));
$('result').innerHTML=data.map(d=>`<div class="result-card${d.unit===best?' hl':''}"><div class="label">Option ${d.i}${d.unit===best?' — best':''}</div><div class="value" style="font-size:17px">${(+(d.unit.toFixed(5)))} /unit</div></div>`).join('');}
$('add').addEventListener('click',()=>{addRow();go();});
addRow();addRow();go();