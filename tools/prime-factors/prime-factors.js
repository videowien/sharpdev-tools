const $=id=>document.getElementById(id);
const SUP={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
function sup(n){return String(n).split('').map(d=>SUP[d]).join('');}
function factor(n){const f=[];while(n%2===0){f.push(2);n/=2;}for(let d=3;d*d<=n;d+=2){while(n%d===0){f.push(d);n/=d;}}if(n>1)f.push(n);return f;}
function go(){let n=parseInt($('n').value);if(!Number.isFinite(n)||n<2){$('out').textContent='Enter a whole number of 2 or more.';return;}if(n>1e13){$('out').textContent='Number too large — please keep it at 10,000,000,000,000 or below.';return;}const f=factor(n);const counts={};f.forEach(p=>counts[p]=(counts[p]||0)+1);const pretty=Object.keys(counts).map(p=>counts[p]>1?p+sup(counts[p]):p).join(' × ');$('out').innerHTML='<div style="font-size:18px;color:#fff;"><b>'+n.toLocaleString('en-US')+'</b> = '+pretty+(f.length===1?' <span style="color:#ff6666;">(prime)</span>':'')+'</div><div style="color:#888;font-size:13px;margin-top:8px;">Expanded: '+f.join(' × ')+'</div>';}
$('n').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').textContent));
go();