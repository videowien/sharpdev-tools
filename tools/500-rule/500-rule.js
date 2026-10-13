const $=id=>document.getElementById(id);
const CF={ff:1,apsc:1.5,canon:1.6,mft:2.0,one:2.7};
function fmtT(t){if(t>=1)return (Math.round(t*10)/10)+' s';return '1/'+Math.round(1/t)+' s';}
function go(){const f=+$('f').value,cf=CF[$('sensor').value],rule=+$('rule').value;
 if(!(f>0&&cf>0&&rule>0)){$('out').textContent='-';$('eff').textContent='-';return;}
 $('out').textContent=fmtT(rule/(f*cf));$('eff').textContent=Math.round(f*cf)+' mm';}
['f','sensor','rule'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();