const $=id=>document.getElementById(id);
function go(){let n=parseInt($('n').value);if(!Number.isFinite(n)||n<0){$('out').value='';$('meta').textContent='Enter a whole number ≥ 0';return;}if(n>10000){$('out').value='';$('meta').textContent='Max is 10000';return;}let r=1n;for(let i=2n;i<=BigInt(n);i++)r*=i;const s=r.toString();$('out').value=s;$('meta').textContent=n+'! has '+s.length+' digit'+(s.length===1?'':'s');}
$('n').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
go();