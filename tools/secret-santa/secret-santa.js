const $=id=>document.getElementById(id);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function go(){const names=$('in').value.split('\n').map(s=>s.trim()).filter(Boolean);
if(names.length<2){$('out').innerHTML='<p class="note">Add at least 2 names.</p>';return;}
let order;do{order=shuffle([...names]);}while(order.some((n,i)=>n===names[i]));
// derangement: giver names[i] -> receiver order[i], ensure no self
const pairs=names.map((g,i)=>[g,order[i]]);
$('out').innerHTML=pairs.map(([g,r])=>`<div class="ss"><strong>${g.replace(/</g,'&lt;')}</strong><span class="g">&#8594; gifts &#8594;</span><strong>${r.replace(/</g,'&lt;')}</strong></div>`).join('');}
$('go').addEventListener('click',go);go();