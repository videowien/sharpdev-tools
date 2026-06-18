const $=id=>document.getElementById(id);
var img=null,ar=1;
function loadImage(src){var im=new Image();im.onload=function(){img=im;ar=im.width/im.height;$('w').value=im.width;$('h').value=im.height;draw();};im.src=src;}
function readFile(f){if(!f)return;var r=new FileReader();r.onload=function(e){loadImage(e.target.result);};r.readAsDataURL(f);}
$('file').addEventListener('change',function(e){readFile(e.target.files[0]);});
var drop=document.querySelector('.sd-drop');
drop.addEventListener('dragover',function(e){e.preventDefault();});
drop.addEventListener('drop',function(e){e.preventDefault();readFile(e.dataTransfer.files[0]);});
$('w').addEventListener('input',function(){if($('lock').value==='1'&&img)$('h').value=Math.round((parseInt($('w').value)||0)/ar);draw();});
$('h').addEventListener('input',function(){if($('lock').value==='1'&&img)$('w').value=Math.round((parseInt($('h').value)||0)*ar);draw();});
$('lock').addEventListener('change',draw);
function draw(){if(!img)return;var w=Math.max(1,parseInt($('w').value)||img.width),h=Math.max(1,parseInt($('h').value)||img.height);var c=$('cv');c.width=w;c.height=h;var x=c.getContext('2d');x.clearRect(0,0,w,h);x.drawImage(img,0,0,w,h);c.toBlob(function(b){if(!b)return;$('dl').href=URL.createObjectURL(b);$('dl').download='resized-'+w+'x'+h+'.png';$('dl').style.display='';});}