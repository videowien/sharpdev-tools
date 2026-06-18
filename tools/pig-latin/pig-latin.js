const $=id=>document.getElementById(id);
function pig(w){const m=w.match(/^([a-zA-Z]+)$/);if(!m)return w;const cap=w[0]===w[0].toUpperCase();let r;
if(/^[aeiouAEIOU]/.test(w))r=w.toLowerCase()+'way';else{const cl=w.toLowerCase().match(/^[^aeiou]+/)[0];r=w.toLowerCase().slice(cl.length)+cl+'ay';}
if(cap)r=r[0].toUpperCase()+r.slice(1);return r;}
function go(){$('out').textContent=$('in').value.split(/(\b)/).map(t=>/^[a-zA-Z]+$/.test(t)?pig(t):t).join('');}
$('in').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();