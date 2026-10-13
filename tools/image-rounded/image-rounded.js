const $=id=>document.getElementById(id);
let img=null,imgName='image';
function loadFile(f){if(!f||!f.type.startsWith('image/')){alert('Please choose an image file.');return;}imgName=(f.name||'image').replace(/\.[^.]+$/,'');const r=new FileReader();r.onload=()=>loadImage(r.result);r.readAsDataURL(f);}
function loadImage(dataUrl){img=new Image();img.onload=function(){$('drop').style.display='none';$('editor').style.display='';render();};img.src=dataUrl;}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function render(){const cv=$('cv'),ctx=cv.getContext('2d');const w=img.naturalWidth,h=img.naturalHeight;cv.width=w;cv.height=h;const r=Math.min(w,h)*(+$('rad').value)/100/2;ctx.clearRect(0,0,w,h);ctx.save();roundRect(ctx,0,0,w,h,r);ctx.clip();ctx.drawImage(img,0,0);ctx.restore();}
$('rad').addEventListener('input',function(){if(img)render();});

(function(){const drop=$('drop'),file=$('file');drop.addEventListener('click',()=>file.click());drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over');});drop.addEventListener('dragleave',()=>drop.classList.remove('over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');if(e.dataTransfer.files[0])loadFile(e.dataTransfer.files[0]);});file.addEventListener('change',()=>{if(file.files[0])loadFile(file.files[0]);});$('reset').addEventListener('click',()=>{img=null;$('editor').style.display='none';drop.style.display='';file.value='';});$('dl').addEventListener('click',()=>{const a=document.createElement('a');a.href=$('cv').toDataURL('image/png');a.download=imgName+'.png';a.click();});})();
