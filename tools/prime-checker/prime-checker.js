const $=id=>document.getElementById(id);
function go(){const n=parseInt($('n').value);
if(!isFinite(n)||n<0){$('verdict').textContent='—';$('verdict').style.color='#888';$('fact').textContent='';return;}
if(n<2){$('verdict').textContent=n+' is not prime';$('verdict').style.color='#ff6666';$('fact').textContent=(n<2?'(no prime factorization)':'');return;}
let prime=true;for(let i=2;i*i<=n;i++){if(n%i===0){prime=false;break;}}
$('verdict').textContent=prime?(n+' is a prime number ✓'):(n+' is not prime');
$('verdict').style.color=prime?'#44dd88':'#ff6666';
let m=n;const f={};for(let i=2;i*i<=m;i++){while(m%i===0){f[i]=(f[i]||0)+1;m/=i;}}if(m>1)f[m]=(f[m]||0)+1;
const parts=Object.keys(f).map(p=>f[p]>1?p+'^'+f[p]:p);
$('fact').textContent=n+' = '+parts.join(' × ');}
$('n').addEventListener('input',go);go();