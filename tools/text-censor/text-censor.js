const $=id=>document.getElementById(id);
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function go(){let text=$('in').value;const mask=($('mask').value||'*').charAt(0);const keep=$('keep').checked;
 const words=$('words').value.split(/[,\n]/).map(w=>w.trim()).filter(Boolean);
 words.forEach(function(w){const re=new RegExp('\\b'+esc(w)+'\\b','gi');text=text.replace(re,function(m){return keep?m.charAt(0)+mask.repeat(Math.max(0,m.length-1)):mask.repeat(m.length);});});
 $('out').value=text;}
['in','words','mask','keep'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();