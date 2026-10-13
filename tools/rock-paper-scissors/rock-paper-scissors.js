const $=id=>document.getElementById(id);
const EM={Rock:'✊',Paper:'✋',Scissors:'✌️'};const beats={Rock:'Scissors',Paper:'Rock',Scissors:'Paper'};
let w=0,l=0,t=0;
function play(p){const opts=['Rock','Paper','Scissors'];const c=opts[Math.floor(Math.random()*3)];$('you').textContent=EM[p];$('cpu').textContent=EM[c];let r;if(p===c){r='Tie';t++;}else if(beats[p]===c){r='You win!';w++;}else{r='You lose';l++;}$('res').textContent=r;$('w').textContent=w;$('l').textContent=l;$('t').textContent=t;}
document.querySelectorAll('.rps-btn').forEach(b=>b.addEventListener('click',()=>play(b.dataset.c)));
$('reset').addEventListener('click',()=>{w=l=t=0;$('w').textContent=0;$('l').textContent=0;$('t').textContent=0;$('res').textContent='Pick one';$('you').textContent='—';$('cpu').textContent='—';});