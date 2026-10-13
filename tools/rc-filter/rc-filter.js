const $=id=>document.getElementById(id);
function fmtF(f){if(f>=1e6)return (Math.round(f/1e3)/1e3)+' MHz';if(f>=1e3)return (Math.round(f/10)/100)+' kHz';return (Math.round(f*100)/100)+' Hz';}
function fmtT(s){if(s>=1)return (Math.round(s*1000)/1000)+' s';if(s>=1e-3)return (Math.round(s*1e6)/1e3)+' ms';return (Math.round(s*1e9)/1e3)+' µs';}
function go(){const r=+$('r').value,c=(+$('c').value)*1e-6;if(!(r>0&&c>0)){$('fc').textContent='—';$('tau').textContent='—';return;}
 $('fc').textContent=fmtF(1/(2*Math.PI*r*c));$('tau').textContent=fmtT(r*c);}
['r','c'].forEach(id=>$(id).addEventListener('input',go));go();