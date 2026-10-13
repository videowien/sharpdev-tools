const $=id=>document.getElementById(id);
const NANO='useandom-26T198340PX75pxJ8RuFKbicqgH_E0fmCWNc';
const CROCK='0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function nanoid(size){const b=crypto.getRandomValues(new Uint8Array(size));let s='';for(let i=0;i<size;i++)s+=NANO[b[i]&63];return s;}
function ulid(){
  let t=Date.now(),time='';
  for(let i=9;i>=0;i--){time=CROCK[t%32]+time;t=Math.floor(t/32);}
  const r=crypto.getRandomValues(new Uint8Array(16));let rand='';
  for(let i=0;i<16;i++)rand+=CROCK[r[i]&31];
  return time+rand;
}
function go(){
  const type=$('type').value,n=Math.min(500,Math.max(1,+$('count').value||1)),size=Math.min(64,Math.max(4,+$('size').value||21));
  const ids=[];for(let i=0;i<n;i++)ids.push(type==='nano'?nanoid(size):ulid());
  $('out').textContent=ids.join('\n');
}
$('gen').addEventListener('click',go);
$('type').addEventListener('change',go);
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();