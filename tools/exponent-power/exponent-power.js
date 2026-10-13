const $=id=>document.getElementById(id);
function group(s){return /^-?\d+$/.test(s)?s.replace(/\B(?=(\d{3})+(?!\d))/g,','):s;}
function go(){
 const b=parseFloat($('base').value),e=parseFloat($('exp').value);const sci=$('sci');
 if(!isFinite(b)||!isFinite(e)){$('res').textContent='—';sci.style.display='none';return;}
 const r=Math.pow(b,e);
 if(isNaN(r)){$('res').textContent='undefined';sci.style.display='none';return;}
 if(!isFinite(r)){$('res').textContent='too large';sci.style.display='none';return;}
 let disp;
 if(Number.isInteger(b)&&Number.isInteger(e)&&e>=0&&e<=1000&&Math.abs(b)<=1000000){try{disp=(BigInt(b)**BigInt(e)).toString();}catch(_){disp=String(r);}}
 else{disp=String(Math.round(r*1e6)/1e6);}
 $('res').textContent=group(disp);
 if((Math.abs(r)>=1e15||(r!==0&&Math.abs(r)<1e-4))){sci.style.display='block';sci.textContent='Scientific notation: '+r.toExponential(6);}else sci.style.display='none';
}
['base','exp'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('res').textContent.replace(/,/g,'')));
go();