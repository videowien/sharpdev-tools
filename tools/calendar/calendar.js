const $=id=>document.getElementById(id);
const MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function build(){var m=parseInt($('m').value),y=parseInt($('y').value)||2026,st=parseInt($('start').value);
var first=new Date(Date.UTC(y,m,1)).getUTCDay();var offset=(first-st+7)%7;var days=new Date(Date.UTC(y,m+1,0)).getUTCDate();
var head=[];for(var i=0;i<7;i++)head.push('<th>'+DOW[(st+i)%7]+'</th>');
var cells=[];for(var i=0;i<offset;i++)cells.push('<td class="empty"></td>');
for(var d=1;d<=days;d++)cells.push('<td>'+d+'</td>');
while(cells.length%7)cells.push('<td class="empty"></td>');
var rows=[];for(var i=0;i<cells.length;i+=7)rows.push('<tr>'+cells.slice(i,i+7).join('')+'</tr>');
$('cal').innerHTML='<h2 style="color:#fff;text-align:center;margin:6px 0 4px;">'+MON[m]+' '+y+'</h2><table class="cal"><thead><tr>'+head.join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table>';}
$('m').innerHTML=MON.map(function(n,i){return '<option value="'+i+'">'+n+'</option>';}).join('');
(function(){var t=new Date();$('m').value=t.getMonth();$('y').value=t.getFullYear();})();
['m','y','start'].forEach(function(id){$(id).addEventListener('input',build);$(id).addEventListener('change',build);});
$('print').addEventListener('click',function(){window.print();});
build();