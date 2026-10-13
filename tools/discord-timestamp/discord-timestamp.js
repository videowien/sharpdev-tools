const $=id=>document.getElementById(id);
const STYLES=[['t','Short time'],['T','Long time'],['d','Short date'],['D','Long date'],['f','Short date/time'],['F','Long date/time'],['R','Relative']];
function fmt(unix,s){
  const d=new Date(unix*1000);
  const o={t:{hour:'2-digit',minute:'2-digit'},T:{hour:'2-digit',minute:'2-digit',second:'2-digit'},d:{year:'numeric',month:'2-digit',day:'2-digit'},D:{year:'numeric',month:'long',day:'numeric'},f:{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'},F:{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}};
  if(s==='R'){const diff=unix-Date.now()/1000;const a=Math.abs(diff);let v,u;if(a<60){v=Math.round(a);u='second';}else if(a<3600){v=Math.round(a/60);u='minute';}else if(a<86400){v=Math.round(a/3600);u='hour';}else{v=Math.round(a/86400);u='day';}return (diff<0?v+' '+u+(v!==1?'s':'')+' ago':'in '+v+' '+u+(v!==1?'s':''));}
  return d.toLocaleString([],o[s]);
}
function go(){
  if(!$('dt').value)return;
  const unix=Math.floor(new Date($('dt').value).getTime()/1000);
  $('rows').innerHTML=STYLES.map(([s,label])=>{
    const code='&lt;t:'+unix+':'+s+'&gt;';const raw='<t:'+unix+':'+s+'>';
    return `<div class="dt-row"><code>${code}</code><span class="prev">${label}: ${fmt(unix,s)}</span><button class="copy-btn" data-c="${raw}">Copy</button></div>`;
  }).join('');
  $('rows').querySelectorAll('button').forEach(b=>b.onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(b.dataset.c);b.textContent='Copied';setTimeout(()=>b.textContent='Copy',900);});
}
$('dt').addEventListener('input',go);
const now=new Date();now.setMinutes(now.getMinutes()-now.getTimezoneOffset());$('dt').value=now.toISOString().slice(0,16);
go();