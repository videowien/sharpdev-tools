const $=id=>document.getElementById(id);
let ctx=null,running=false,beat=0,nextT=0,timer=null;
function clickAt(t,accent){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=accent?1600:1000;o.connect(g);g.connect(ctx.destination);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.5,t+0.001);g.gain.exponentialRampToValueAtTime(0.0001,t+0.05);o.start(t);o.stop(t+0.06);
 const flashIn=Math.max(0,(t-ctx.currentTime)*1000);setTimeout(()=>{const d=$('dot');d.className='dot on'+(accent?' accent':'');setTimeout(()=>{d.className='dot';},80);},flashIn);}
function sched(){const bpm=+$('bpm').value,per=+$('sig').value,spb=60/bpm;while(nextT<ctx.currentTime+0.12){clickAt(nextT,beat%per===0);beat++;nextT+=spb;}}
function start(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();ctx.resume();running=true;beat=0;nextT=ctx.currentTime+0.06;timer=setInterval(sched,25);$('toggle').textContent='Stop';}
function stop(){running=false;clearInterval(timer);$('toggle').textContent='Start';$('dot').className='dot';}
$('bpm').addEventListener('input',()=>{$('bpmval').textContent=$('bpm').value;});
$('toggle').addEventListener('click',()=>running?stop():start());
window.addEventListener('pagehide',stop);