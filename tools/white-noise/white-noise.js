const $=id=>document.getElementById(id);
let ctx=null,src=null,gain=null,playing=false,stopT=null;
function makeNoise(type){const sr=ctx.sampleRate,len=sr*2,buf=ctx.createBuffer(1,len,sr),d=buf.getChannelData(0);
 if(type==='white'){for(let i=0;i<len;i++)d[i]=Math.random()*2-1;}
 else if(type==='pink'){let b0=0,b1=0,b2=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;b0=0.99765*b0+w*0.0990460;b1=0.96300*b1+w*0.2965164;b2=0.57000*b2+w*1.0526913;d[i]=(b0+b1+b2+w*0.1848)*0.16;}}
 else{let last=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+0.02*w)/1.02;d[i]=last*3.5;}}
 return buf;}
function start(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();ctx.resume();src=ctx.createBufferSource();src.buffer=makeNoise($('type').value);src.loop=true;gain=ctx.createGain();gain.gain.value=(+$('vol').value)/100*0.6;src.connect(gain);gain.connect(ctx.destination);src.start();playing=true;$('toggle').textContent='Stop';const m=+$('mins').value;if(m>0)stopT=setTimeout(stop,m*60000);}
function stop(){if(src){try{src.stop();}catch(e){}src.disconnect();src=null;}if(stopT){clearTimeout(stopT);stopT=null;}playing=false;$('toggle').textContent='Play';}
$('vol').addEventListener('input',()=>{if(gain)gain.gain.value=(+$('vol').value)/100*0.6;});
$('type').addEventListener('change',()=>{if(playing){stop();start();}});
$('toggle').addEventListener('click',()=>playing?stop():start());
window.addEventListener('pagehide',stop);