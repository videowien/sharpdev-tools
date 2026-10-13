const $=id=>document.getElementById(id);
const ROW=[697,770,852,941],COL=[1209,1336,1477];
const KEYS=[['1',0,0],['2',0,1],['3',0,2],['4',1,0],['5',1,1],['6',1,2],['7',2,0],['8',2,1],['9',2,2],['*',3,0],['0',3,1],['#',3,2]];
let ctx=null;
function tone(low,high,dur){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();ctx.resume();const t=ctx.currentTime,g=ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.3,t+0.01);g.gain.setValueAtTime(0.3,t+dur-0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);g.connect(ctx.destination);[low,high].forEach(f=>{const o=ctx.createOscillator();o.frequency.value=f;o.connect(g);o.start(t);o.stop(t+dur);});}
function press(k,r,c){tone(ROW[r],COL[c],0.18);$('dialed').value+=k;}
(function(){const pad=$('pad');KEYS.forEach(([k,r,c])=>{const b=document.createElement('button');b.textContent=k;b.dataset.k=k;b.dataset.r=r;b.dataset.c=c;b.addEventListener('click',()=>press(k,r,c));pad.appendChild(b);});})();
$('clear').addEventListener('click',()=>$('dialed').value='');
$('playseq').addEventListener('click',()=>{const s=$('dialed').value;let i=0;(function next(){if(i>=s.length)return;const key=KEYS.find(x=>x[0]===s[i]);if(key)tone(ROW[key[1]],COL[key[2]],0.18);i++;setTimeout(next,250);})();});
window.dtmfFreqs=(k)=>{const key=KEYS.find(x=>x[0]===k);return key?[ROW[key[1]],COL[key[2]]]:null;};