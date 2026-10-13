const $=id=>document.getElementById(id);
function flatten(o,p,r){for(const k in o){const nk=p?p+'.'+k:k;const v=o[k];if(v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length)flatten(v,nk,r);else r[nk]=v;}return r;}
function unflatten(o){const r={};for(const k in o){const parts=k.split('.');let cur=r;parts.forEach((p,i)=>{if(i===parts.length-1)cur[p]=o[k];else cur=cur[p]=cur[p]||{};});}return r;}
$('flat').addEventListener('click',()=>{try{$('out').value=JSON.stringify(flatten(JSON.parse($('in').value),'',{}),null,2);}catch(e){$('out').value='Invalid JSON: '+e.message;}});
$('unflat').addEventListener('click',()=>{try{$('out').value=JSON.stringify(unflatten(JSON.parse($('in').value)),null,2);}catch(e){$('out').value='Invalid JSON: '+e.message;}});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('flat').click();