const $=id=>document.getElementById(id);
var img=null;
var SETS={detailed:"@%#*+=-:. ",simple:"#+-. ",blocks:"█▓▒░ "};
function loadImage(src){var im=new Image();im.onload=function(){img=im;render();};im.src=src;}
function readFile(f){if(!f)return;var r=new FileReader();r.onload=function(e){loadImage(e.target.result);};r.readAsDataURL(f);}
$('file').addEventListener('change',function(e){readFile(e.target.files[0]);});
var drop=document.querySelector('.sd-drop');
drop.addEventListener('dragover',function(e){e.preventDefault();});
drop.addEventListener('drop',function(e){e.preventDefault();readFile(e.dataTransfer.files[0]);});
function render(){if(!img)return;var cols=Math.max(20,Math.min(300,parseInt($('cols').value)||100));
var rows=Math.max(1,Math.round(cols*(img.height/img.width)*0.5));
var c=document.createElement('canvas');c.width=cols;c.height=rows;var x=c.getContext('2d');x.drawImage(img,0,0,cols,rows);
var d=x.getImageData(0,0,cols,rows).data;var ramp=SETS[$('set').value];var inv=$('inv').value==='1';
var out='';for(var yy=0;yy<rows;yy++){var line='';for(var xx=0;xx<cols;xx++){var i=(yy*cols+xx)*4;var lum=(0.299*d[i]+0.587*d[i+1]+0.114*d[i+2])/255;if(inv)lum=1-lum;var idx=Math.min(ramp.length-1,Math.floor(lum*(ramp.length-1)));line+=ramp[idx];}out+=line+'\n';}
$('out').textContent=out;}
['cols','set','inv'].forEach(function(id){$(id).addEventListener('input',render);$(id).addEventListener('change',render);});
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').textContent);});