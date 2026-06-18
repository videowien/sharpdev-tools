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

var cfg={str:'String',int:'Long',flt:'Double',bool:'Boolean',any:'Any?',list:function(t){return 'List<'+t+'>';}};
function render(classes){return classes.map(function(c){if(!c.fields.length)return 'class '+c.name+'()';var L=['data class '+c.name+'(' ];c.fields.forEach(function(f,i){L.push('    val '+f.key+': '+f.type+(i<c.fields.length-1?',':''));});L.push(')');return L.join('\n');}).join('\n\n');}
function run(){generate(cfg,render);}
$('gen').addEventListener('click',run);$('in').addEventListener('input',run);
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').value);});
run();