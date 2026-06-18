const $=id=>document.getElementById(id);
function clamp(v){return Math.max(0,Math.min(255,v));}
function shade(hex,amt){hex=hex.replace('#','');const r=clamp(parseInt(hex.slice(0,2),16)+amt),g=clamp(parseInt(hex.slice(2,4),16)+amt),b=clamp(parseInt(hex.slice(4,6),16)+amt);return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');}
function go(){
  const bg=$('bg').value,d=+$('dist').value,blur=+$('blur').value,inten=+$('intensity').value,rad=+$('radius').value,shape=$('shape').value;
  $('d-val').textContent=d;$('b-val').textContent=blur;$('i-val').textContent=inten;$('r-val').textContent=rad;
  const amt=Math.round(inten/100*255);
  const light=shade(bg,amt),dark=shade(bg,-amt);
  const inset=shape==='pressed'?'inset ':'';
  let bgcss=bg;
  if(shape==='concave')bgcss='linear-gradient(145deg, '+shade(bg,-amt)+', '+shade(bg,amt)+')';
  else if(shape==='convex')bgcss='linear-gradient(145deg, '+shade(bg,amt)+', '+shade(bg,-amt)+')';
  const shadow=inset+d+'px '+d+'px '+blur+'px '+dark+', '+inset+'-'+d+'px -'+d+'px '+blur+'px '+light;
  const css='border-radius: '+rad+'px;\nbackground: '+bgcss+';\nbox-shadow: '+shadow+';';
  const box=$('neu-box');box.style.cssText='width:120px;height:120px;'+css;
  $('neu-stage').style.background=bg;
  $('out').textContent='.neu {\n  '+css.replace(/\n/g,'\n  ')+'\n}';
}
['bg','dist','blur','intensity','radius','shape'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();