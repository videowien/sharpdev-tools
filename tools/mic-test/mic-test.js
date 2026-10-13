const $=id=>document.getElementById(id);
let stream=null,ctx=null,raf=null;
(function(){const b=$('bars');for(let i=0;i<32;i++)b.appendChild(document.createElement('div'));})();
async function start(){try{stream=await navigator.mediaDevices.getUserMedia({audio:true,video:false});ctx=new (window.AudioContext||window.webkitAudioContext)();const src=ctx.createMediaStreamSource(stream);const an=ctx.createAnalyser();an.fftSize=64;src.connect(an);const data=new Uint8Array(an.frequencyBinCount);const bars=$('bars').children;$('micstatus').textContent='Microphone running. Speak and watch the meter move.';$('start').disabled=true;$('stop').disabled=false;
 function loop(){an.getByteFrequencyData(data);let sum=0;for(let i=0;i<data.length;i++){sum+=data[i];if(bars[i])bars[i].style.height=Math.max(2,data[i]/255*80)+'px';}const lvl=Math.round(sum/data.length/255*100*2.2);const p=Math.min(100,lvl);$('fill').style.width=p+'%';$('pct').textContent=p+'%';raf=requestAnimationFrame(loop);}loop();
 }catch(e){$('micstatus').textContent='Could not access the microphone: '+e.name+'. Check that a mic is connected and that you allowed access.';}}
function stop(){if(raf)cancelAnimationFrame(raf);if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}if(ctx){ctx.close();ctx=null;}$('fill').style.width='0%';$('pct').textContent='0%';$('start').disabled=false;$('stop').disabled=true;$('micstatus').textContent='Microphone stopped.';}
$('start').addEventListener('click',start);$('stop').addEventListener('click',stop);
window.addEventListener('pagehide',stop);