const $=id=>document.getElementById(id);
function go(){const f=+$('f').value,k=+$('type').value,sel=$('vfsel').value;
 const vf=sel==='custom'?+$('vf').value:+sel;
 $('vfwrap').style.display=sel==='custom'?'':'none';
 if(!(f>0&&vf>0)){$('out').textContent='-';return;}
 const ft=k*vf/f;$('out').textContent=ft.toFixed(2)+' ft / '+(ft*0.3048).toFixed(3)+' m';}
['f','type','vfsel','vf'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();