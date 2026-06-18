const $=id=>document.getElementById(id);
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
function go(){const v=$('d').value;if(!v){$('out').textContent='Pick a date.';return;}
const [y,m,d]=v.split('-').map(Number);const dt=new Date(Date.UTC(y,m-1,d));
const wd=DAYS[dt.getUTCDay()];const start=Date.UTC(y,0,1);const doy=Math.floor((dt-start)/86400000)+1;
$('out').innerHTML='<div style="font-size:22px;color:#fff;">'+MON[m-1]+' '+d+', '+y+' was a <b style="color:#ff6666;">'+wd+'</b></div>'
+'<div style="color:#888;font-size:13px;margin-top:8px;">Day '+doy+' of '+y+'</div>';}
$('d').addEventListener('input',go);go();