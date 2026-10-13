const $=id=>document.getElementById(id);
function gcd(a,b){return b?gcd(b,a%b):a;}
function ratio(w,h){const g=gcd(w,h)||1;return (w/g)+':'+(h/g);}
function upd(){
 const sw=screen.width,sh=screen.height;
 $('res').textContent=sw+' × '+sh;
 $('vp').textContent=window.innerWidth+' × '+window.innerHeight;
 $('dpr').textContent=(window.devicePixelRatio||1).toFixed(2);
 $('ar').textContent=ratio(sw,sh);
 $('cd').textContent=(screen.colorDepth||24)+'-bit';
 const o=(screen.orientation&&screen.orientation.type)?screen.orientation.type:(window.innerWidth>=window.innerHeight?'landscape':'portrait');
 $('ori').textContent=o.replace('-primary','').replace('-secondary','');
 $('avail').textContent=screen.availWidth+' × '+screen.availHeight;
 $('touch').textContent=(navigator.maxTouchPoints||0);
}
window.addEventListener('resize',upd);
if(screen.orientation&&screen.orientation.addEventListener)screen.orientation.addEventListener('change',upd);
upd();