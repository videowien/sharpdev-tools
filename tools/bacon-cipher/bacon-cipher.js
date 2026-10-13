const $=id=>document.getElementById(id);
function enc(s){return s.toUpperCase().replace(/[^A-Z]/g,'').split('').map(c=>(c.charCodeAt(0)-65).toString(2).padStart(5,'0').replace(/0/g,'A').replace(/1/g,'B')).join(' ');}
function dec(s){return (s.toUpperCase().replace(/[^AB]/g,'').match(/[AB]{5}/g)||[]).map(g=>String.fromCharCode(65+parseInt(g.replace(/A/g,'0').replace(/B/g,'1'),2))).join('');}
$('enc').addEventListener('click',()=>$('out').value=enc($('in').value));
$('dec').addEventListener('click',()=>$('out').value=dec($('in').value));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('enc').click();