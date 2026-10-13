const $=id=>document.getElementById(id);
const ENC='0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function ulid(){let t=Date.now();let ts='';for(let i=0;i<10;i++){ts=ENC[t%32]+ts;t=Math.floor(t/32);}let rnd='';const a=new Uint8Array(16);crypto.getRandomValues(a);for(let i=0;i<16;i++)rnd+=ENC[a[i]&31];return ts+rnd;}
function gen(){const n=Math.min(500,Math.max(1,parseInt($('count').value)||1));const out=[];for(let i=0;i<n;i++)out.push(ulid());$('out').value=out.join('\n');}
$('gen').addEventListener('click',gen);$('count').addEventListener('input',gen);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
gen();