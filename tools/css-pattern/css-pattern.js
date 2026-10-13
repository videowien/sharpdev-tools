const $=id=>document.getElementById(id);
function gen(){
 const t=$('type').value,s=+$('size').value||24,fg=$('fg').value,bg=$('bg').value;
 let img,size=s+'px '+s+'px';
 const d=(s*0.18).toFixed(1),q=(s*0.25).toFixed(1),h=(s*0.5).toFixed(1),v=(s*0.1).toFixed(1);
 if(t==='dots'){img='radial-gradient('+fg+' '+d+'px, transparent '+d+'px)';}
 else if(t==='grid'){img='linear-gradient('+fg+' 1px, transparent 1px), linear-gradient(90deg, '+fg+' 1px, transparent 1px)';}
 else if(t==='stripes'){img='repeating-linear-gradient(45deg, '+fg+' 0, '+fg+' '+q+'px, transparent '+q+'px, transparent '+h+'px)';size='auto';}
 else if(t==='vlines'){img='repeating-linear-gradient(90deg, '+fg+' 0, '+fg+' '+v+'px, transparent '+v+'px, transparent '+s+'px)';size='auto';}
 else{img='conic-gradient('+fg+' 0deg 90deg, transparent 90deg 180deg, '+fg+' 180deg 270deg, transparent 270deg 360deg)';}
 $('prev').style.backgroundColor=bg;$('prev').style.backgroundImage=img;$('prev').style.backgroundSize=size;
 $('code').value='background-color: '+bg+';\nbackground-image: '+img+';'+(size!=='auto'?'\nbackground-size: '+size+';':'');
}
['type','size','fg','bg'].forEach(id=>{$(id).addEventListener('input',gen);$(id).addEventListener('change',gen);});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('code').value));
gen();