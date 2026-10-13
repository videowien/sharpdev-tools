const $=id=>document.getElementById(id);
function toRGB(c){const d=document.createElement('div');d.style.color=c;document.body.appendChild(d);const m=getComputedStyle(d).color.match(/[\d.]+/g);d.remove();return m?m.slice(0,3).map(Number):null;}
function lin(c){c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function rgb2oklab(R,G,B){const r=lin(R),g=lin(G),b=lin(B);const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b),m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b),s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);return [0.2104542553*l+0.7936177850*m-0.0040720468*s,1.9779984951*l-2.4285922050*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.8086757660*s];}
function rgb2xyz(R,G,B){const r=lin(R),g=lin(G),b=lin(B);return [r*0.4124564+g*0.3575761+b*0.1804375,r*0.2126729+g*0.7151522+b*0.0721750,r*0.0193339+g*0.1191920+b*0.9503041];}
function xyz2lab(x,y,z){x/=0.95047;z/=1.08883;const f=t=>t>0.008856?Math.cbrt(t):7.787*t+16/116;const fx=f(x),fy=f(y),fz=f(z);return [116*fy-16,500*(fx-fy),200*(fy-fz)];}
function lch(a,b){const C=Math.sqrt(a*a+b*b);let H=Math.atan2(b,a)*180/Math.PI;if(H<0)H+=360;return [C,H];}
function rgb2hwb(R,G,B){const r=R/255,g=G/255,b=B/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0;const d=mx-mn;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360;}return [Math.round(h),Math.round(mn*100),Math.round((1-mx)*100)];}
function r3(n){return Math.round(n*1000)/1000;}
function go(c){const rgb=toRGB(c);if(!rgb){$('formats').innerHTML='<p style="color:#ff6666;">Not a valid colour.</p>';return;}const[R,G,B]=rgb.map(Math.round);const hex='#'+[R,G,B].map(x=>x.toString(16).padStart(2,'0')).join('');$('swatch').style.background=hex;
 const ok=rgb2oklab(R,G,B),okc=lch(ok[1],ok[2]);const xyz=rgb2xyz(R,G,B),lab=xyz2lab(...xyz),labc=lch(lab[1],lab[2]);const hwb=rgb2hwb(R,G,B);
 const rows=[['oklch','oklch('+r3(ok[0])+' '+r3(okc[0])+' '+r3(okc[1])+')'],['oklab','oklab('+r3(ok[0])+' '+r3(ok[1])+' '+r3(ok[2])+')'],['lab','lab('+r3(lab[0])+' '+r3(lab[1])+' '+r3(lab[2])+')'],['lch','lch('+r3(lab[0])+' '+r3(labc[0])+' '+r3(labc[1])+')'],['hwb','hwb('+hwb[0]+' '+hwb[1]+'% '+hwb[2]+'%)'],['hex',hex],['rgb','rgb('+R+', '+G+', '+B+')']];
 $('formats').innerHTML=rows.map(([k,v])=>'<div class="fmt-row"><code title="Click to copy" data-v="'+v+'">'+v+'</code></div>').join('');
 document.querySelectorAll('.fmt-row code').forEach(el=>el.addEventListener('click',()=>navigator.clipboard.writeText(el.dataset.v)));}
$('in').addEventListener('input',()=>{$('pick').value=/^#[0-9a-f]{6}$/i.test($('in').value)?$('in').value:$('pick').value;go($('in').value);});
$('pick').addEventListener('input',()=>{$('in').value=$('pick').value;go($('pick').value);});
go($('in').value);