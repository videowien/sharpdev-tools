const $=id=>document.getElementById(id);
let H1,H2;
function regen(){H1={f:1+Math.random()*1.5,p:Math.random()*6.2832};H2={f:2+Math.random()*2.5,p:Math.random()*6.2832};build();}
function build(){
 const W=1440,H=320,flip=$('flip').checked,pk=+$('peaks').value;
 const a=(+$('amp').value/100)*H*0.42,base=H*0.5;
 const y=x=>base+a*(0.72*Math.sin(x/W*6.2832*H1.f*pk+H1.p)+0.28*Math.sin(x/W*6.2832*H2.f*pk+H2.p));
 const r=n=>Math.round(n*10)/10;
 let d='M0,'+r(y(0));
 for(let i=1;i<=64;i++){const x=W*i/64;d+=' L'+r(x)+','+r(y(x));}
 d+=' L'+W+','+(flip?0:H)+' L0,'+(flip?0:H)+' Z';
 const svg='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path fill="'+$('color').value+'" d="'+d+'"/></svg>';
 $('prev').innerHTML=svg;$('code').value=svg;
}
function dl(){const b=new Blob([$('code').value],{type:'image/svg+xml'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='wave.svg';a.click();URL.revokeObjectURL(u);}
['color','amp','peaks','flip'].forEach(id=>$(id).addEventListener('input',build));
$('regen').addEventListener('click',regen);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('code').value));
$('dl').addEventListener('click',dl);
regen();