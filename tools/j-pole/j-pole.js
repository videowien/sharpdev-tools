const $=id=>document.getElementById(id);
function L(ft){return (ft*12).toFixed(1)+' in / '+ft.toFixed(2)+' ft / '+(ft*0.3048).toFixed(3)+' m';}
function go(){const f=+$('f').value;if(!(f>0)){$('lng').textContent='-';$('sht').textContent='-';return;}
 $('lng').textContent=L(0.75*984*0.95/f);$('sht').textContent=L(0.25*984*0.95/f);}
$('f').addEventListener('input',go);go();