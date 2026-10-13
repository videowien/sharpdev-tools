const $=id=>document.getElementById(id);
var img=null;
function loadImage(src){var im=new Image();im.onload=function(){img=im;draw();};im.src=src;}
function readFile(f){if(!f)return;var r=new FileReader();r.onload=function(e){loadImage(e.target.result);};r.readAsDataURL(f);}
$('file').addEventListener('change',function(e){readFile(e.target.files[0]);});
var drop=document.querySelector('.sd-drop');
drop.addEventListener('dragover',function(e){e.preventDefault();});
drop.addEventListener('drop',function(e){e.preventDefault();readFile(e.dataTransfer.files[0]);});
function draw(){if(!img)return;var sz=Math.max(16,Math.min(2048,parseInt($('sz').value)||256));var c=$('cv');c.width=sz;c.height=sz;var x=c.getContext('2d');x.clearRect(0,0,sz,sz);
var side=Math.min(img.width,img.height);var sx=(img.width-side)/2,sy=(img.height-side)/2;
x.save();if($('shape').value==='circle'){x.beginPath();x.arc(sz/2,sz/2,sz/2,0,Math.PI*2);x.closePath();x.clip();}
x.drawImage(img,sx,sy,side,side,0,0,sz,sz);x.restore();
c.toBlob(function(b){if(!b)return;$('dl').href=URL.createObjectURL(b);$('dl').download='avatar.png';$('dl').style.display='';});}
['shape','sz'].forEach(function(id){$(id).addEventListener('input',draw);$(id).addEventListener('change',draw);});