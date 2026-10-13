const $=id=>document.getElementById(id);
let imgName='image';
function ratioOf(svg){const vb=svg.match(/viewBox\s*=\s*["']\s*[\d.+-]+\s+[\d.+-]+\s+([\d.+-]+)\s+([\d.+-]+)/i);if(vb){const w=parseFloat(vb[1]),h=parseFloat(vb[2]);if(w>0&&h>0)return h/w;}const wm=svg.match(/width\s*=\s*["']([\d.]+)/i),hm=svg.match(/height\s*=\s*["']([\d.]+)/i);if(wm&&hm){const w=parseFloat(wm[1]),h=parseFloat(hm[1]);if(w>0&&h>0)return h/w;}return 1;}
function render(){const svg=$('svg').value;const w=Math.max(16,+$('w').value||512);const ratio=ratioOf(svg);const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});const url=URL.createObjectURL(blob);const im=new Image();im.onload=function(){const cv=$('cv');cv.width=w;cv.height=Math.round(w*ratio);const ctx=cv.getContext('2d');ctx.clearRect(0,0,cv.width,cv.height);if(!$('trans').checked){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,cv.width,cv.height);}ctx.drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(url);};im.onerror=function(){URL.revokeObjectURL(url);alert('Could not parse that SVG. Check the markup.');};im.src=url;}
$('render').addEventListener('click',render);
['svg','w','trans'].forEach(id=>$(id).addEventListener('input',render));
$('upload').addEventListener('change',function(){const f=this.files[0];if(!f)return;imgName=f.name.replace(/\.[^.]+$/,'');const r=new FileReader();r.onload=()=>{$('svg').value=r.result;render();};r.readAsText(f);});
$('dl').addEventListener('click',()=>{const a=document.createElement('a');a.href=$('cv').toDataURL('image/png');a.download=imgName+'.png';a.click();});
render();
