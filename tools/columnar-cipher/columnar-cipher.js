const $=id=>document.getElementById(id);
function order(k){return k.split('').map((c,i)=>[c.toUpperCase(),i]).sort((a,b)=>a[0]===b[0]?a[1]-b[1]:(a[0]<b[0]?-1:1)).map(x=>x[1]);}
function enc(t,k){if(!k)return t;const cols=k.length,ord=order(k),rows=Math.ceil(t.length/cols);let o='';for(const c of ord)for(let r=0;r<rows;r++){const i=r*cols+c;if(i<t.length)o+=t[i];}return o;}
function dec(ct,k){if(!k)return ct;const cols=k.length,n=ct.length,rows=Math.ceil(n/cols),ord=order(k);const lastLen=n%cols||cols;const cl=c=>c<lastLen?rows:rows-1;const cd={};let idx=0;for(const c of ord){const L=cl(c);cd[c]=ct.slice(idx,idx+L);idx+=L;}let o='';for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if(cd[c]&&r<cd[c].length)o+=cd[c][r];return o;}
function key(){return ($('key').value||'').replace(/[^A-Za-z]/g,'');}
$('enc').addEventListener('click',()=>$('out').value=enc($('in').value.replace(/\s+/g,''),key()));
$('dec').addEventListener('click',()=>$('out').value=dec($('in').value.replace(/\s+/g,''),key()));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('enc').click();