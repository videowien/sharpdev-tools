const $=id=>document.getElementById(id);
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function bionic(text,frac){return text.split(/(\s+)/).map(function(tok){if(tok===''||/^\s+$/.test(tok))return esc(tok);const n=tok.length;const b=n<=3?1:Math.max(1,Math.ceil(n*frac));return '<b>'+esc(tok.slice(0,b))+'</b>'+esc(tok.slice(b));}).join('');}
function go(){$('prev').innerHTML=bionic($('in').value,parseFloat($('strength').value));}
$('in').addEventListener('input',go);$('strength').addEventListener('change',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('prev').innerHTML));
go();