const $=id=>document.getElementById(id);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function go(){let names=$('in').value.split('\n').map(s=>s.trim()).filter(Boolean);
const k=Math.min(50,Math.max(2,+$('teams').value||2));
if(names.length<k){$('out').innerHTML='<p class="note">Add at least as many names as teams.</p>';return;}
names=shuffle(names);const teams=Array.from({length:k},()=>[]);
names.forEach((n,i)=>teams[i%k].push(n));
$('out').innerHTML=teams.map((t,i)=>`<div class="result-card" style="text-align:left"><div class="label">Team ${i+1} (${t.length})</div><div style="font-size:14px;color:#eee;line-height:1.7">${t.map(x=>x.replace(/</g,'&lt;')).join('<br>')}</div></div>`).join('');}
$('go').addEventListener('click',go);go();