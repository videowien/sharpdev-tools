const rows=document.getElementById('rows'),cards=document.getElementById('cards');
function addRow(s,e,b){
  const div=document.createElement('div');div.className='hrow';
  div.innerHTML='<div class="field"><label>Start</label><input type="time" class="st" value="'+(s||'09:00')+'"></div><div class="field"><label>End</label><input type="time" class="et" value="'+(e||'17:00')+'"></div><div class="field" style="flex:0 0 110px"><label>Break (min)</label><input type="number" class="br" value="'+(b||0)+'" min="0"></div><button class="rm">&times;</button>';
  div.querySelector('.rm').onclick=()=>{div.remove();calc();};
  div.querySelectorAll('input').forEach(i=>i.addEventListener('input',calc));
  rows.appendChild(div);
}
function calc(){
  let total=0;
  rows.querySelectorAll('.hrow').forEach(r=>{
    const s=r.querySelector('.st').value,e=r.querySelector('.et').value,b=+r.querySelector('.br').value||0;
    if(!s||!e)return;
    const[sh,sm]=s.split(':').map(Number),[eh,em]=e.split(':').map(Number);
    let mins=(eh*60+em)-(sh*60+sm);if(mins<0)mins+=1440;mins-=b;if(mins<0)mins=0;total+=mins;
  });
  const h=Math.floor(total/60),m=total%60,dec=Math.round(total/60*100)/100;
  cards.innerHTML=[['Total time',h+'h '+String(m).padStart(2,'0')+'m',true],['Decimal hours',dec+'',false],['Total minutes',total+'',false]].map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');
}
document.getElementById('add').addEventListener('click',()=>{addRow();calc();});
addRow();addRow();calc();