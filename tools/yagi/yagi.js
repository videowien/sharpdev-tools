const $=id=>document.getElementById(id);
const GAIN={2:5.5,3:7.5,4:8.5,5:9.5,6:10.5};
function L(ft){return ft.toFixed(2)+' ft / '+(ft*0.3048).toFixed(2)+' m';}
function go(){const f=+$('f').value,n=+$('n').value;if(!(f>0)){['dr','rf','di','bm','gn'].forEach(id=>$(id).textContent='-');return;}
 $('dr').textContent=L(468/f);$('rf').textContent=L(492/f);
 const nd=n-2;$('di').textContent=nd>0?(nd+' x '+L(450/f)):'none (2-element)';
 const sp=197/f,boom=sp*(n-1);
 $('bm').textContent='spacing '+sp.toFixed(2)+' ft, boom '+boom.toFixed(2)+' ft';
 $('gn').textContent='~'+(GAIN[n]||(10.5+0.8*(n-6))).toFixed(1)+' dBi';}
['f','n'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();