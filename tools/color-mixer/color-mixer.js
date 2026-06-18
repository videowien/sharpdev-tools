const c1=document.getElementById('c1'),c2=document.getElementById('c2'),ratio=document.getElementById('ratio'),rv=document.getElementById('ratio-val'),sw=document.getElementById('result-swatch'),steps=document.getElementById('steps');
function hex2rgb(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function rgb2hex(r){return '#'+r.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');}
function mix(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
function lum(r){const[R,G,B]=r.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*R+0.7152*G+0.0722*B;}
function go(){
  const a=hex2rgb(c1.value),b=hex2rgb(c2.value),t=ratio.value/100;
  rv.textContent=ratio.value+'%';
  const res=mix(a,b,t),hx=rgb2hex(res);
  sw.style.background=hx;sw.style.color=lum(res)>0.4?'#000':'#fff';sw.textContent=hx;
  let html='';
  for(let i=0;i<=10;i++){const m=rgb2hex(mix(a,b,i/10));html+=`<div title="${m}" style="flex:1;height:40px;background:${m}"></div>`;}
  steps.innerHTML=html;
}
[c1,c2,ratio].forEach(e=>e.addEventListener('input',go));
document.getElementById('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(sw.textContent);});
go();