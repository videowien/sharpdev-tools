const $=id=>document.getElementById(id);
function go(){const f=+$('f').value,h=+$('h').value;if(!(f>0&&h>0)){$('ang').textContent='-';$('hw').textContent='-';return;}
 const lambda=299.792458/f;const ratio=lambda/(4*h);
 $('hw').textContent=(h/lambda).toFixed(2)+' λ';
 if(ratio>=1){$('ang').textContent='~90° (NVIS / high angle)';}
 else{$('ang').textContent=(Math.asin(ratio)*180/Math.PI).toFixed(1)+'°';}}
['f','h'].forEach(id=>$(id).addEventListener('input',go));go();