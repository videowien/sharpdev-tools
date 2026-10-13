const $=id=>document.getElementById(id);
let dur=5,running=false,done=false,clicks=0,startT=0,timer=null,best=0;
function setDur(d){dur=d;document.querySelectorAll('#durs [data-d]').forEach(b=>b.classList.toggle('active',+b.dataset.d===d));if(!running)reset();}
function reset(){running=false;done=false;clicks=0;clearInterval(timer);$('zone').className='cps-zone';$('zone').textContent='Click here to start';$('clicks').textContent='0';$('cps').textContent='0.0';$('tleft').textContent=dur.toFixed(1)+'s';}
function finish(){running=false;done=true;clearInterval(timer);const cps=clicks/dur;$('cps').textContent=cps.toFixed(2);$('tleft').textContent='0.0s';$('clicks').textContent=clicks;$('zone').className='cps-zone done';$('zone').innerHTML='<div><div class="big">'+cps.toFixed(2)+' CPS</div><div style="font-size:14px;color:#aaa;margin-top:8px;">'+clicks+' clicks in '+dur+'s, click to retry</div></div>';if(cps>best){best=cps;$('best').textContent=best.toFixed(2);}}
function tick(){const left=Math.max(0,dur-(performance.now()-startT)/1000);$('tleft').textContent=left.toFixed(1)+'s';if(left<=0)finish();}
$('zone').addEventListener('click',function(){if(done){reset();return;}if(!running){running=true;clicks=0;startT=performance.now();$('zone').className='cps-zone run';$('zone').innerHTML='<div><div class="big" id="livecount">0</div><div style="font-size:14px;color:#aaa;margin-top:8px;">keep clicking!</div></div>';timer=setInterval(tick,50);}clicks++;const lc=$('livecount');if(lc)lc.textContent=clicks;$('clicks').textContent=clicks;$('cps').textContent=(clicks/dur).toFixed(2);});
document.querySelectorAll('#durs [data-d]').forEach(b=>b.addEventListener('click',()=>setDur(+b.dataset.d)));
$('reset').addEventListener('click',reset);
setDur(5);