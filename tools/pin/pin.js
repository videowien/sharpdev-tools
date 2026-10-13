const $=id=>document.getElementById(id);
function randPin(n){const a=new Uint32Array(n);crypto.getRandomValues(a);let s='';for(let i=0;i<n;i++)s+=(a[i]%10);return s;}
function gen(){const len=Math.min(32,Math.max(3,parseInt($('len').value)||4));const count=Math.min(100,Math.max(1,parseInt($('count').value)||1));const out=[];for(let i=0;i<count;i++)out.push(randPin(len));$('out').value=out.join('\n');}
$('gen').addEventListener('click',gen);$('len').addEventListener('input',gen);$('count').addEventListener('input',gen);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
gen();