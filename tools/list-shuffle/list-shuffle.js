const $=id=>document.getElementById(id);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function go(){
  let items=$('in').value.split('\n').map(s=>s.trim()).filter(Boolean);
  if($('dedupe').checked)items=[...new Set(items)];
  items=shuffle(items);
  const pick=+$('pick').value||0;
  if(pick>0)items=items.slice(0,pick);
  $('out').textContent=items.join('\n');
}
$('go').addEventListener('click',go);
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();