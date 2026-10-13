const $=id=>document.getElementById(id);
function go(){const ap=+$('ap').value;
 if(!(ap>0)){$('dawes').textContent='-';$('ray').textContent='-';return;}
 $('dawes').textContent=(Math.round(116/ap*1000)/1000)+'″';
 $('ray').textContent=(Math.round(138/ap*1000)/1000)+'″';}
$('ap').addEventListener('input',go);go();