const $=id=>document.getElementById(id);
function q(s){return "'"+String(s).replace(/'/g,"'\\''")+"'";}
function go(){
  const method=$('method').value,url=$('url').value.trim(),token=$('token').value.trim(),body=$('body').value.trim(),pretty=$('pretty').checked;
  const parts=['curl -X '+method+' '+q(url||'https://example.com')];
  const hdrs=$('headers').value.split('\n').map(l=>l.trim()).filter(Boolean);
  for(const h of hdrs)parts.push('-H '+q(h));
  if(token)parts.push('-H '+q('Authorization: Bearer '+token));
  if(body)parts.push('-d '+q(body));
  $('out').textContent=parts.join(pretty?' \\\n  ':' ');
}
['method','url','headers','token','body','pretty'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();