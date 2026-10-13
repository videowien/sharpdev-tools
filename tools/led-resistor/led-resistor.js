const $=id=>document.getElementById(id);
const E12=[1,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
function nearestE12(r){if(r<=0)return 0;const dec=Math.floor(Math.log10(r));let best=null,bd=1e99;for(let d=dec-1;d<=dec+1;d++)for(const b of E12){const v=b*Math.pow(10,d);const diff=Math.abs(v-r);if(diff<bd){bd=diff;best=v;}}return best;}
function fmt(r){if(r>=1e6)return (Math.round(r/1e3)/1e3)+' MΩ';if(r>=1e3)return (Math.round(r/10)/100)+' kΩ';return (Math.round(r*10)/10)+' Ω';}
function go(){const vs=+$('vs').value,vf=+$('vf').value,i=(+$('if').value)/1000;const note=$('note');
 if(!(vs>vf&&i>0)){$('r').textContent='—';$('e12').textContent='—';$('p').textContent='—';if(vs<=vf)note.textContent='Supply voltage must be higher than the LED forward voltage, otherwise the LED will not light.';return;}
 const r=(vs-vf)/i;const p=(vs-vf)*i;$('r').textContent=fmt(r);$('e12').textContent=fmt(nearestE12(r));$('p').textContent=(Math.round(p*1000)/1000)+' W';}
['vs','vf','if'].forEach(id=>$(id).addEventListener('input',go));go();