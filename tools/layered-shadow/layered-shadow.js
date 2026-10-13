const $=id=>document.getElementById(id);
function hexRGB(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function gen(){const n=+$('depth').value,dist=+$('dist').value,a=(+$('alpha').value)/100,[r,g,b]=hexRGB($('hue').value);
 const layers=[];for(let i=1;i<=n;i++){const t=i/n;const y=Math.round(dist*t*t*1.6);const blur=Math.round(dist*t*t*2.2+1);const op=(a*(1-t*0.55)).toFixed(3);layers.push('0 '+y+'px '+blur+'px rgba('+r+','+g+','+b+','+op+')');}
 const css='box-shadow:\n  '+layers.join(',\n  ')+';';
 $('card').style.boxShadow=layers.join(',');$('code').value=css;}
['depth','dist','alpha','hue'].forEach(id=>$(id).addEventListener('input',gen));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('code').value));
gen();