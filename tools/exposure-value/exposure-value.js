const $=id=>document.getElementById(id);
function parseT(s){s=(s||'').trim();if(!s)return NaN;if(s.indexOf('/')>=0){const p=s.split('/');return (+p[0])/(+p[1]);}return +s;}
function go(){const N=+$('N').value,t=parseT($('t').value),iso=+$('iso').value;
 if(!(N>0&&t>0&&iso>0)){$('ev').textContent='-';$('ev100').textContent='-';return;}
 const ev=Math.log2(N*N/t);const ev100=ev-Math.log2(iso/100);
 $('ev').textContent=(Math.round(ev*100)/100)+' EV';
 $('ev100').textContent=(Math.round(ev100*100)/100)+' EV';}
['N','t','iso'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();