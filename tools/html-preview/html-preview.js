const $=id=>document.getElementById(id);
function go(){$('frame').srcdoc=$('in').value;}
$('in').addEventListener('input',go);go();