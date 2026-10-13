const $=id=>document.getElementById(id);
function go(){
 const dir=$('dir').value,rate=parseFloat($('rate').value),n=parseFloat($('n').value)||1;
 $('inlabel').textContent=dir==='apr2apy'?'APR (%)':'APY (%)';
 $('outlabel').textContent=dir==='apr2apy'?'APY (effective)':'APR (nominal)';
 if(!isFinite(rate)){$('out').textContent='—';$('diff').textContent='—';return;}
 let out;
 if(dir==='apr2apy'){out=(Math.pow(1+rate/100/n,n)-1)*100;}
 else{out=n*(Math.pow(1+rate/100,1/n)-1)*100;}
 $('out').textContent=(Math.round(out*1000)/1000)+'%';
 $('diff').textContent=(Math.round(Math.abs(out-rate)*1000)/1000)+'%';
}
['dir','rate','n'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();