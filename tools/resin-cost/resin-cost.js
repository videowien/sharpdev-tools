const $=id=>document.getElementById(id);
function go(){const ml=+$('ml').value,price=+$('price').value,size=+$('size').value,waste=Math.max(0,+$('waste').value||0);
 if(!(ml>0&&price>=0&&size>0)){['tot','vol','perml'].forEach(id=>$(id).textContent='-');return;}
 const v=ml*(1+waste/100);
 $('vol').textContent=v.toFixed(1)+' ml';
 $('perml').textContent=(price/size).toFixed(4);
 $('tot').textContent=(v/size*price).toFixed(2);}
['ml','price','size','waste'].forEach(id=>$(id).addEventListener('input',go));go();