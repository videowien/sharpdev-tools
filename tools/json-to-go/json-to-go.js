const $=id=>document.getElementById(id);
function pascal(s){s=String(s).replace(/[^a-zA-Z0-9]+/g,' ');return s.split(' ').filter(Boolean).map(w=>w[0].toUpperCase()+w.slice(1)).join('')||'Field';}
function sing(s){return s.replace(/s$/,'')||s;}
function gen(data,root){const out=[];
function typ(v,name){if(v===null)return 'interface{}';
if(Array.isArray(v)){if(!v.length)return '[]interface{}';const t=[...new Set(v.map(x=>typ(x,sing(name))))];return '[]'+(t.length===1?t[0]:'interface{}');}
if(typeof v==='object'){const sn=pascal(name);const lines=Object.keys(v).map(k=>'\t'+pascal(k)+' '+typ(v[k],k)+' `json:"'+k+'"`');out.push('type '+sn+' struct {\n'+lines.join('\n')+'\n}');return sn;}
if(typeof v==='number')return Number.isInteger(v)?'int':'float64';
if(typeof v==='boolean')return 'bool';return 'string';}
typ(data,root);const seen=new Set(),u=[];for(const b of out.reverse())if(!seen.has(b)){seen.add(b);u.push(b);}return u.join('\n\n');}
function go(){const t=$('in').value.trim();if(!t){$('out').textContent='';return;}
try{$('out').textContent=gen(JSON.parse(t),$('root').value.trim()||'Root');$('out').style.color='';}
catch(e){$('out').textContent='Invalid JSON: '+e.message;$('out').style.color='#ff6666';}}
['in','root'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();