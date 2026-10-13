const $=id=>document.getElementById(id);
function L(ft){return ft.toFixed(2)+' ft / '+(ft*0.3048).toFixed(2)+' m';}
function go(){const f=+$('f').value;if(!(f>0)){$('tot').textContent='-';$('leg').textContent='-';return;}
 $('tot').textContent=L(468/f);$('leg').textContent=L(234/f);}
$('f').addEventListener('input',go);go();