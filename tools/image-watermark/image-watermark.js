const $=id=>document.getElementById(id);
var img=null;
function loadImage(src){var im=new Image();im.onload=function(){img=im;draw();};im.src=src;}
function readFile(f){if(!f)return;var r=new FileReader();r.onload=function(e){loadImage(e.target.result);};r.readAsDataURL(f);}
$('file').addEventListener('change',function(e){readFile(e.target.files[0]);});
var drop=document.querySelector('.sd-drop');
drop.addEventListener('dragover',function(e){e.preventDefault();});
drop.addEventListener('drop',function(e){e.preventDefault();readFile(e.dataTransfer.files[0]);});
function draw(){if(!img)return;var c=$('cv');c.width=img.width;c.height=img.height;var x=c.getContext('2d');x.drawImage(img,0,0);
var fs=Math.max(10,Math.round(img.width*(parseInt($('size').value)||5)/100));x.font='bold '+fs+'px sans-serif';
var pad=Math.round(fs*0.5);x.globalAlpha=(parseInt($('op').value)||60)/100;x.fillStyle=$('col').value;
var txt=$('txt').value;var w=x.measureText(txt).width;var px,py;x.textBaseline='alphabetic';
var pos=$('pos').value;
if(pos==='br'){px=c.width-w-pad;py=c.height-pad;}else if(pos==='bl'){px=pad;py=c.height-pad;}
else if(pos==='tr'){px=c.width-w-pad;py=fs+pad;}else if(pos==='tl'){px=pad;py=fs+pad;}
else{px=(c.width-w)/2;py=(c.height+fs/2)/2;}
x.fillText(txt,px,py);x.globalAlpha=1;
c.toBlob(function(b){if(!b)return;$('dl').href=URL.createObjectURL(b);$('dl').download='watermarked.png';$('dl').style.display='';});}
['txt','pos','size','col','op'].forEach(function(id){$(id).addEventListener('input',draw);$(id).addEventListener('change',draw);});