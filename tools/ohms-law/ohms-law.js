const $=id=>document.getElementById(id);
function val(id){const v=$(id).value;return v===''?null:parseFloat(v);}
function fmt(n){if(!isFinite(n))return '—';return (Math.round(n*1e6)/1e6).toLocaleString('en-US',{maximumFractionDigits:6});}
function go(){let V=val('v'),I=val('i'),R=val('r'),P=val('p');const have=[V,I,R,P].filter(x=>x!==null&&isFinite(x)).length;
if(have<2){['ov','oi','or','op'].forEach(id=>$(id).textContent='—');$('msg').textContent='Enter any two values, then the other two are filled in automatically.';return;}
if(V!==null&&I!==null){R=V/I;P=V*I;}else if(V!==null&&R!==null){I=V/R;P=V*V/R;}else if(V!==null&&P!==null){I=P/V;R=V*V/P;}else if(I!==null&&R!==null){V=I*R;P=I*I*R;}else if(I!==null&&P!==null){V=P/I;R=P/(I*I);}else if(R!==null&&P!==null){V=Math.sqrt(P*R);I=Math.sqrt(P/R);}
$('ov').textContent=fmt(V);$('oi').textContent=fmt(I);$('or').textContent=fmt(R);$('op').textContent=fmt(P);$('msg').textContent='V = I × R · P = V × I';}
['v','i','r','p'].forEach(id=>$(id).addEventListener('input',go));go();