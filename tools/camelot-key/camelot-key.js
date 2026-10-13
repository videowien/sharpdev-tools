const $=id=>document.getElementById(id);
const WHEEL=[['1A','A♭ minor'],['2A','E♭ minor'],['3A','B♭ minor'],['4A','F minor'],['5A','C minor'],['6A','G minor'],['7A','D minor'],['8A','A minor'],['9A','E minor'],['10A','B minor'],['11A','F♯ minor'],['12A','D♭ minor'],
['1B','B major'],['2B','F♯ major'],['3B','D♭ major'],['4B','A♭ major'],['5B','E♭ major'],['6B','B♭ major'],['7B','F major'],['8B','C major'],['9B','G major'],['10B','D major'],['11B','A major'],['12B','E major']];
const BY={};WHEEL.forEach(w=>BY[w[0]]=w[1]);
$('key').innerHTML=WHEEL.map((w,i)=>'<option value="'+w[0]+'"'+(w[0]==='8B'?' selected':'')+'>'+w[1]+'  ('+w[0]+')</option>').join('');
function code(n,l){return ((n-1+12)%12+1)+l;}
function go(){const c=$('key').value;
 const n=parseInt(c,10),l=c.replace(/\d+/,'');
 $('code').textContent=c;
 const d=code(n-1,l),u=code(n+1,l),r=n+(l==='A'?'B':'A');
 $('down').textContent=d+'  ('+BY[d]+')';
 $('up').textContent=u+'  ('+BY[u]+')';
 $('rel').textContent=r+'  ('+BY[r]+')';}
$('key').addEventListener('change',go);go();