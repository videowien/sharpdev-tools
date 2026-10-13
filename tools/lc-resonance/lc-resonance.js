const $=id=>document.getElementById(id);
function fmtF(f){if(f>=1e9)return (Math.round(f/1e6)/1e3)+' GHz';if(f>=1e6)return (Math.round(f/1e3)/1e3)+' MHz';if(f>=1e3)return (Math.round(f/10)/100)+' kHz';return (Math.round(f*100)/100)+' Hz';}
function go(){const l=(+$('l').value)*1e-6,c=(+$('c').value)*1e-12;if(!(l>0&&c>0)){$('f').textContent='—';return;}$('f').textContent=fmtF(1/(2*Math.PI*Math.sqrt(l*c)));}
['l','c'].forEach(id=>$(id).addEventListener('input',go));go();