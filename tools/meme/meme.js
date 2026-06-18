const $=id=>document.getElementById(id);
var img=null;
function loadImage(src){var im=new Image();im.onload=function(){img=im;draw();};im.src=src;}
function readFile(f){if(!f)return;var r=new FileReader();r.onload=function(e){loadImage(e.target.result);};r.readAsDataURL(f);}
$('file').addEventListener('change',function(e){readFile(e.target.files[0]);});
var drop=document.querySelector('.sd-drop');drop.addEventListener('dragover',function(e){e.preventDefault();});drop.addEventListener('drop',function(e){e.preventDefault();readFile(e.dataTransfer.files[0]);});
function line(x,txt,y){if(!txt)return;txt=txt.toUpperCase();x.fillText(txt,x.canvas.width/2,y);x.strokeText(txt,x.canvas.width/2,y);}
function draw(){if(!img)return;var c=$('cv');c.width=img.width;c.height=img.height;var x=c.getContext('2d');x.drawImage(img,0,0);
var fs=Math.max(12,Math.round(img.height*(parseInt($('size').value)||10)/100));
x.font='900 '+fs+'px Impact, "Arial Black", sans-serif';x.textAlign='center';x.textBaseline='alphabetic';
x.fillStyle='#fff';x.strokeStyle='#000';x.lineWidth=Math.max(2,fs/12);x.lineJoin='round';
line(x,$('top').value,fs+8);line(x,$('bot').value,c.height-12);
c.toBlob(function(b){if(!b)return;$('dl').href=URL.createObjectURL(b);$('dl').download='meme.png';$('dl').style.display='';});}
['top','bot','size'].forEach(function(id){$(id).addEventListener('input',draw);});