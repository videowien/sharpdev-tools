const $=id=>document.getElementById(id);
let ctx=null,oL=null,oR=null,playing=false;
function freqs(){const base=+$('base').value,beat=+$('beat').value;return [base,base+beat];}
function show(){const f=freqs();$('lf').textContent=f[0]+' Hz';$('rf').textContent=f[1]+' Hz';}
function start(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();ctx.resume();const [l,r]=freqs();
 const g=ctx.createGain();g.gain.value=0.25;g.connect(ctx.destination);
 const merger=ctx.createChannelMerger(2);
 oL=ctx.createOscillator();oL.frequency.value=l;const gL=ctx.createGain();gL.gain.value=0.25;oL.connect(gL);gL.connect(merger,0,0);
 oR=ctx.createOscillator();oR.frequency.value=r;const gR=ctx.createGain();gR.gain.value=0.25;oR.connect(gR);gR.connect(merger,0,1);
 merger.connect(ctx.destination);oL.start();oR.start();playing=true;$('toggle').textContent='Stop';show();}
function stop(){[oL,oR].forEach(o=>{if(o){try{o.stop();}catch(e){}o.disconnect();}});oL=oR=null;playing=false;$('toggle').textContent='Play';}
$('preset').addEventListener('change',()=>{$('beat').value=$('preset').value;if(playing){stop();start();}else show();});
['base','beat'].forEach(id=>$(id).addEventListener('input',()=>{if(playing){stop();start();}else show();}));
$('toggle').addEventListener('click',()=>playing?stop():start());
window.addEventListener('pagehide',stop);show();