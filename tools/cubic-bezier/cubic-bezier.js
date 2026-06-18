const cv=document.getElementById('cv'),ctx=cv.getContext('2d'),out=document.getElementById('out'),ball=document.getElementById('ball');
const W=280,H=280,P=40;
let p1={x:0.25,y:0.1},p2={x:0.25,y:1.0};
const PRES={'ease':[.25,.1,.25,1],'linear':[0,0,1,1],'ease-in':[.42,0,1,1],'ease-out':[0,0,.58,1],'ease-in-out':[.42,0,.58,1],'bounce':[.68,-0.55,.27,1.55]};
function mx(x){return P+x*(W-2*P);}
function my(y){return (H-P)-y*(H-2*P);}
function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle='#222';ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const v=i/4;ctx.beginPath();ctx.moveTo(mx(0),my(v));ctx.lineTo(mx(1),my(v));ctx.moveTo(mx(v),my(0));ctx.lineTo(mx(v),my(1));ctx.stroke();}
  ctx.strokeStyle='#444';ctx.beginPath();ctx.moveTo(mx(0),my(0));ctx.lineTo(mx(1),my(1));ctx.stroke();
  ctx.strokeStyle='#ff4444';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx(0),my(0));
  for(let t=0;t<=1;t+=0.01){const u=1-t;const x=3*u*u*t*p1.x+3*u*t*t*p2.x+t*t*t;const y=3*u*u*t*p1.y+3*u*t*t*p2.y+t*t*t;ctx.lineTo(mx(x),my(y));}
  ctx.stroke();
  for(const[p,c]of[[p1,'#4488ff'],[p2,'#44dd88']]){
    ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.beginPath();
    ctx.moveTo(mx(p===p1?0:1),my(p===p1?0:1));ctx.lineTo(mx(p.x),my(p.y));ctx.stroke();
    ctx.fillStyle=c;ctx.beginPath();ctx.arc(mx(p.x),my(p.y),7,0,7);ctx.fill();
  }
}
function val(){return 'cubic-bezier('+[p1.x,p1.y,p2.x,p2.y].map(n=>Math.round(n*100)/100).join(', ')+')';}
function update(){draw();out.textContent=val();}
let drag=null;
function pos(e){const r=cv.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left-P)/(W-2*P),y:((H-P)-(t.clientY-r.top))/(H-2*P)};}
function down(e){const m=pos(e);const d1=Math.hypot(m.x-p1.x,m.y-p1.y),d2=Math.hypot(m.x-p2.x,m.y-p2.y);drag=d1<d2?p1:p2;move(e);}
function move(e){if(!drag)return;e.preventDefault();const m=pos(e);drag.x=Math.max(0,Math.min(1,m.x));drag.y=Math.max(-0.9,Math.min(1.9,m.y));update();}
function up(){drag=null;}
cv.addEventListener('mousedown',down);window.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);
const presetWrap=document.getElementById('presets');
Object.keys(PRES).forEach(k=>{const b=document.createElement('button');b.className='cb-preset';b.textContent=k;b.onclick=()=>{const[a,bb,c,d]=PRES[k];p1={x:a,y:bb};p2={x:c,y:d};update();};presetWrap.appendChild(b);});
function play(){ball.style.transition='none';ball.style.left='6px';requestAnimationFrame(()=>{requestAnimationFrame(()=>{ball.style.transition='left 1.1s '+val();ball.style.left='calc(100% - 30px)';});});}
document.getElementById('play').addEventListener('click',play);
document.getElementById('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(val());});
update();