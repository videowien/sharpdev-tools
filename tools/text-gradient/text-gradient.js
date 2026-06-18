const $=id=>document.getElementById(id);
function build(){var ang=parseInt($('ang').value)||90,c1=$('c1').value,c2=$('c2').value,grad='linear-gradient('+ang+'deg, '+c1+', '+c2+')';
var L=['.gradient-text {','  background: '+grad+';','  -webkit-background-clip: text;','  background-clip: text;','  -webkit-text-fill-color: transparent;','  color: transparent;','}'];
$('out').value=L.join('\n');
var p=$('prev');p.textContent=$('txt').value||'Gradient';p.style.cssText='font-size:42px;font-weight:800;background:'+grad+';-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;';}
Array.prototype.forEach.call(document.querySelectorAll('.page input'),function(el){el.addEventListener('input',build);});
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').value);});
build();