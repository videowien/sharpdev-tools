const $=id=>document.getElementById(id);
function fmt(r){if(!isFinite(r))return '—';if(r>=1e6)return (Math.round(r/1e3)/1e3)+' MΩ';if(r>=1e3)return (Math.round(r/10)/100)+' kΩ';return (Math.round(r*1000)/1000)+' Ω';}
function go(){const vals=($('in').value.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number).filter(v=>v>0);
 if(!vals.length){['par','ser','cnt'].forEach(id=>$(id).textContent='—');return;}
 const series=vals.reduce((a,b)=>a+b,0);const parallel=1/vals.reduce((a,b)=>a+1/b,0);
 $('par').textContent=fmt(parallel);$('ser').textContent=fmt(series);$('cnt').textContent=vals.length;}
$('in').addEventListener('input',go);go();