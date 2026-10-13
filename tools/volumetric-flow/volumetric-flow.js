const $=id=>document.getElementById(id);
function go(){const lh=+$('lh').value,lw=+$('lw').value,sp=+$('sp').value;
 let lim=+$('max').value;if(!(lim>0))lim=+$('cust').value;
 $('cust').parentElement.style.display=(+$('max').value>0)?'none':'';
 if(!(lh>0&&lw>0&&sp>0)){['flow','ok','maxsp'].forEach(id=>$(id).textContent='-');return;}
 const f=lh*lw*sp;
 $('flow').textContent=f.toFixed(2)+' mm³/s';
 if(lim>0){const pct=f/lim*100;
  $('ok').textContent=f<=lim?('OK ('+pct.toFixed(0)+'% of limit)'):('EXCEEDS limit by '+(pct-100).toFixed(0)+'%');
  $('ok').style.color=f<=lim?'#2e7d32':'#c62828';
  $('maxsp').textContent=(lim/(lh*lw)).toFixed(0)+' mm/s';}
 else{$('ok').textContent='-';$('maxsp').textContent='-';}}
['lh','lw','sp','max','cust'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();