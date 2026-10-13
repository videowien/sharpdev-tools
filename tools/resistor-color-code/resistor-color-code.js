const $=id=>document.getElementById(id);
const DIGITS=['black','brown','red','orange','yellow','green','blue','violet','grey','white'];
const HEX={black:'#000',brown:'#7b3f00',red:'#e11',orange:'#f80',yellow:'#fd0',green:'#1a1',blue:'#03f',violet:'#90f',grey:'#888',white:'#fff',gold:'#c9a227',silver:'#bbb'};
const MULT={black:1,brown:10,red:100,orange:1e3,yellow:1e4,green:1e5,blue:1e6,violet:1e7,grey:1e8,white:1e9,gold:0.1,silver:0.01};
const TOL={brown:1,red:2,green:0.5,blue:0.25,violet:0.1,grey:0.05,gold:5,silver:10};
const TC={brown:100,red:50,orange:15,yellow:25,blue:10,violet:5};
function opts(map,sel){return Object.keys(map).map(k=>'<option value="'+k+'"'+(k===sel?' selected':'')+'>'+k+'</option>').join('');}
function render(){const n=+$('bands').value;const sig=n>=5?3:2;let h='';
 for(let i=0;i<sig;i++)h+='<div class="field"><label>Digit '+(i+1)+'</label><select data-r="d'+i+'">'+opts(Object.fromEntries(DIGITS.map(d=>[d,d])),DIGITS[i===0?1:0])+'</select><div class="rcc-chip" data-chip="d'+i+'"></div></div>';
 h+='<div class="field"><label>Multiplier</label><select data-r="m">'+opts(MULT,'red')+'</select><div class="rcc-chip" data-chip="m"></div></div>';
 h+='<div class="field"><label>Tolerance</label><select data-r="t">'+opts(TOL,'gold')+'</select><div class="rcc-chip" data-chip="t"></div></div>';
 if(n===6)h+='<div class="field"><label>Temp coeff</label><select data-r="tc">'+opts(TC,'brown')+'</select><div class="rcc-chip" data-chip="tc"></div></div>';
 $('bandsel').innerHTML=h;
 $('bandsel').querySelectorAll('select').forEach(s=>s.addEventListener('change',calc));
 calc();}
function fmt(r){if(r>=1e6)return (r/1e6)+' MΩ';if(r>=1e3)return (r/1e3)+' kΩ';return r+' Ω';}
function calc(){const n=+$('bands').value,sig=n>=5?3:2;let digits='';
 for(let i=0;i<sig;i++){const v=$('bandsel').querySelector('[data-r="d'+i+'"]').value;digits+=DIGITS.indexOf(v);$('bandsel').querySelector('[data-chip="d'+i+'"]').style.background=HEX[v];}
 const m=$('bandsel').querySelector('[data-r="m"]').value;const t=$('bandsel').querySelector('[data-r="t"]').value;
 $('bandsel').querySelector('[data-chip="m"]').style.background=HEX[m];$('bandsel').querySelector('[data-chip="t"]').style.background=HEX[t];
 const res=parseInt(digits,10)*MULT[m];$('res').textContent=fmt(Math.round(res*100)/100);$('tol').textContent='±'+TOL[t]+'%';
 if(n===6){const tc=$('bandsel').querySelector('[data-r="tc"]').value;$('bandsel').querySelector('[data-chip="tc"]').style.background=HEX[tc];$('tc').textContent=TC[tc]+' ppm/K';}else $('tc').textContent='—';}
$('bands').addEventListener('change',render);render();