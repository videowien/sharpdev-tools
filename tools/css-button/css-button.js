const $=id=>document.getElementById(id);
function build(){var sh=$('sh').value==='1';
var L=['.button {','  background: '+$('bg').value+';','  color: '+$('fg').value+';','  font-size: '+$('fs').value+'px;','  font-weight: 600;','  padding: '+$('pv').value+'px '+$('ph').value+'px;','  border-radius: '+$('rad').value+'px;','  border: '+$('bw').value+'px solid '+$('bc').value+';','  cursor: pointer;'];
if(sh)L.push('  box-shadow: 0 4px 14px rgba(0,0,0,0.25);');
L.push('}');$('out').value=L.join('\n');
$('prev').style.cssText='background:'+$('bg').value+';color:'+$('fg').value+';font-size:'+$('fs').value+'px;font-weight:600;padding:'+$('pv').value+'px '+$('ph').value+'px;border-radius:'+$('rad').value+'px;border:'+$('bw').value+'px solid '+$('bc').value+';cursor:pointer;'+(sh?'box-shadow:0 4px 14px rgba(0,0,0,0.25);':'');}
Array.prototype.forEach.call(document.querySelectorAll('.page input,.page select'),function(el){el.addEventListener('input',build);el.addEventListener('change',build);});
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').value);});
build();