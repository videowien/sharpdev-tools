const M=0.5399568043541743,B=0.0,AF='km/h',AT='kn';
const $=id=>document.getElementById(id);
function conv(x){return x*M+B;}
function fmt(n){if(!isFinite(n))return '';const r=Math.round(n*1e6)/1e6;return r.toLocaleString('en-US',{maximumFractionDigits:6});}
function go(){const v=parseFloat($('in').value);$('out').value=isFinite(v)?fmt(conv(v)):'';}
$('in').addEventListener('input',go);
const TABLE=[1,2,3,5,10,25,50,100,1000];
$('tbl').innerHTML=TABLE.map(x=>`<tr><td>${x.toLocaleString('en-US')} ${AF}</td><td>${fmt(conv(x))} ${AT}</td></tr>`).join('');
go();