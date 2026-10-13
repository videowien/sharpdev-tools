const $=id=>document.getElementById(id);
let ctx=null,osc=null;
function play(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();ctx.resume();if(osc){try{osc.stop();}catch(e){}}
 const f1=+$('f1').value,f2=Math.max(1,+$('f2').value),dur=+$('dur').value,t=ctx.currentTime;
 osc=ctx.createOscillator();osc.type=$('wave').value;const g=ctx.createGain();g.gain.value=0.25;osc.connect(g);g.connect(ctx.destination);
 osc.frequency.setValueAtTime(f1,t);
 if($('mode').value==='log')osc.frequency.exponentialRampToValueAtTime(f2,t+dur);
 else osc.frequency.linearRampToValueAtTime(f2,t+dur);
 g.gain.setValueAtTime(0.25,t+dur-0.05);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
 osc.start(t);osc.stop(t+dur);$('play').textContent='Playing…';osc.onended=()=>{$('play').textContent='Play sweep';};}
$('play').addEventListener('click',play);
window.addEventListener('pagehide',()=>{if(osc){try{osc.stop();}catch(e){}}});