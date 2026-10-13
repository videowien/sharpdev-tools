const $=id=>document.getElementById(id);
let ctx=null,osc=null,gain=null,playing=false;
function setFreq(){const f=+$('freq').value;$('hz').textContent=(f>=1000?(f/1000)+' kHz':f+' Hz');if(osc)osc.frequency.value=f;}
function start(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();ctx.resume();osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=+$('freq').value;gain=ctx.createGain();gain.gain.value=(+$('vol').value)/100*0.5;osc.connect(gain);gain.connect(ctx.destination);osc.start();playing=true;$('toggle').textContent='Stop';}
function stop(){if(osc){try{osc.stop();}catch(e){}osc.disconnect();osc=null;}playing=false;$('toggle').textContent='Play tone';}
$('freq').addEventListener('input',setFreq);
$('vol').addEventListener('input',()=>{if(gain)gain.gain.value=(+$('vol').value)/100*0.5;});
$('toggle').addEventListener('click',()=>playing?stop():start());
window.addEventListener('pagehide',stop);setFreq();