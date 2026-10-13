const $=id=>document.getElementById(id);
function envToJson(s){const o={};s.split('\n').forEach(function(line){line=line.trim();if(!line||line[0]==='#')return;const i=line.indexOf('=');if(i<0)return;let k=line.slice(0,i).trim();let v=line.slice(i+1).trim();if(v.length>=2&&((v[0]==='"'&&v[v.length-1]==='"')||(v[0]==="'"&&v[v.length-1]==="'")))v=v.slice(1,-1);o[k]=v;});return JSON.stringify(o,null,2);}
function jsonToEnv(s){const o=JSON.parse(s);return Object.keys(o).map(function(k){let v=String(o[k]);if(/[\s#'"]/.test(v))v='"'+v.replace(/"/g,'\\"')+'"';return k+'='+v;}).join('\n');}
$('toj').addEventListener('click',()=>{try{$('out').value=envToJson($('in').value);}catch(e){$('out').value='Error: '+e.message;}});
$('toe').addEventListener('click',()=>{try{$('out').value=jsonToEnv($('in').value);}catch(e){$('out').value='Invalid JSON: '+e.message;}});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
(function(){try{$('out').value=envToJson($('in').value);}catch(e){}})();