const $=id=>document.getElementById(id);
function fmt(n){return Number.isFinite(n)?(Math.round(n*1e8)/1e8).toLocaleString('en-US',{maximumFractionDigits:8}):'—';}
function go(){
 const x=parseFloat($('num').value),b=parseFloat($('base').value);const note=$('note');
 if(!isFinite(x)||!isFinite(b)){$('res').textContent='—';note.textContent='';return;}
 if(x<=0){$('res').textContent='undefined';note.textContent='The logarithm is only defined for positive numbers.';return;}
 if(b<=0||b===1){$('res').textContent='undefined';note.textContent='The base must be positive and not equal to 1.';return;}
 const r=Math.log(x)/Math.log(b);
 $('res').textContent=fmt(r);
 note.textContent='This means '+fmt(b)+' raised to the power '+fmt(r)+' equals '+fmt(x)+'.';
}
['num','base'].forEach(id=>$(id).addEventListener('input',go));
document.querySelectorAll('#presets [data-b]').forEach(btn=>btn.addEventListener('click',function(){$('base').value=btn.dataset.b;go();}));
go();