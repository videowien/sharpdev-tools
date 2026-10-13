const $=id=>document.getElementById(id);
let radii=[];
function regen(){const n=+$('pts').value;radii=[];for(let i=0;i<n;i++)radii.push(Math.random());build();}
function build(){
 const n=+$('pts').value;if(radii.length!==n){regen();return;}
 const variance=+$('vary').value/100;const S=200,cx=S/2,cy=S/2,baseR=S*0.36;
 const pts=[];for(let i=0;i<n;i++){const ang=i/n*6.2832;const r=baseR*(1-variance/2+radii[i]*variance);pts.push([cx+Math.cos(ang)*r,cy+Math.sin(ang)*r]);}
 const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];const rnd=p=>[Math.round(p[0]*10)/10,Math.round(p[1]*10)/10];
 let m0=rnd(mid(pts[n-1],pts[0]));let d='M'+m0[0]+','+m0[1];
 for(let i=0;i<n;i++){const next=pts[(i+1)%n];const m=rnd(mid(pts[i],next));const c=rnd(pts[i]);d+=' Q'+c[0]+','+c[1]+' '+m[0]+','+m[1];}
 d+=' Z';
 const svg='<svg viewBox="0 0 '+S+' '+S+'" xmlns="http://www.w3.org/2000/svg"><path fill="'+$('color').value+'" d="'+d+'"/></svg>';
 $('prev').innerHTML=svg;$('code').value=svg;
}
function dl(){const b=new Blob([$('code').value],{type:'image/svg+xml'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='blob.svg';a.click();URL.revokeObjectURL(u);}
['color','pts','vary'].forEach(id=>$(id).addEventListener('input',build));
$('regen').addEventListener('click',regen);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('code').value));
$('dl').addEventListener('click',dl);
regen();