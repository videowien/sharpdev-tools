const $=id=>document.getElementById(id);
function spec(sel){var s=sel.trim();if(!s)return null;
var a=(s.match(/#[\w-]+/g)||[]).length;s=s.replace(/#[\w-]+/g,' ');
var cls=(s.match(/\.[\w-]+/g)||[]).length;var attr=(s.match(/\[[^\]]+\]/g)||[]).length;
s=s.replace(/\.[\w-]+/g,' ').replace(/\[[^\]]+\]/g,' ');
var pe=(s.match(/::[\w-]+/g)||[]).length;s=s.replace(/::[\w-]+/g,' ');
var pc=(s.match(/:[\w-]+(\([^)]*\))?/g)||[]).length;s=s.replace(/:[\w-]+(\([^)]*\))?/g,' ');
var el=(s.match(/[a-zA-Z][\w-]*/g)||[]).length;
return [a, cls+attr+pc, el+pe];}
function go(){var r=spec($('sel').value);if(!r){$('out').textContent='Enter a selector.';return;}
$('out').innerHTML='<div style="font-size:30px;color:#fff;font-family:monospace;">('+r[0]+', '+r[1]+', '+r[2]+')</div>'
+'<div style="color:#888;font-size:13px;margin-top:8px;">'+r[0]+' ID(s) &middot; '+r[1]+' class(es)/attribute(s)/pseudo-class(es) &middot; '+r[2]+' element(s)/pseudo-element(s)</div>';}
$('sel').addEventListener('input',go);go();