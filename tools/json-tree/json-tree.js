const $=id=>document.getElementById(id);
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function val(v){if(v===null)return '<span class="null">null</span>';const t=typeof v;if(t==='string')return '<span class="str">"'+esc(v)+'"</span>';if(t==='number')return '<span class="num">'+v+'</span>';if(t==='boolean')return '<span class="bool">'+v+'</span>';return esc(String(v));}
function build(data,indent,keyHtml){const pad='  '.repeat(indent);
 if(data&&typeof data==='object'){const isArr=Array.isArray(data);const keys=isArr?data.map((_,i)=>i):Object.keys(data);const open=isArr?'[':'{',close=isArr?']':'}';
  if(keys.length===0)return '<div class="row">'+pad+(keyHtml||'')+open+close+'</div>';
  let h='<div class="row">'+pad+'<span class="tog">▾</span>'+(keyHtml||'')+open+' <span class="muted">'+(isArr?keys.length+' items':keys.length+' keys')+'</span></div>';
  h+='<div class="kids">';
  keys.forEach((k,i)=>{const kh=isArr?'':'<span class="key">"'+esc(k)+'"</span>: ';h+=build(data[k],indent+1,kh);});
  h+='</div><div class="row">'+pad+close+'</div>';return h;}
 return '<div class="row">'+pad+(keyHtml||'')+val(data)+'</div>';}
function render(){const t=$('in').value.trim();const err=$('err');if(!t){$('tree').innerHTML='';err.style.display='none';return;}
 try{const data=JSON.parse(t);err.style.display='none';$('tree').innerHTML=build(data,0,'');
  $('tree').querySelectorAll('.tog').forEach(tg=>tg.addEventListener('click',()=>{const kids=tg.closest('.row').nextElementSibling;if(kids&&kids.classList.contains('kids')){kids.classList.toggle('collapsed');tg.textContent=kids.classList.contains('collapsed')?'▸':'▾';}}));
 }catch(e){err.style.display='block';err.textContent='Invalid JSON: '+e.message;}}
$('in').addEventListener('input',render);
$('expand').addEventListener('click',()=>{$('tree').querySelectorAll('.kids').forEach(k=>k.classList.remove('collapsed'));$('tree').querySelectorAll('.tog').forEach(t=>t.textContent='▾');});
$('collapse').addEventListener('click',()=>{$('tree').querySelectorAll('.kids').forEach(k=>k.classList.add('collapsed'));$('tree').querySelectorAll('.tog').forEach(t=>t.textContent='▸');});
render();