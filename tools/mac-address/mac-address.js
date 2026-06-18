const $=id=>document.getElementById(id);
function octet(){return Math.floor(Math.random()*256);}
function mac(sep,upper){const o=[octet(),octet(),octet(),octet(),octet(),octet()];o[0]=(o[0]&0xFE)|0x02;let hex=o.map(b=>b.toString(16).padStart(2,'0'));if(upper)hex=hex.map(h=>h.toUpperCase());if(sep==='.'){return hex.join('').replace(/(.{4})(?=.)/g,'$1.');}return hex.join(sep);}
function gen(){const sep=$('sep').value;const upper=$('case').value==='upper';const count=Math.min(100,Math.max(1,parseInt($('count').value)||1));const out=[];for(let i=0;i<count;i++)out.push(mac(sep,upper));$('out').value=out.join('\n');}
['gen'].forEach(id=>$(id).addEventListener('click',gen));['sep','case','count'].forEach(id=>{$(id).addEventListener('change',gen);$(id).addEventListener('input',gen);});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
gen();