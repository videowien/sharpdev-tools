const $=id=>document.getElementById(id);
function build(){
  const r=Math.min(50,Math.max(1,+$('rows').value||1)),c=Math.min(20,Math.max(1,+$('cols').value||1)),hdr=$('header').checked,bd=$('border').checked,st=$('stripe').checked;
  let css='';
  if(bd||st){css='<style>\n  table{border-collapse:collapse}\n';if(bd)css+='  th,td{border:1px solid #ccc;padding:8px}\n';else css+='  th,td{padding:8px}\n';if(st)css+='  tbody tr:nth-child(even){background:#f2f2f2}\n';css+='</style>\n';}
  let h='<table>\n';
  if(hdr){h+='  <thead>\n    <tr>'+Array.from({length:c},(_,i)=>'<th>Header '+(i+1)+'</th>').join('')+'</tr>\n  </thead>\n';}
  h+='  <tbody>\n';
  for(let i=0;i<r;i++)h+='    <tr>'+Array.from({length:c},(_,j)=>'<td>Cell '+(i+1)+','+(j+1)+'</td>').join('')+'</tr>\n';
  h+='  </tbody>\n</table>';
  return css+h;
}
function go(){const html=build();$('out').textContent=html;$('prev').innerHTML=html;}
['rows','cols','header','border','stripe'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();