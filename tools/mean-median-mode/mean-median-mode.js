const $=id=>document.getElementById(id);
function fmt(n){return Number.isFinite(n)?(Math.round(n*1e6)/1e6).toLocaleString('en-US',{maximumFractionDigits:6}):'—';}
function go(){
 const nums=($('in').value.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
 if(!nums.length){['mean','median','mode','range','count','sum','min','max'].forEach(id=>$(id).textContent='—');return;}
 const n=nums.length;const sum=nums.reduce((a,b)=>a+b,0);
 const sorted=nums.slice().sort((a,b)=>a-b);
 const median=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;
 const freq={};let best=0;nums.forEach(function(x){freq[x]=(freq[x]||0)+1;if(freq[x]>best)best=freq[x];});
 let mode='none';if(best>1){mode=Object.keys(freq).filter(k=>freq[k]===best).map(Number).sort((a,b)=>a-b).map(fmt).join(', ');}
 $('mean').textContent=fmt(sum/n);$('median').textContent=fmt(median);$('mode').textContent=mode;
 $('range').textContent=fmt(sorted[n-1]-sorted[0]);$('count').textContent=n;$('sum').textContent=fmt(sum);
 $('min').textContent=fmt(sorted[0]);$('max').textContent=fmt(sorted[n-1]);
}
$('in').addEventListener('input',go);go();