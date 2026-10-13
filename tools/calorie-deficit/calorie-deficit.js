const $=id=>document.getElementById(id);
const BASE='A kilogram of body fat is about 7,700 kcal (a pound is about 3,500). A safe rate is usually 0.5 to 1 kg per week. This is a guide, not medical advice.';
function go(){
 const cur=+$('cur').value,goal=+$('goal').value,weeks=+$('weeks').value;const note=$('note');
 if(!(cur>0&&goal>0&&weeks>0)){['daily','weekly','total'].forEach(id=>$(id).textContent='—');note.textContent=BASE;return;}
 const lose=cur-goal;
 if(lose<=0){['daily','weekly','total'].forEach(id=>$(id).textContent='—');note.textContent='Your goal weight is the same as or higher than your current weight, so no calorie deficit is needed. '+BASE;return;}
 const daily=lose*7700/(weeks*7),weekly=lose/weeks;
 $('daily').textContent=Math.round(daily).toLocaleString('en-US')+' kcal';
 $('weekly').textContent=(Math.round(weekly*100)/100)+' kg';
 $('total').textContent=(Math.round(lose*10)/10)+' kg';
 let warn='';
 if(daily>1100)warn=' Note: that daily deficit is very aggressive, consider a longer timeframe.';
 else if(weekly>1)warn=' Note: losing more than 1 kg per week is faster than usually recommended.';
 note.textContent=BASE+warn;
}
['cur','goal','weeks'].forEach(id=>$(id).addEventListener('input',go));go();