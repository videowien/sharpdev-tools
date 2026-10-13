const $=id=>document.getElementById(id);
function reset(msg){['bf','fm','lm'].forEach(id=>$(id).textContent='—');$('cat').textContent=msg||'—';}
function category(bf,female){
 const m=female?[[14,'Essential'],[21,'Athlete'],[25,'Fitness'],[32,'Average']]:[[6,'Essential'],[14,'Athlete'],[18,'Fitness'],[25,'Average']];
 for(var i=0;i<m.length;i++){if(bf<m[i][0])return m[i][1];}return 'High';
}
function go(){
 const sex=$('sex').value,h=+$('ht').value,neck=+$('neck').value,waist=+$('waist').value,hip=+$('hip').value,wt=+$('wt').value;
 const female=sex==='f';$('hipwrap').style.display=female?'':'none';
 let bf;
 if(female){if(!(h>0&&neck>0&&waist>0&&hip>0))return reset();bf=495/(1.29579-0.35004*Math.log10(waist+hip-neck)+0.22100*Math.log10(h))-450;}
 else{if(!(h>0&&neck>0&&waist>0))return reset();bf=495/(1.0324-0.19077*Math.log10(waist-neck)+0.15456*Math.log10(h))-450;}
 if(!isFinite(bf)||bf<=0||bf>80)return reset('check measurements');
 $('bf').textContent=(Math.round(bf*10)/10)+'%';$('cat').textContent=category(bf,female);
 if(wt>0){const fm=wt*bf/100;$('fm').textContent=(Math.round(fm*10)/10)+' kg';$('lm').textContent=(Math.round((wt-fm)*10)/10)+' kg';}
 else{$('fm').textContent='—';$('lm').textContent='—';}
}
['sex','ht','wt','neck','waist','hip'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();