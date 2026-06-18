const $=id=>document.getElementById(id);
function go(){const n=Math.min(1000,Math.max(1,parseInt($('n').value)||1));const start=Math.min(10000,Math.max(0,parseInt($('start').value)||0));let a=0n,b=1n;const seq=[];for(let i=0;i<start+n;i++){if(i>=start)seq.push(a);const t=a+b;a=b;b=t;}$('out').value=seq.join(', ');$('meta').textContent=seq.length+' terms (F'+start+'–F'+(start+n-1)+')';}
$('n').addEventListener('input',go);$('start').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
go();