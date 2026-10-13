const $=id=>document.getElementById(id);
function fmt(n){return Number.isFinite(n)?(Math.round(n*1e8)/1e8).toLocaleString('en-US',{maximumFractionDigits:8}):'—';}
function go(){
 const x=parseFloat($('num').value),n=parseInt($('deg').value);const note=$('note');
 if(!isFinite(x)||!isFinite(n)||n<1){$('res').textContent='—';$('chk').textContent='—';note.textContent='';return;}
 let r;
 if(x<0){if(n%2===1){r=-Math.pow(-x,1/n);note.textContent='A negative number with an odd root has a real negative result.';}
   else{$('res').textContent='not real';$('chk').textContent='—';note.textContent='An even root of a negative number is not a real number (the result is complex).';return;}}
 else{r=Math.pow(x,1/n);note.textContent=n===2?'This is the square root.':(n===3?'This is the cube root.':'This is the '+n+'th root.');}
 $('res').textContent=fmt(r);$('chk').textContent=fmt(Math.pow(r,n));
}
['num','deg'].forEach(id=>$(id).addEventListener('input',go));go();