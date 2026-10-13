const $=id=>document.getElementById(id);
function fmtT(s){if(s>=1)return (Math.round(s*1000)/1000)+' s';if(s>=1e-3)return (Math.round(s*1e6)/1e3)+' ms';return (Math.round(s*1e9)/1e3)+' µs';}
function fmtF(f){if(f>=1e6)return (Math.round(f/1e3)/1e3)+' MHz';if(f>=1e3)return (Math.round(f/10)/100)+' kHz';return (Math.round(f*100)/100)+' Hz';}
function go(){const mode=$('mode').value,r1=(+$('r1').value)*1000,r2=(+$('r2').value)*1000,c=(+$('c').value)*1e-6;
 $('r2wrap').style.display=mode==='astable'?'':'none';
 if(mode==='astable'){if(!(r1>0&&r2>0&&c>0)){$('cards').innerHTML='';return;}const f=1.44/((r1+2*r2)*c);const duty=(r1+r2)/(r1+2*r2)*100;const th=0.693*(r1+r2)*c,tl=0.693*r2*c;
  $('cards').innerHTML='<div class="result-card hl"><div class="label">Frequency</div><div class="value">'+fmtF(f)+'</div></div><div class="result-card"><div class="label">Period</div><div class="value">'+fmtT(1/f)+'</div></div><div class="result-card"><div class="label">Duty cycle</div><div class="value">'+(Math.round(duty*10)/10)+'%</div></div><div class="result-card"><div class="label">High / Low</div><div class="value" style="font-size:14px;">'+fmtT(th)+' / '+fmtT(tl)+'</div></div>';}
 else{if(!(r1>0&&c>0)){$('cards').innerHTML='';return;}const t=1.1*r1*c;$('cards').innerHTML='<div class="result-card hl" style="grid-column:1 / -1;"><div class="label">Pulse width</div><div class="value">'+fmtT(t)+'</div></div>';}}
['mode','r1','r2','c'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();