const $=id=>document.getElementById(id);
function pascal(s){var t=String(s).replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').map(function(w){return w.charAt(0).toUpperCase()+w.slice(1);}).join('');return t||'Item';}
function infer(val,name,classes,cfg){
  if(val===null)return cfg.any;
  if(Array.isArray(val)){if(val.length===0)return cfg.list(cfg.any);var sing=name.replace(/ies$/,'y').replace(/s$/,'');return cfg.list(infer(val[0],sing||name,classes,cfg));}
  var t=typeof val;
  if(t==='string')return cfg.str;
  if(t==='boolean')return cfg.bool;
  if(t==='number')return Number.isInteger(val)?cfg.int:cfg.flt;
  if(t==='object'){var cn=pascal(name);var fields=Object.keys(val).map(function(k){return {key:k,type:infer(val[k],k,classes,cfg)};});if(!classes.some(function(c){return c.name===cn;}))classes.push({name:cn,fields:fields});return cn;}
  return cfg.any;
}
function generate(cfg,render){var raw=$('in').value;var data;try{data=JSON.parse(raw);}catch(e){$('out').value='Invalid JSON: '+e.message;return;}
if(typeof data!=='object'||data===null){$('out').value='Please paste a JSON object or array.';return;}
var classes=[];infer(Array.isArray(data)?(data[0]||{}):data,'Root',classes,cfg);$('out').value=render(classes);}

var cfg={str:'str',int:'int',flt:'float',bool:'bool',any:'Any',list:function(t){return 'list['+t+']';}};
function render(classes){var out='from dataclasses import dataclass\n';if(/\bAny\b/.test(JSON.stringify(classes)))out='from dataclasses import dataclass\nfrom typing import Any\n';out+='\n';
return out+classes.map(function(c){var L=['@dataclass','class '+c.name+':'];if(!c.fields.length)L.push('    pass');c.fields.forEach(function(f){L.push('    '+f.key+': '+f.type);});return L.join('\n');}).join('\n\n\n');}
function run(){generate(cfg,render);}
$('gen').addEventListener('click',run);$('in').addEventListener('input',run);
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').value);});
run();