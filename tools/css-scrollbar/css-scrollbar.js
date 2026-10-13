const $=id=>document.getElementById(id);
function build(){var w=parseInt($('w').value)||10,tr=$('track').value,th=$('thumb').value,r=parseInt($('rad').value)||6;
var L=['/* WebKit (Chrome, Safari, Edge) */','.scrollbox::-webkit-scrollbar { width: '+w+'px; }','.scrollbox::-webkit-scrollbar-track { background: '+tr+'; }','.scrollbox::-webkit-scrollbar-thumb { background: '+th+'; border-radius: '+r+'px; }','','/* Firefox */','.scrollbox { scrollbar-width: thin; scrollbar-color: '+th+' '+tr+'; }'];
$('out').value=L.join('\n');
var id='sdsb-style';var old=document.getElementById(id);if(old)old.remove();
var st=document.createElement('style');st.id=id;st.textContent='#prev::-webkit-scrollbar{width:'+w+'px}#prev::-webkit-scrollbar-track{background:'+tr+'}#prev::-webkit-scrollbar-thumb{background:'+th+';border-radius:'+r+'px}#prev{scrollbar-width:thin;scrollbar-color:'+th+' '+tr+'}';document.head.appendChild(st);}
Array.prototype.forEach.call(document.querySelectorAll('.page input'),function(el){el.addEventListener('input',build);});
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').value);});
build();