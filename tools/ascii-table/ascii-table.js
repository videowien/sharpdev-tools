const $=id=>document.getElementById(id);
const NAMES={0:'NUL',7:'BEL',8:'BS',9:'TAB',10:'LF',13:'CR',27:'ESC',32:'Space',127:'DEL'};
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function rowsFor(){const r=[];for(let i=0;i<128;i++){const ch=i<32||i===127?(NAMES[i]||'ctrl'):String.fromCharCode(i);r.push({i,ch});}return r;}
function go(){const q=$('q').value.toLowerCase().trim();
let rows=rowsFor();
if(q)rows=rows.filter(r=>String(r.i)===q||('0x'+r.i.toString(16))===q||r.i.toString(16)===q||r.ch.toLowerCase()===q||(NAMES[r.i]||'').toLowerCase().includes(q));
$('out').innerHTML='<table class="at"><tr><th>Dec</th><th>Hex</th><th>Oct</th><th>Binary</th><th>Char</th></tr>'+rows.map(r=>`<tr><td>${r.i}</td><td>0x${r.i.toString(16).toUpperCase().padStart(2,'0')}</td><td>${r.i.toString(8).padStart(3,'0')}</td><td>${r.i.toString(2).padStart(8,'0')}</td><td>${esc(r.ch)}</td></tr>`).join('')+'</table>'+(rows.length?'':'<p class="note">No match.</p>');}
$('q').addEventListener('input',go);go();