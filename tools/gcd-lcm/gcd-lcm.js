const $=id=>document.getElementById(id);
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;}
function go(){const nums=($('in').value.match(/-?\d+/g)||[]).map(Number).filter(n=>n!==0);
if(nums.length<2){$('cards').innerHTML='<div class="result-card"><div class="label">Enter 2+ numbers</div><div class="value">—</div></div>';return;}
let g=Math.abs(nums[0]),l=Math.abs(nums[0]);
for(let i=1;i<nums.length;i++){g=gcd(g,nums[i]);l=Math.abs(l/gcd(l,nums[i])*nums[i]);}
$('cards').innerHTML=[['GCD (HCF)',g,true],['LCM',l,true],['Count',nums.length,false]].map(([la,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${la}</div><div class="value">${v.toLocaleString()}</div></div>`).join('');}
$('in').addEventListener('input',go);go();