const $=id=>document.getElementById(id);
function fmt(n){return Number.isFinite(n)?(Math.round(n*1e8)/1e8).toLocaleString('en-US',{maximumFractionDigits:8}):'—';}
function go(){
 const a=parseFloat($('a').value),b=parseFloat($('b').value);
 if(!isFinite(a)||!isFinite(b)||b===0){$('rem').textContent='—';$('quo').textContent=(b===0?'divide by 0':'—');$('emod').textContent='—';return;}
 $('rem').textContent=fmt(a%b);$('quo').textContent=fmt(Math.floor(a/b));$('emod').textContent=fmt(((a%b)+Math.abs(b))%Math.abs(b));
}
['a','b'].forEach(id=>$(id).addEventListener('input',go));go();