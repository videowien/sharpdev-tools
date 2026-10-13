const $=id=>document.getElementById(id);function f(n){return(+(n.toFixed(5))).toString();}
function go(){const x1=+$('x1').value,y1=+$('y1').value,x2=+$('x2').value,y2=+$('y2').value;
const dx=x2-x1,dy=y2-y1;const dist=Math.hypot(dx,dy);const mid=`(${f((x1+x2)/2)}, ${f((y1+y2)/2)})`;
let slope,eq;if(dx===0){slope='undefined (vertical)';eq='x = '+f(x1);}else{const m=dy/dx;const b=y1-m*x1;slope=f(m);eq='y = '+f(m)+'x'+(b>=0?' + ':' − ')+f(Math.abs(b));}
$('cards').innerHTML=[['Slope (m)',slope,true],['Distance',f(dist),false],['Midpoint',mid,false],['Equation',eq,false]].map(([l,v,h])=>`<div class="result-card${h?' hl':''}"><div class="label">${l}</div><div class="value" style="font-size:16px">${v}</div></div>`).join('');}
['x1','y1','x2','y2'].forEach(id=>$(id).addEventListener('input',go));go();