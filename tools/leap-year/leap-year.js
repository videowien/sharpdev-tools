const $=id=>document.getElementById(id);
function isLeap(y){return (y%4===0&&y%100!==0)||y%400===0;}
function go(){const y=parseInt($('y').value);if(!Number.isFinite(y)){$('out').textContent='Enter a year.';return;}
const leap=isLeap(y);let why;
if(!leap){why=(y%4!==0)?'not divisible by 4':'divisible by 100 but not 400';}
else{why=(y%400===0)?'divisible by 400':'divisible by 4 and not by 100';}
const next=[];for(let n=y+(leap?1:0);next.length<5;n++){if(isLeap(n))next.push(n);}
$('out').innerHTML='<div style="font-size:20px;color:#fff;"><b>'+y+'</b> is '+(leap?'<span style="color:#4ade80;">a leap year</span> ✓':'<span style="color:#ff6666;">not a leap year</span>')+'</div>'
+'<div style="color:#888;font-size:13px;margin-top:6px;">('+why+(leap?' — February has 29 days':' — February has 28 days')+')</div>'
+'<div style="color:#aaa;font-size:13px;margin-top:12px;">Next leap years: '+next.join(', ')+'</div>';}
$('y').addEventListener('input',go);go();