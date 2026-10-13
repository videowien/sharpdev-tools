const $=id=>document.getElementById(id);
const MARKS=Array.from({length:0x36f-0x300+1},(_,i)=>String.fromCharCode(0x300+i));
function rnd(n){return Math.floor(Math.random()*n);}
function zalgo(s,lvl){return Array.from(s).map(ch=>{if(/\s/.test(ch))return ch;let o=ch;for(let i=0;i<lvl;i++)o+=MARKS[rnd(MARKS.length)];return o;}).join('');}
function go(){const lvl=Math.min(20,Math.max(1,parseInt($('lvl').value)||1));$('out').value=zalgo($('in').value,lvl);}
$('in').addEventListener('input',go);$('lvl').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
go();