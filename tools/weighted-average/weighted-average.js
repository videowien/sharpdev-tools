const $=id=>document.getElementById(id);
function parse(s){return (s.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);}
function fmt(n){return Number.isFinite(n)?(Math.round(n*1e6)/1e6).toLocaleString('en-US',{maximumFractionDigits:6}):'—';}
function go(){
 const v=parse($('vals').value),w=parse($('wts').value);const warn=$('warn');
 if(!v.length){$('wavg').textContent='—';$('sw').textContent='—';$('pa').textContent='—';warn.style.display='none';return;}
 const pa=v.reduce((a,b)=>a+b,0)/v.length;
 if(v.length!==w.length){warn.style.display='block';warn.textContent='Values and weights must have the same count ('+v.length+' values, '+w.length+' weights).';$('wavg').textContent='—';$('sw').textContent='—';$('pa').textContent=fmt(pa);return;}
 warn.style.display='none';
 const sw=w.reduce((a,b)=>a+b,0);const num=v.reduce((a,x,i)=>a+x*w[i],0);
 $('wavg').textContent=sw?fmt(num/sw):'—';$('sw').textContent=fmt(sw);$('pa').textContent=fmt(pa);
}
['vals','wts'].forEach(id=>$(id).addEventListener('input',go));go();