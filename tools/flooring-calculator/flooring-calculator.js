const $=id=>document.getElementById(id);
function go(){const L=+$('len').value,W=+$('wid').value,box=+$('box').value,waste=+$('waste').value||0;
 if(!(L>0&&W>0&&box>0)){['area','boxes','covered'].forEach(id=>$(id).textContent='—');return;}
 const area=L*W;const boxes=Math.ceil(area*(1+waste/100)/box);
 $('area').textContent=(Math.round(area*100)/100)+' m²';$('boxes').textContent=boxes;$('covered').textContent=(Math.round(boxes*box*100)/100)+' m²';}
['len','wid','box','waste'].forEach(id=>$(id).addEventListener('input',go));go();