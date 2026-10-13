const $=id=>document.getElementById(id);
function hsl(){return 'hsl('+Math.floor(Math.random()*360)+', '+(65+Math.floor(Math.random()*25))+'%, '+(55+Math.floor(Math.random()*20))+'%)';}
function build(){
 const n=+$('pts').value;const base=hsl();const imgs=[];
 for(let i=0;i<n;i++){imgs.push('radial-gradient(at '+Math.floor(Math.random()*100)+'% '+Math.floor(Math.random()*100)+'%, '+hsl()+' 0px, transparent 50%)');}
 $('prev').style.backgroundColor=base;$('prev').style.backgroundImage=imgs.join(',');
 $('code').value='background-color: '+base+';\nbackground-image:\n  '+imgs.join(',\n  ')+';';
}
$('pts').addEventListener('input',build);
$('regen').addEventListener('click',build);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('code').value));
build();