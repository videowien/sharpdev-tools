const $=id=>document.getElementById(id);
function isoWeek(y,m,d){const dt=new Date(Date.UTC(y,m-1,d));const dow=(dt.getUTCDay()+6)%7;dt.setUTCDate(dt.getUTCDate()-dow+3);const thursday=dt.getTime();const isoYear=dt.getUTCFullYear();const j4=new Date(Date.UTC(isoYear,0,4));const dow2=(j4.getUTCDay()+6)%7;j4.setUTCDate(j4.getUTCDate()-dow2+3);const week=1+Math.round((thursday-j4.getTime())/604800000);return {week:week,isoYear:isoYear};}
function go(){const v=$('d').value;if(!v){$('out').textContent='Pick a date.';return;}const [y,m,d]=v.split('-').map(Number);const r=isoWeek(y,m,d);
$('out').innerHTML='<div style="font-size:22px;color:#fff;">ISO week <b style="color:#ff6666;">'+r.week+'</b> of '+r.isoYear+'</div>'
+'<div style="color:#888;font-size:13px;margin-top:8px;">Written as '+r.isoYear+'-W'+String(r.week).padStart(2,'0')+'</div>';}
$('d').addEventListener('input',go);
(function(){const t=new Date();$('d').value=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');go();})();