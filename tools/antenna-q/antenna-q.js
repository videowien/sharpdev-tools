const $=id=>document.getElementById(id);
function go(){const f0=+$('f0').value,bw=+$('bw').value;if(!(f0>0&&bw>0)){$('q').textContent='-';$('fb').textContent='-';return;}
 $('q').textContent=(f0/bw).toFixed(1);$('fb').textContent=(bw/f0*100).toFixed(2)+'%';}
['f0','bw'].forEach(id=>$(id).addEventListener('input',go));go();