const $=id=>document.getElementById(id);
function letter(p){return p>=90?'A':p>=80?'B':p>=70?'C':p>=60?'D':'F';}
function go(){const lines=$('rows').value.split('\n');let sw=0,acc=0,n=0;
 lines.forEach(function(l){const p=l.split(',');if(p.length<3)return;const s=parseFloat(p[1]),w=parseFloat(p[2]);if(isFinite(s)&&isFinite(w)){acc+=s*w;sw+=w;n++;}});
 if(!n||sw<=0){$('grade').textContent='—';$('letter').textContent='—';$('tw').textContent='—';return;}
 const g=acc/sw;$('grade').textContent=(Math.round(g*100)/100)+'%';$('letter').textContent=letter(g);$('tw').textContent=(Math.round(sw*100)/100)+'%';}
$('rows').addEventListener('input',go);go();