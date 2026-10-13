const $=id=>document.getElementById(id);
let img=null,imgName='image';
function loadFile(f){if(!f||!f.type.startsWith('image/')){alert('Please choose an image file.');return;}imgName=(f.name||'image').replace(/\.[^.]+$/,'');const r=new FileReader();r.onload=()=>loadImage(r.result);r.readAsDataURL(f);}
function loadImage(dataUrl){img=new Image();img.onload=function(){$('drop').style.display='none';$('editor').style.display='';render();};img.src=dataUrl;}
function render(){const cv=$('cv'),ctx=cv.getContext('2d');cv.width=img.naturalWidth;cv.height=img.naturalHeight;ctx.clearRect(0,0,cv.width,cv.height);ctx.filter='blur('+(+$('rad').value)+'px)';ctx.drawImage(img,0,0);ctx.filter='none';}
$('rad').addEventListener('input',function(){if(img)render();});

(function(){const drop=$('drop'),file=$('file');drop.addEventListener('click',()=>file.click());drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over');});drop.addEventListener('dragleave',()=>drop.classList.remove('over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');if(e.dataTransfer.files[0])loadFile(e.dataTransfer.files[0]);});file.addEventListener('change',()=>{if(file.files[0])loadFile(file.files[0]);});$('reset').addEventListener('click',()=>{img=null;$('editor').style.display='none';drop.style.display='';file.value='';});$('dl').addEventListener('click',()=>{const a=document.createElement('a');a.href=$('cv').toDataURL('image/png');a.download=imgName+'.png';a.click();});})();
