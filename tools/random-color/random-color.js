const $=id=>document.getElementById(id);
function rand(){const b=crypto.getRandomValues(new Uint8Array(3));return b;}
function hex(b){return '#'+[...b].map(x=>x.toString(16).padStart(2,'0')).join('');}
function lum(b){const[r,g,bl]=[...b].map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*r+0.7152*g+0.0722*bl;}
function go(){const n=Math.min(40,Math.max(1,+$('count').value||1));let html='';
for(let i=0;i<n;i++){const b=rand(),h=hex(b),txt=lum(b)>0.4?'#000':'#fff';
html+=`<div onclick="navigator.clipboard&&navigator.clipboard.writeText('${h}')" title="Click to copy" style="cursor:pointer;height:90px;border-radius:8px;border:1px solid #2a2a2a;background:${h};color:${txt};display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;font-family:monospace;font-size:13px">${h}</div>`;}
$('out').innerHTML=html;}
$('gen').addEventListener('click',go);go();