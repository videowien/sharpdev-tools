const $=id=>document.getElementById(id);
function parseT(s){s=(s||'').trim();if(!s)return NaN;if(s.indexOf('/')>=0){const p=s.split('/');return (+p[0])/(+p[1]);}return +s;}
function fmtT(t){if(!isFinite(t)||t<=0)return '-';
 if(t>=3600){const h=Math.floor(t/3600),m=Math.round((t%3600)/60);return h+' h '+m+' min';}
 if(t>=60){const m=Math.floor(t/60),s=Math.round(t%60);return m+' min '+s+' s';}
 if(t>=1)return (Math.round(t*100)/100)+' s';
 return '1/'+Math.round(1/t)+' s';}
function go(){const base=parseT($('base').value),stops=+$('stops').value;
 if(!(base>0)||!isFinite(stops)){$('out').textContent='-';return;}
 $('out').textContent=fmtT(base*Math.pow(2,stops));}
$('nd').addEventListener('change',function(){if(this.value!=='')$('stops').value=this.value;go();});
['base','stops'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();