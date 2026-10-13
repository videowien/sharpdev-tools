const $=id=>document.getElementById(id);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function esc(s){return s.replace(/</g,'&lt;');}
function go(){let p=shuffle($('in').value.split('\n').map(s=>s.trim()).filter(Boolean));
if(p.length<2){$('out').innerHTML='<p class="note">Add at least 2 participants.</p>';return;}
let size=1;while(size<p.length)size*=2;while(p.length<size)p.push('(bye)');
const rounds=[];let cur=p;
while(cur.length>1){const matches=[];for(let i=0;i<cur.length;i+=2)matches.push([cur[i],cur[i+1]]);rounds.push(matches);
cur=matches.map(()=>'?');}
const names=['Round 1','Round 2','Round 3','Round 4','Round 5','Round 6','Quarterfinal','Semifinal','Final'];
$('out').innerHTML=rounds.map((mts,ri)=>{const label=ri===rounds.length-1?'Final':ri===rounds.length-2?'Semifinal':'Round '+(ri+1);
return `<div class="rnd"><h4>${label}</h4>`+mts.map(m=>`<div class="match"><div class="${m[0]==='(bye)'?'bye':''}">${esc(m[0])}</div><div class="${m[1]==='(bye)'?'bye':''}">${esc(m[1])}</div></div>`).join('')+`</div>`;}).join('');}
$('go').addEventListener('click',go);go();