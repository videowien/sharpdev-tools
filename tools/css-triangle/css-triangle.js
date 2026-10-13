const dir=document.getElementById('dir'),size=document.getElementById('size'),sv=document.getElementById('size-val'),col=document.getElementById('col'),tri=document.getElementById('tri'),out=document.getElementById('out');
function css(){
  const s=+size.value,c=col.value,d=dir.value,T='transparent';
  let b={top:s,right:s,bottom:s,left:s},col4={top:T,right:T,bottom:T,left:T};
  if(d==='up'){b={top:0,right:s,bottom:s,left:s};col4.bottom=c;}
  else if(d==='down'){b={top:s,right:s,bottom:0,left:s};col4.top=c;}
  else if(d==='left'){b={top:s,right:s,bottom:s,left:0};col4.right=c;}
  else if(d==='right'){b={top:s,right:0,bottom:s,left:s};col4.left=c;}
  else if(d==='up-left'){b={top:s,right:s,bottom:0,left:0};col4.top=c;}
  else if(d==='up-right'){b={top:s,right:0,bottom:0,left:s};col4.top=c;}
  else if(d==='down-left'){b={top:0,right:s,bottom:s,left:0};col4.bottom=c;}
  else if(d==='down-right'){b={top:0,right:0,bottom:s,left:s};col4.bottom=c;}
  const lines=['width: 0;','height: 0;'];
  for(const side of ['top','right','bottom','left']){
    if(b[side]>0)lines.push(`border-${side}: ${b[side]}px solid ${col4[side]};`);
  }
  return lines.join('\n');
}
function go(){
  sv.textContent=size.value;
  const code=css();
  tri.style.cssText=code;
  out.textContent='.triangle {\n  '+code.replace(/\n/g,'\n  ')+'\n}';
}
[dir,size,col].forEach(e=>e.addEventListener('input',go));
document.getElementById('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(out.textContent);});
go();