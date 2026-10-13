const $=id=>document.getElementById(id);
let stream=null,scanning=false,raf=null;
function decodeCanvas(cv){const ctx=cv.getContext('2d');const img=ctx.getImageData(0,0,cv.width,cv.height);const code=jsQR(img.data,img.width,img.height);return code?code.data:null;}
function show(text){if(text){$('result').value=text;$('qrstatus').textContent='QR code decoded'+(/^https?:\/\//i.test(text)?' (a link — check it before opening).':'.');}else{$('result').value='';$('qrstatus').textContent='No QR code found. Try a clearer or larger image.';}}
function handleImage(file){if(!file||!file.type.startsWith('image/')){$('qrstatus').textContent='Please choose an image file.';return;}const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const cv=document.createElement('canvas');cv.width=im.naturalWidth;cv.height=im.naturalHeight;cv.getContext('2d').drawImage(im,0,0);show(decodeCanvas(cv));};im.src=r.result;};r.readAsDataURL(file);}
async function startCam(){if(scanning){stopCam();return;}try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});const v=$('vid');v.srcObject=stream;v.style.display='';await v.play();scanning=true;$('startcam').textContent='Stop camera';$('qrstatus').textContent='Point the camera at a QR code…';loop();}catch(e){$('qrstatus').textContent='Could not access the camera: '+e.name+'.';}}
function loop(){if(!scanning)return;const v=$('vid');if(v.videoWidth){const cv=document.createElement('canvas');cv.width=v.videoWidth;cv.height=v.videoHeight;cv.getContext('2d').drawImage(v,0,0);const d=decodeCanvas(cv);if(d){show(d);stopCam();return;}}raf=requestAnimationFrame(loop);}
function stopCam(){scanning=false;if(raf)cancelAnimationFrame(raf);if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}$('vid').style.display='none';$('startcam').textContent='Use camera';}
const drop=$('drop'),file=$('file');
drop.addEventListener('click',()=>file.click());
drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over');});
drop.addEventListener('dragleave',()=>drop.classList.remove('over'));
drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');if(e.dataTransfer.files[0])handleImage(e.dataTransfer.files[0]);});
file.addEventListener('change',()=>{if(file.files[0])handleImage(file.files[0]);});
$('startcam').addEventListener('click',startCam);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('result').value));
window.addEventListener('pagehide',stopCam);
window.qrDecodeCanvas=decodeCanvas;