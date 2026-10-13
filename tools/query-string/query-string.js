const $=id=>document.getElementById(id);
function parse(s){s=s.trim();const qi=s.indexOf('?');if(qi>=0)s=s.slice(qi+1);const hi=s.indexOf('#');if(hi>=0)s=s.slice(0,hi);const p=new URLSearchParams(s);const o={};for(const k of new Set(p.keys())){const all=p.getAll(k);o[k]=all.length>1?all:all[0];}return JSON.stringify(o,null,2);}
function build(s){const o=JSON.parse(s);const p=new URLSearchParams();for(const k in o){const v=o[k];if(Array.isArray(v))v.forEach(x=>p.append(k,x));else p.append(k,v);}return p.toString();}
$('toj').addEventListener('click',()=>{try{$('out').value=parse($('in').value);}catch(e){$('out').value='Error: '+e.message;}});
$('tos').addEventListener('click',()=>{try{$('out').value=build($('in').value);}catch(e){$('out').value='Invalid JSON: '+e.message;}});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('toj').click();