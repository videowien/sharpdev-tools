const $=id=>document.getElementById(id);
function pickUnique(count,max){const set=new Set();const a=new Uint32Array(1);let guard=0;while(set.size<count&&set.size<max&&guard<100000){crypto.getRandomValues(a);set.add(a[0]%max+1);guard++;}return [...set].sort((x,y)=>x-y);}
function gen(){const count=Math.min(20,Math.max(1,parseInt($('count').value)||1));const max=Math.max(2,parseInt($('max').value)||2);const bc=Math.max(0,parseInt($('bcount').value)||0);const bm=Math.max(0,parseInt($('bmax').value)||0);
 $('main').textContent=pickUnique(Math.min(count,max),max).join('  ');
 if(bc>0&&bm>0){$('bonuswrap').style.display='';$('bonus').textContent=pickUnique(Math.min(bc,bm),bm).join('  ');}else{$('bonuswrap').style.display='none';}}
$('preset').addEventListener('change',function(){if(this.value==='custom')return;const p=this.value.split(',');$('count').value=p[0];$('max').value=p[1];$('bcount').value=p[2];$('bmax').value=p[3];gen();});
['count','max','bcount','bmax'].forEach(id=>$(id).addEventListener('input',function(){$('preset').value='custom';gen();}));
$('gen').addEventListener('click',gen);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('main').textContent+($('bonuswrap').style.display!=='none'?'  +  '+$('bonus').textContent:'')));
gen();