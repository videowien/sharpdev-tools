const $=id=>document.getElementById(id);
function luhnCheckDigit(num){let sum=0,alt=true;for(let i=num.length-1;i>=0;i--){let d=+num[i];if(alt){d*=2;if(d>9)d-=9;}sum+=d;alt=!alt;}return (10-(sum%10))%10;}
function luhnValid(num){num=num.replace(/\D/g,'');if(num.length<12)return false;let sum=0,alt=false;for(let i=num.length-1;i>=0;i--){let d=+num[i];if(alt){d*=2;if(d>9)d-=9;}sum+=d;alt=!alt;}return sum%10===0;}
function gen(prefix){
  const len=prefix==='34'?15:16;
  let num=prefix;
  while(num.length<len-1)num+=Math.floor(Math.random()*10);
  return num+luhnCheckDigit(num);
}
function fmt(n){return n.length===15?n.replace(/(\d{4})(\d{6})(\d{5})/,'$1 $2 $3'):n.replace(/(\d{4})(?=\d)/g,'$1 ');}
function go(){
  const p=$('brand').value,n=Math.min(100,Math.max(1,+$('count').value||1));
  const out=[];for(let i=0;i<n;i++)out.push(fmt(gen(p)));
  $('out').textContent=out.join('\n');
}
$('gen').addEventListener('click',go);$('brand').addEventListener('change',go);
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
$('check').addEventListener('input',()=>{const v=$('check').value.trim();const el=$('check-out');if(!v){el.style.display='none';return;}const ok=luhnValid(v);el.style.display='block';el.textContent=ok?'Valid (passes the Luhn checksum)':'Invalid (fails the Luhn checksum)';el.style.borderColor=ok?'#44dd88':'#ff4444';});
go();