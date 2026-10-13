const $=id=>document.getElementById(id);
function L(ft){return ft.toFixed(2)+' ft / '+(ft*0.3048).toFixed(2)+' m';}
function go(){const f=+$('f').value,n=+$('shape').value;if(!(f>0)){$('tot').textContent='-';$('side').textContent='-';return;}
 const tot=1005/f;$('tot').textContent=L(tot);$('side').textContent=L(tot/n);}
['f','shape'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();