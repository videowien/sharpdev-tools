const $=id=>document.getElementById(id);
function h2r(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function r2h(r,g,b){return '#'+[r,g,b].map(function(x){return Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0');}).join('');}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),h,s,l=(mx+mn)/2;if(mx===mn){h=s=0;}else{var d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);switch(mx){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4;}h/=6;}return [h*360,s*100,l*100];}
function hsl2rgb(h,s,l){h/=360;s/=100;l/=100;var r,g,b;if(s===0){r=g=b=l;}else{var q=l<0.5?l*(1+s):l+s-l*s;var p=2*l-q;function hue(t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;}r=hue(h+1/3);g=hue(h);b=hue(h-1/3);}return [r*255,g*255,b*255];}
function rot(hsl,deg){return [(hsl[0]+deg+360)%360,hsl[1],hsl[2]];}
function fromHsl(hsl){var c=hsl2rgb(hsl[0],hsl[1],hsl[2]);return r2h(c[0],c[1],c[2]);}
function build(){var base=h2r($('base').value);var hsl=rgb2hsl(base[0],base[1],base[2]);var harm=$('harm').value;var cols=[];
if(harm==='comp')cols=[hsl,rot(hsl,30),rot(hsl,180),rot(hsl,210),[hsl[0],hsl[1],Math.min(95,hsl[2]+25)]];
else if(harm==='analog')cols=[rot(hsl,-60),rot(hsl,-30),hsl,rot(hsl,30),rot(hsl,60)];
else if(harm==='triad')cols=[hsl,rot(hsl,120),rot(hsl,240),[hsl[0],hsl[1],Math.min(95,hsl[2]+20)],[hsl[0],Math.max(10,hsl[1]-20),Math.max(15,hsl[2]-20)]];
else if(harm==='tetrad')cols=[hsl,rot(hsl,90),rot(hsl,180),rot(hsl,270),[hsl[0],hsl[1],Math.min(92,hsl[2]+22)]];
else cols=[[hsl[0],hsl[1],90],[hsl[0],hsl[1],72],[hsl[0],hsl[1],54],[hsl[0],hsl[1],36],[hsl[0],hsl[1],20]];
var hexes=cols.map(fromHsl);
$('sw').innerHTML=hexes.map(function(hx){return '<div class="sd-sw" data-hex="'+hx+'" style="background:'+hx+';" title="Copy '+hx+'">'+hx+'</div>';}).join('');
Array.prototype.forEach.call(document.querySelectorAll('.sd-sw'),function(el){el.addEventListener('click',function(){navigator.clipboard.writeText(el.getAttribute('data-hex'));el.textContent='Copied!';setTimeout(function(){el.textContent=el.getAttribute('data-hex');},800);});});}
$('base').addEventListener('input',build);$('harm').addEventListener('change',build);
$('rnd').addEventListener('click',function(){var h='#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');$('base').value=h;build();});
build();