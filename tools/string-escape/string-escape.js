const $=id=>document.getElementById(id);
function escape(s,m){
  if(m==='json')return JSON.stringify(s).slice(1,-1);
  if(m==='js')return s.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\t/g,'\\t');
  if(m==='html')return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  if(m==='url')return encodeURIComponent(s);
  return s;
}
function unescape(s,m){
  try{
    if(m==='json')return JSON.parse('"'+s.replace(/"/g,'\\"')+'"');
    if(m==='js')return s.replace(/\\n/g,'\n').replace(/\\r/g,'\r').replace(/\\t/g,'\t').replace(/\\'/g,"'").replace(/\\"/g,'"').replace(/\\\\/g,'\\');
    if(m==='html'){const d=document.createElement('textarea');d.innerHTML=s;return d.value;}
    if(m==='url')return decodeURIComponent(s);
  }catch(e){return 'Error: '+e.message;}
  return s;
}
let last='esc';
function run(){const m=$('mode').value,v=$('in').value;$('out').textContent=last==='esc'?escape(v,m):unescape(v,m);}
$('esc').addEventListener('click',()=>{last='esc';run();});
$('unesc').addEventListener('click',()=>{last='unesc';run();});
$('in').addEventListener('input',run);$('mode').addEventListener('change',run);
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
run();