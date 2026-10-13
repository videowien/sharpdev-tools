const $=id=>document.getElementById(id);
function enc(s,r){if(r<2)return s;const rows=Array.from({length:r},()=>[]);let i=0,d=1;for(const c of s){rows[i].push(c);if(i===0)d=1;else if(i===r-1)d=-1;i+=d;}return rows.map(x=>x.join('')).join('');}
function dec(s,r){if(r<2)return s;const n=s.length,pat=[];let i=0,d=1;for(let k=0;k<n;k++){pat.push(i);if(i===0)d=1;else if(i===r-1)d=-1;i+=d;}const cnt=Array(r).fill(0);pat.forEach(p=>cnt[p]++);const rs=[];let idx=0;for(let row=0;row<r;row++){rs.push(s.slice(idx,idx+cnt[row]));idx+=cnt[row];}const pos=Array(r).fill(0);let o='';for(let k=0;k<n;k++){const row=pat[k];o+=rs[row][pos[row]++];}return o;}
function rails(){return Math.min(12,Math.max(2,parseInt($('rails').value)||3));}
$('enc').addEventListener('click',()=>$('out').value=enc($('in').value,rails()));
$('dec').addEventListener('click',()=>$('out').value=dec($('in').value,rails()));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('enc').click();