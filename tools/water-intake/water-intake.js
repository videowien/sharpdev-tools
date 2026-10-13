const $=id=>document.getElementById(id);
function go(){
 const wt=+$('wt').value,ex=+$('ex').value||0;
 if(!(wt>0)){['liters','ml','cups','oz'].forEach(id=>$(id).textContent='—');return;}
 const ml=wt*33+(ex/30)*350;
 $('liters').textContent=(Math.round(ml/100)/10)+' L';
 $('ml').textContent=Math.round(ml).toLocaleString('en-US')+' ml';
 $('cups').textContent=Math.round(ml/250);
 $('oz').textContent=Math.round(ml/29.5735);
}
['wt','ex'].forEach(id=>$(id).addEventListener('input',go));go();