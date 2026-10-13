const $=id=>document.getElementById(id);
function go(){const s=+$('swr').value;if(!(s>=1)){['ref','rl','ml','g'].forEach(id=>$(id).textContent='-');return;}
 const g=(s-1)/(s+1);const rl=g>0?-20*Math.log10(g):Infinity;const ml=-10*Math.log10(1-g*g);
 $('g').textContent=g.toFixed(4);
 $('ref').textContent=(g*g*100).toFixed(2)+'%  (delivered '+(100-g*g*100).toFixed(2)+'%)';
 $('rl').textContent=isFinite(rl)?rl.toFixed(2)+' dB':'∞ (perfect)';
 $('ml').textContent=ml.toFixed(3)+' dB';}
$('swr').addEventListener('input',go);go();