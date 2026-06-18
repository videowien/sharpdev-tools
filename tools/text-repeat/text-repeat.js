const $=id=>document.getElementById(id);
const SEP={'\\n':'\n'};
function go(){
  const t=$('in').value;const n=Math.min(10000,Math.max(1,+$('times').value||1));
  let sep=$('sep').value;if(sep==='\\n')sep='\n';
  const num=$('num').checked;
  const arr=[];for(let i=1;i<=n;i++)arr.push(num?(i+'. '+t):t);
  const out=arr.join(sep);
  $('out').textContent=out;$('cnt').textContent=out.length;
}
['in','times','sep','num'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();