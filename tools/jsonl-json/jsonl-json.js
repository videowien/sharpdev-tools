const $=id=>document.getElementById(id);
function toArr(s){const lines=s.split('\n').map(l=>l.trim()).filter(Boolean);return JSON.stringify(lines.map(l=>JSON.parse(l)),null,2);}
function toLines(s){const a=JSON.parse(s);if(!Array.isArray(a))throw new Error('Input must be a JSON array');return a.map(x=>JSON.stringify(x)).join('\n');}
$('toarr').addEventListener('click',()=>{try{$('out').value=toArr($('in').value);}catch(e){$('out').value='Invalid JSONL: '+e.message;}});
$('tojsonl').addEventListener('click',()=>{try{$('out').value=toLines($('in').value);}catch(e){$('out').value='Invalid JSON: '+e.message;}});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('toarr').click();