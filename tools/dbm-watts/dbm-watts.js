const $=id=>document.getElementById(id);
function go(){const v=+$('val').value,u=$('unit').value;let mw;
 if(u==='w')mw=v*1000;else if(u==='mw')mw=v;else if(u==='dbm')mw=Math.pow(10,v/10);else mw=Math.pow(10,(v+30)/10);
 if(!(mw>0)||!isFinite(mw)){['odbm','ow','omw','odbw'].forEach(id=>$(id).textContent='-');return;}
 const dbm=10*Math.log10(mw);
 $('odbm').textContent=dbm.toFixed(2)+' dBm';
 $('ow').textContent=(mw/1000).toLocaleString('en-US',{maximumFractionDigits:6})+' W';
 $('omw').textContent=mw.toLocaleString('en-US',{maximumFractionDigits:4})+' mW';
 $('odbw').textContent=(dbm-30).toFixed(2)+' dBW';}
['val','unit'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();