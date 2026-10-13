const $=id=>document.getElementById(id);
function go(){const ci=$('ci').checked,seen=new Set(),toks=$('in').value.split(/\s+/).filter(Boolean),out=[];
for(const w of toks){const k=ci?w.toLowerCase():w;if(!seen.has(k)){seen.add(k);out.push(w);}}
$('out').textContent=out.join(' ');$('stat').textContent=toks.length+' → '+out.length+' words';}
['in','ci'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();