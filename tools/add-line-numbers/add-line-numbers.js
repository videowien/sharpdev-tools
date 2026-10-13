const $=id=>document.getElementById(id);
function go(){const lines=$('in').value.split('\n');const start=parseInt($('start').value)||0;let sep=$('sep').value;if(sep==='\\t')sep='\t';
const pad=$('pad').checked,w=String(start+lines.length-1).length;
$('out').textContent=lines.map((l,i)=>{let n=String(start+i);if(pad)n=n.padStart(w,'0');return n+sep+l;}).join('\n');}
['in','start','sep','pad'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();