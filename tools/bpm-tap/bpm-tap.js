const $=id=>document.getElementById(id);
let times=[];
function tap(){const now=performance.now();if(times.length&&now-times[times.length-1]>2000)times=[];times.push(now);if(times.length>8)times.shift();
 $('taps').textContent=times.length;
 if(times.length>=2){const intervals=[];for(let i=1;i<times.length;i++)intervals.push(times[i]-times[i-1]);const avg=intervals.reduce((a,b)=>a+b,0)/intervals.length;const bpm=60000/avg;$('bpm').textContent=(Math.round(bpm*10)/10);$('round').textContent=Math.round(bpm);}}
$('tap').addEventListener('pointerdown',tap);
window.addEventListener('keydown',e=>{if(e.target.tagName!=='INPUT'&&e.target.tagName!=='BUTTON'){e.preventDefault();tap();}});
$('reset').addEventListener('click',()=>{times=[];$('bpm').textContent='—';$('round').textContent='—';$('taps').textContent='0';});