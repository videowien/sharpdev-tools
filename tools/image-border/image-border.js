const $=id=>document.getElementById(id);
let img=null,imgName='image';
function loadFile(f){if(!f||!f.type.startsWith('image/')){alert('Please choose an image file.');return;}imgName=(f.name||'image').replace(/\.[^.]+$/,'');const r=new FileReader();r.onload=()=>loadImage(r.result);r.readAsDataURL(f);}
function loadImage(dataUrl){img=new Image();img.onload=function(){$('drop').style.display='none';$('editor').style.display='';render();};img.src=dataUrl;}
function render(){const cv=$('cv'),ctx=cv.getContext('2d');const bw=Math.max(0,+$('bw').value||0),col=$('col').value;const w=img.naturalWidth,h=img.naturalHeight;cv.width=w+2*bw;cv.height=h+2*bw;ctx.fillStyle=col;ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(img,bw,bw);}
['bw','col'].forEach(id=>$(id).addEventListener('input',function(){if(img)render();}));

(function(){const drop=$('drop'),file=$('file');drop.addEventListener('click',()=>file.click());drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over');});drop.addEventListener('dragleave',()=>drop.classList.remove('over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');if(e.dataTransfer.files[0])loadFile(e.dataTransfer.files[0]);});file.addEventListener('change',()=>{if(file.files[0])loadFile(file.files[0]);});$('reset').addEventListener('click',()=>{img=null;$('editor').style.display='none';drop.style.display='';file.value='';});$('dl').addEventListener('click',()=>{const a=document.createElement('a');a.href=$('cv').toDataURL('image/png');a.download=imgName+'.png';a.click();});})();
