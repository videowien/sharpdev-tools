const $=id=>document.getElementById(id);
function utf8(cp){return Array.from(new TextEncoder().encode(String.fromCodePoint(cp))).map(b=>b.toString(16).padStart(2,'0').toUpperCase()).join(' ');}
function utf16(cp){const s=String.fromCodePoint(cp);let o=[];for(let i=0;i<s.length;i++)o.push(s.charCodeAt(i).toString(16).padStart(4,'0').toUpperCase());return o.join(' ');}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function go(){const t=$('in').value;let rows='<tr><th>Char</th><th>Code point</th><th>Dec</th><th>HTML</th><th>UTF-8</th><th>UTF-16</th></tr>';
 for(const ch of t){const cp=ch.codePointAt(0);rows+='<tr><td class="ch">'+esc(ch)+'</td><td>U+'+cp.toString(16).toUpperCase().padStart(4,'0')+'</td><td>'+cp+'</td><td>&amp;#'+cp+';</td><td>'+utf8(cp)+'</td><td>'+utf16(cp)+'</td></tr>';}
 $('out').innerHTML=rows;}
$('in').addEventListener('input',go);go();