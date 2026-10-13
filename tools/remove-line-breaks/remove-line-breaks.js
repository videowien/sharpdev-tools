const $=id=>document.getElementById(id);
function go(){const t=$('in').value,m=$('mode').value;let o;
if(m==='space')o=t.replace(/\s*\r?\n\s*/g,' ').replace(/[ \t]{2,}/g,' ').trim();
else if(m==='none')o=t.replace(/\r?\n/g,'');
else o=t.split(/\n{2,}/).map(p=>p.replace(/\s*\r?\n\s*/g,' ').trim()).filter(Boolean).join('\n\n');
$('out').textContent=o;$('cnt').textContent=o.length;}
['in','mode'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();