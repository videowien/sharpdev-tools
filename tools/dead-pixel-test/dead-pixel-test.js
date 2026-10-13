const $=id=>document.getElementById(id);
const COLORS=[['Red','#ff0000'],['Green','#00ff00'],['Blue','#0000ff'],['White','#ffffff'],['Black','#000000'],['Cyan','#00ffff'],['Magenta','#ff00ff'],['Yellow','#ffff00']];
let i=0,on=false;const ov=$('overlay');
function show(){ov.style.background=COLORS[i][1];$('cname').textContent=COLORS[i][0];}
function start(){on=true;i=0;ov.classList.add('on');show();if(ov.requestFullscreen)ov.requestFullscreen().catch(function(){});}
function next(){i=(i+1)%COLORS.length;show();}
function prev(){i=(i-1+COLORS.length)%COLORS.length;show();}
function exit(){on=false;ov.classList.remove('on');if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(function(){});}
$('start').addEventListener('click',start);
ov.addEventListener('click',next);
document.addEventListener('keydown',function(e){if(!on)return;if(e.key==='Escape'){exit();}else if(e.key===' '||e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();next();}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();prev();}});