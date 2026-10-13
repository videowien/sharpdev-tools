const $=id=>document.getElementById(id);
const TOLS={J:'±5%',K:'±10%',M:'±20%',F:'±1%',G:'±2%'};
function fmt(pf){if(pf>=1e6)return (Math.round(pf/1e3)/1e3)+' µF';if(pf>=1e3)return (Math.round(pf/10)/100)+' nF';return (Math.round(pf*100)/100)+' pF';}
function go(){const c=$('code').value.trim();
 if(!/^\d{2,3}$/.test(c)){$('main').textContent='—';$('pf').textContent='—';$('tolout').textContent='—';return;}
 let pf;if(c.length===2)pf=parseInt(c,10);else pf=parseInt(c.slice(0,2),10)*Math.pow(10,parseInt(c[2],10));
 $('main').textContent=fmt(pf);$('pf').textContent=pf.toLocaleString('en-US')+' pF';
 const t=$('tol').value;$('tolout').textContent=t?TOLS[t]:'—';}
['code','tol'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();