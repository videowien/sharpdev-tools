const $=id=>document.getElementById(id);
let c=parseInt(localStorage.getItem('sd_tally')||'0')||0;
function render(){$('count').textContent=c.toLocaleString('en-US');try{localStorage.setItem('sd_tally',String(c));}catch(e){}}
function step(){return parseInt($('step').value)||1;}
$('inc').addEventListener('click',()=>{c+=step();render();});
$('dec').addEventListener('click',()=>{c-=step();render();});
$('reset').addEventListener('click',()=>{c=0;render();});
document.addEventListener('keydown',e=>{const t=e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();c+=step();render();}else if(e.key==='ArrowDown'){e.preventDefault();c-=step();render();}});
render();