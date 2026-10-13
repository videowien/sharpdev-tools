const $=id=>document.getElementById(id);
const ZONES=[['Z1 Recovery',50,60],['Z2 Easy / fat burn',60,70],['Z3 Aerobic',70,80],['Z4 Threshold',80,90],['Z5 Maximum',90,100]];
function go(){
 const age=+$('age').value,rest=parseFloat($('rest').value);
 if(!(age>0)){$('mhr').textContent='—';$('method').textContent='—';$('zones').innerHTML='';return;}
 const mhr=Math.round(220-age);$('mhr').textContent=mhr+' bpm';
 const useK=isFinite(rest)&&rest>0&&rest<mhr;$('method').textContent=useK?'Karvonen (HRR)':'% of max HR';
 let html='<div class="cell h">Zone</div><div class="cell h">Intensity</div><div class="cell h">bpm</div>';
 ZONES.forEach(function(z){var a,b;if(useK){a=Math.round(rest+(z[1]/100)*(mhr-rest));b=Math.round(rest+(z[2]/100)*(mhr-rest));}else{a=Math.round(mhr*z[1]/100);b=Math.round(mhr*z[2]/100);}html+='<div class="cell">'+z[0]+'</div><div class="cell">'+z[1]+' to '+z[2]+'%</div><div class="cell">'+a+' to '+b+'</div>';});
 $('zones').innerHTML=html;
}
['age','rest'].forEach(id=>$(id).addEventListener('input',go));go();