const $=id=>document.getElementById(id);
const AU=1.495978707e8, LY=9.4607304725808e12, PC=3.0856775814913673e13, MI=1.609344;
function fmt(x){if(!isFinite(x))return '-';if(x===0)return '0';
 const a=Math.abs(x);
 if(a>=1e15||a<1e-4)return x.toExponential(4);
 return x.toLocaleString('en-US',{maximumFractionDigits:a>=100?0:6});}
function fmtT(sec){if(sec<60)return (Math.round(sec*100)/100)+' s';
 if(sec<3600)return (Math.round(sec/60*100)/100)+' min';
 if(sec<86400)return (Math.round(sec/3600*100)/100)+' h';
 if(sec<31557600)return (Math.round(sec/86400*100)/100)+' days';
 return fmt(sec/31557600)+' years';}
function go(){const v=+$('val').value,u=$('unit').value;
 if(!isFinite(v)){['oly','opc','oau','okm','olt'].forEach(id=>$(id).textContent='-');return;}
 let km;
 if(u==='ly')km=v*LY;else if(u==='pc')km=v*PC;else if(u==='au')km=v*AU;else if(u==='mi')km=v*MI;else km=v;
 $('oly').textContent=fmt(km/LY);$('opc').textContent=fmt(km/PC);
 $('oau').textContent=fmt(km/AU);$('okm').textContent=fmt(km);
 $('olt').textContent=fmtT(km/299792.458);}
['val','unit'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();