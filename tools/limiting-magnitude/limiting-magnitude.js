const $=id=>document.getElementById(id);
function go(){const ap=+$('ap').value;
 if(!(ap>0)){$('lm').textContent='-';$('grasp').textContent='-';return;}
 $('lm').textContent='mag '+(Math.round((7.7+5*Math.log10(ap/10))*100)/100);
 $('grasp').textContent='x'+Math.round(Math.pow(ap/7,2)).toLocaleString('en-US');}
$('ap').addEventListener('input',go);go();