const $=id=>document.getElementById(id);
function coerce(v){if(v==='true')return true;if(v==='false')return false;if(v==='null')return null;if(v!==''&&!isNaN(v))return Number(v);return v;}
function iniToObj(s){const o={};let sec=o;s.split('\n').forEach(line=>{line=line.trim();if(!line||line[0]===';'||line[0]==='#')return;const sm=line.match(/^\[(.+)\]$/);if(sm){sec=o[sm[1]]={};return;}const i=line.indexOf('=');if(i<0)return;let k=line.slice(0,i).trim(),v=line.slice(i+1).trim();if(v.length>=2&&((v[0]==='"'&&v.endsWith('"'))||(v[0]==="'"&&v.endsWith("'"))))v=v.slice(1,-1);else v=coerce(v);sec[k]=v;});return o;}
function objToIni(o){let top='',sections='';for(const k in o){const v=o[k];if(v&&typeof v==='object'&&!Array.isArray(v)){sections+='\n['+k+']\n';for(const k2 in v)sections+=k2+' = '+fmt(v[k2])+'\n';}else top+=k+' = '+fmt(v)+'\n';}return (top+sections).trim();}
function fmt(v){if(typeof v==='string'&&/[\s;#"']/.test(v))return '"'+v.replace(/"/g,'\\"')+'"';return String(v);}
$('toj').addEventListener('click',()=>{try{$('out').value=JSON.stringify(iniToObj($('in').value),null,2);}catch(e){$('out').value='Error: '+e.message;}});
$('toi').addEventListener('click',()=>{try{$('out').value=objToIni(JSON.parse($('in').value));}catch(e){$('out').value='Invalid JSON: '+e.message;}});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('toj').click();