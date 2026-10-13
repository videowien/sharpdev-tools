const $=id=>document.getElementById(id);
function enc(s){return s.split(/\s+/).map(w=>w.split('').map(c=>{const n=c.toUpperCase().charCodeAt(0)-64;return(n>=1&&n<=26)?n:c;}).join('-')).join(' ');}
function dec(s){return s.split(/\s+/).map(w=>w.split('-').map(x=>{const n=parseInt(x,10);return(n>=1&&n<=26)?String.fromCharCode(64+n):x;}).join('')).join(' ');}
$('enc').addEventListener('click',()=>$('out').value=enc($('in').value));
$('dec').addEventListener('click',()=>$('out').value=dec($('in').value));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('enc').click();