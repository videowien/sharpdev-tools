const $=id=>document.getElementById(id);
function nCr(n,r){if(r<0||r>n)return 0;r=Math.min(r,n-r);let res=1;for(let i=1;i<=r;i++){res=res*(n-r+i)/i;}return Math.round(res);}
function nPr(n,r){if(r<0||r>n)return 0;let res=1;for(let i=0;i<r;i++)res*=(n-i);return res;}
function fact(n){let res=1;for(let i=2;i<=n;i++)res*=i;return res;}
function fmt(x){if(x>1e15)return x.toExponential(4);return x.toLocaleString();}
function go(){const n=parseInt($('n').value),r=parseInt($('r').value);
if(!isFinite(n)||!isFinite(r)||n<0||r<0){$('cards').innerHTML='<div class="result-card"><div class="label">Enter n and r</div><div class="value">—</div></div>';return;}
if(r>n){$('cards').innerHTML='<div class="result-card hl"><div class="label">Note</div><div class="value" style="font-size:15px">r cannot exceed n</div></div>';return;}
$('cards').innerHTML=[['Combinations nCr',fmt(nCr(n,r)),true],['Permutations nPr',fmt(nPr(n,r)),true],['n!',fmt(fact(n)),false],['r!',fmt(fact(r)),false]].map(([l,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value" style="font-size:17px">${v}</div></div>`).join('');}
['n','r'].forEach(id=>$(id).addEventListener('input',go));go();