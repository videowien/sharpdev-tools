const $=id=>document.getElementById(id);
const A=['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
const E=['🐀','🐂','🐅','🐇','🐉','🐍','🐎','🐐','🐒','🐓','🐕','🐖'];
const EL=['Wood','Fire','Earth','Metal','Water'];
function go(){const y=parseInt($('y').value);if(!Number.isFinite(y)){$('out').textContent='Enter a year.';return;}
const i=((y-4)%12+12)%12;const el=EL[Math.floor((((y-4)%10)+10)%10/2)];
$('out').innerHTML='<div style="font-size:30px;color:#fff;">'+E[i]+' <b style="color:#ff6666;">'+el+' '+A[i]+'</b></div>'
+'<div style="color:#888;font-size:13px;margin-top:8px;">Year of the '+A[i]+' · '+el+' element</div>';}
$('y').addEventListener('input',go);go();