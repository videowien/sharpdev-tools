const $=id=>document.getElementById(id);
const SETS={url:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-',alnum:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',lower:'abcdefghijklmnopqrstuvwxyz0123456789',num:'0123456789',hex:'0123456789abcdef'};
function nano(size,al){const a=new Uint8Array(size);crypto.getRandomValues(a);let s='';for(let i=0;i<size;i++)s+=al[a[i]%al.length];return s;}
function gen(){const size=Math.min(64,Math.max(2,parseInt($('size').value)||21));const n=Math.min(500,Math.max(1,parseInt($('count').value)||1));const al=SETS[$('alpha').value]||SETS.url;const out=[];for(let i=0;i<n;i++)out.push(nano(size,al));$('out').value=out.join('\n');}
['size','count'].forEach(id=>$(id).addEventListener('input',gen));$('alpha').addEventListener('change',gen);$('gen').addEventListener('click',gen);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
gen();