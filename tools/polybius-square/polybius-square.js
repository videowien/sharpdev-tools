const $=id=>document.getElementById(id);
const GRID='ABCDEFGHIKLMNOPQRSTUVWXYZ';
function enc(s){return s.toUpperCase().replace(/J/g,'I').split('').map(c=>{const i=GRID.indexOf(c);return i<0?'':''+(Math.floor(i/5)+1)+(i%5+1);}).join(' ');}
function dec(s){const m=s.replace(/[^1-5]/g,'').match(/[1-5][1-5]/g)||[];return m.map(p=>GRID[(+p[0]-1)*5+(+p[1]-1)]).join('');}
$('enc').addEventListener('click',()=>$('out').value=enc($('in').value));
$('dec').addEventListener('click',()=>$('out').value=dec($('in').value));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('enc').click();