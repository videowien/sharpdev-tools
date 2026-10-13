const $=id=>document.getElementById(id);
function build(){var s=parseInt($('size').value)||40,c=$('col').value,t=parseInt($('thick').value)||4,sp=parseFloat($('speed').value)||0.8;
var css=['<div class="spinner"></div>','','<style>','.spinner {','  width: '+s+'px;','  height: '+s+'px;','  border: '+t+'px solid '+c+'33;','  border-top-color: '+c+';','  border-radius: 50%;','  animation: spin '+sp+'s linear infinite;','}','@keyframes spin { to { transform: rotate(360deg); } }','</style>'].join('\n');
$('out').value=css;
$('prev').style.cssText='width:'+s+'px;height:'+s+'px;border:'+t+'px solid '+c+'33;border-top-color:'+c+';border-radius:50%;animation:sdspin '+sp+'s linear infinite;';}
(function(){var st=document.createElement('style');st.textContent='@keyframes sdspin{to{transform:rotate(360deg)}}';document.head.appendChild(st);})();
Array.prototype.forEach.call(document.querySelectorAll('.page input'),function(el){el.addEventListener('input',build);});
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').value);});
build();