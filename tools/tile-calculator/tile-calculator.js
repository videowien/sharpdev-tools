const $=id=>document.getElementById(id);
function go(){const area=+$('area').value,tw=+$('tw').value,th=+$('th').value,waste=+$('waste').value||0;
 if(!(area>0&&tw>0&&th>0)){['exact','buy','perm'].forEach(id=>$(id).textContent='—');return;}
 const perM2=10000/(tw*th);const exact=area*perM2;
 $('perm').textContent=(Math.round(perM2*100)/100);$('exact').textContent=Math.ceil(exact);$('buy').textContent=Math.ceil(exact*(1+waste/100));}
['area','tw','th','waste'].forEach(id=>$(id).addEventListener('input',go));go();