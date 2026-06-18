const inEl=document.getElementById('in'),outEl=document.getElementById('out'),rootEl=document.getElementById('root');
function pascal(s){s=String(s).replace(/[^a-zA-Z0-9]+/g,' ');return s.split(' ').filter(Boolean).map(w=>w[0].toUpperCase()+w.slice(1)).join('')||'Item';}
function singular(s){return s.replace(/s$/,'')||s;}
function safeKey(k){return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)?k:JSON.stringify(k);}
function gen(json,rootName){
  const out=[];
  function tsType(val,name){
    if(val===null)return 'any';
    if(Array.isArray(val)){
      if(!val.length)return 'any[]';
      const types=[...new Set(val.map(v=>tsType(v,singular(name))))];
      const inner=types.length===1?types[0]:'('+types.join(' | ')+')';
      return inner+'[]';
    }
    if(typeof val==='object'){
      const iname=pascal(name);
      const lines=Object.keys(val).map(k=>'  '+safeKey(k)+': '+tsType(val[k],k)+';');
      out.push('interface '+iname+' {\n'+(lines.join('\n')||'')+'\n}');
      return iname;
    }
    if(typeof val==='number')return 'number';
    if(typeof val==='boolean')return 'boolean';
    return 'string';
  }
  tsType(json,rootName);
  const uniq=[],seen=new Set();
  for(const b of out.reverse()){if(!seen.has(b)){seen.add(b);uniq.push(b);}}
  return uniq.join('\n\n');
}
function go(){
  const t=inEl.value.trim();
  if(!t){outEl.textContent='';outEl.classList.remove('err');return;}
  try{
    const data=JSON.parse(t);
    outEl.textContent=gen(data,rootEl.value.trim()||'Root');
    outEl.style.color='';
  }catch(e){outEl.textContent='Invalid JSON: '+e.message;outEl.style.color='#ff6666';}
}
inEl.addEventListener('input',go);rootEl.addEventListener('input',go);
document.getElementById('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(outEl.textContent);});
go();