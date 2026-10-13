const $=id=>document.getElementById(id);
function fmtH(h){if(!isFinite(h)||h<=0)return '—';const d=Math.floor(h/24),hr=Math.floor(h%24),m=Math.round((h%1)*60);let s='';if(d)s+=d+'d ';if(hr||d)s+=hr+'h ';s+=m+'m';return s.trim()+'  ('+(Math.round(h*100)/100)+' h)';}
function go(){const cap=+$('cap').value,load=+$('load').value,eff=(+$('eff').value)/100;
 if(!(cap>0&&load>0)){$('rt').textContent='—';$('ideal').textContent='—';return;}
 const ideal=cap/load;$('ideal').textContent=fmtH(ideal);$('rt').textContent=fmtH(ideal*eff);}
['cap','load','eff'].forEach(id=>$(id).addEventListener('input',go));go();