const $=id=>document.getElementById(id);
function g2ll(g){g=(g||'').trim().toUpperCase();if(!/^[A-R]{2}[0-9]{2}([A-X]{2})?$/.test(g))return null;
 let lon=(g.charCodeAt(0)-65)*20-180,lat=(g.charCodeAt(1)-65)*10-90;
 lon+=(+g[2])*2;lat+=(+g[3])*1;
 if(g.length>=6){lon+=(g.charCodeAt(4)-65)*(2/24);lat+=(g.charCodeAt(5)-65)*(1/24);lon+=1/24;lat+=0.5/24;}
 else{lon+=1;lat+=0.5;}
 return [lat,lon];}
function fmtLL(la,lo){return Math.abs(la).toFixed(4)+'°'+(la>=0?'N':'S')+', '+Math.abs(lo).toFixed(4)+'°'+(lo>=0?'E':'W');}
function go(){const a=g2ll($('g1').value);
 if(!a){$('ll1').textContent='enter a grid like FN31pr';$('dist').textContent='-';$('bear').textContent='-';return;}
 $('ll1').textContent=fmtLL(a[0],a[1]);
 const b=g2ll($('g2').value);
 if(!b){$('dist').textContent='-';$('bear').textContent='-';return;}
 const R=6371,toR=Math.PI/180;const dla=(b[0]-a[0])*toR,dlo=(b[1]-a[1])*toR;
 const aa=Math.sin(dla/2)**2+Math.cos(a[0]*toR)*Math.cos(b[0]*toR)*Math.sin(dlo/2)**2;
 const d=2*R*Math.asin(Math.sqrt(aa));
 $('dist').textContent=Math.round(d).toLocaleString('en-US')+' km / '+Math.round(d*0.621371).toLocaleString('en-US')+' mi';
 const y=Math.sin(dlo)*Math.cos(b[0]*toR),x=Math.cos(a[0]*toR)*Math.sin(b[0]*toR)-Math.sin(a[0]*toR)*Math.cos(b[0]*toR)*Math.cos(dlo);
 $('bear').textContent=((Math.atan2(y,x)*180/Math.PI+360)%360).toFixed(1)+'°';}
['g1','g2'].forEach(id=>$(id).addEventListener('input',go));go();