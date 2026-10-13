const $=id=>document.getElementById(id);
const area=$('area');const dots={};let maxSeen=0;
function pos(e){const r=area.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
function upd(){const n=Object.keys(dots).length;$('count').textContent=n;if(n>maxSeen){maxSeen=n;$('max').textContent=maxSeen;}}
function down(e){const h=area.querySelector('.hint');if(h)h.style.display='none';const p=pos(e);const d=document.createElement('div');d.className='touch-dot';d.textContent=e.pointerId;d.style.left=p.x+'px';d.style.top=p.y+'px';area.appendChild(d);dots[e.pointerId]=d;$('last').textContent=Math.round(p.x)+', '+Math.round(p.y);upd();area.setPointerCapture&&area.setPointerCapture(e.pointerId);}
function move(e){const d=dots[e.pointerId];if(!d)return;const p=pos(e);d.style.left=p.x+'px';d.style.top=p.y+'px';$('last').textContent=Math.round(p.x)+', '+Math.round(p.y);}
function up(e){const d=dots[e.pointerId];if(d){d.remove();delete dots[e.pointerId];}upd();}
area.addEventListener('pointerdown',down);area.addEventListener('pointermove',move);
area.addEventListener('pointerup',up);area.addEventListener('pointercancel',up);area.addEventListener('pointerleave',up);