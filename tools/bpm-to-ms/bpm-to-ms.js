const $=id=>document.getElementById(id);
const NOTES=[['1/1 (whole)',4],['1/2',2],['1/4 (beat)',1],['1/8',0.5],['1/16',0.25],['1/32',0.125],['1/64',0.0625]];
function f(x){return x>=100?x.toFixed(1):x.toFixed(2);}
function go(){const bpm=+$('bpm').value;
 if(!(bpm>0)){$('rows').innerHTML='';return;}
 const beat=60000/bpm;
 $('rows').innerHTML=NOTES.map(function(n){const ms=beat*n[1];
  return '<tr><td>'+n[0]+'</td><td>'+f(ms)+'</td><td>'+f(ms*1.5)+'</td><td>'+f(ms*2/3)+'</td><td>'+ (1000/ms<100?(1000/ms).toFixed(3):(1000/ms).toFixed(1)) +'</td></tr>';}).join('');}
$('bpm').addEventListener('input',go);go();