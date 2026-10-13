const $=id=>document.getElementById(id);
const supported='BarcodeDetector' in window;
let detector=null,stream=null,scanning=false,raf=null;
if(!supported){$('unsupported').style.display='block';$('bcstatus').textContent='Barcode detection is not available in this browser.';}
else{detector=new BarcodeDetector();}
function show(codes){if(codes&&codes.length){$('val').textContent=codes[0].rawValue;$('fmt').textContent=(codes[0].format||'').replace(/_/g,' ');$('bcstatus').textContent='Barcode decoded.';}else{$('val').textContent='—';$('fmt').textContent='—';$('bcstatus').textContent='No barcode found. Try a sharper, straighter, closer image.';}}
async function fromImage(file){if(!supported||!file||!file.type.startsWith('image/'))return;try{const bmp=await createImageBitmap(file);show(await detector.detect(bmp));}catch(e){$('bcstatus').textContent='Could not read that image: '+e.message;}}
async function startCam(){if(!supported)return;if(scanning){stopCam();return;}try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});const v=$('bvid');v.srcObject=stream;v.style.display='';await v.play();scanning=true;$('startcam').textContent='Stop camera';$('bcstatus').textContent='Point the camera at a barcode…';loop();}catch(e){$('bcstatus').textContent='Could not access the camera: '+e.name+'.';}}
async function loop(){if(!scanning)return;try{const codes=await detector.detect($('bvid'));if(codes.length){show(codes);stopCam();return;}}catch(e){}raf=requestAnimationFrame(loop);}
function stopCam(){scanning=false;if(raf)cancelAnimationFrame(raf);if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}$('bvid').style.display='none';$('startcam').textContent='Use camera';}
const drop=$('drop'),file=$('file');
drop.addEventListener('click',()=>file.click());
drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over');});
drop.addEventListener('dragleave',()=>drop.classList.remove('over'));
drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');if(e.dataTransfer.files[0])fromImage(e.dataTransfer.files[0]);});
file.addEventListener('change',()=>{if(file.files[0])fromImage(file.files[0]);});
$('startcam').addEventListener('click',startCam);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('val').textContent));
window.addEventListener('pagehide',stopCam);