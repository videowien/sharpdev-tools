const $=id=>document.getElementById(id);
function go(){const p=+$('p').value,loss=+$('loss').value,g=+$('g').value,unit=$('unit').value;
 if(!(p>0)){['eirp','erp','gg'].forEach(id=>$(id).textContent='-');return;}
 const gdBd=unit==='dbd'?g:g-2.15, gdBi=unit==='dbi'?g:g+2.15;
 const pdBW=10*Math.log10(p);
 const eirp=Math.pow(10,(pdBW-loss+gdBi)/10), erp=Math.pow(10,(pdBW-loss+gdBd)/10);
 $('eirp').textContent=eirp.toFixed(1)+' W  ('+(pdBW-loss+gdBi).toFixed(2)+' dBW)';
 $('erp').textContent=erp.toFixed(1)+' W  ('+(pdBW-loss+gdBd).toFixed(2)+' dBW)';
 $('gg').textContent=gdBi.toFixed(2)+' dBi / '+gdBd.toFixed(2)+' dBd';}
['p','loss','g','unit'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();