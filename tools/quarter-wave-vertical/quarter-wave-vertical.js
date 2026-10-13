const $=id=>document.getElementById(id);
function L(ft){return ft.toFixed(2)+' ft / '+(ft*0.3048).toFixed(2)+' m';}
function go(){const f=+$('f').value;if(!(f>0)){$('rad').textContent='-';$('rdl').textContent='-';return;}
 $('rad').textContent=L(234/f);$('rdl').textContent=L(234*1.05/f);}
$('f').addEventListener('input',go);go();