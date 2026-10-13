const $=id=>document.getElementById(id);
let state='idle',t0=0,tid=null,times=[];
const z=$('rt');
function set(cls,main,sub){z.className='rt-zone '+cls;z.querySelector('.rt-main').textContent=main;z.querySelector('.rt-sub').textContent=sub;}
function arm(){state='wait';set('wait','Wait for green...','');tid=setTimeout(function(){state='ready';t0=performance.now();set('ready','CLICK!','');},1000+Math.random()*3000);}
function result(ms){times.push(ms);const best=Math.min.apply(null,times);const avg=times.reduce((a,b)=>a+b,0)/times.length;$('last').textContent=Math.round(ms)+' ms';$('avg').textContent=Math.round(avg)+' ms';$('bestr').textContent=Math.round(best)+' ms';$('tries').textContent=times.length;set('result',Math.round(ms)+' ms','Click to try again');state='result';}
z.addEventListener('click',function(){
 if(state==='idle'||state==='result'){arm();return;}
 if(state==='wait'){clearTimeout(tid);set('early','Too soon!','Click to try again');state='result';return;}
 if(state==='ready'){result(performance.now()-t0);}
});