const $=id=>document.getElementById(id);
function parse(s){const d=document.createElement('div');return s.split('\n').map(x=>x.trim()).filter(Boolean).map(c=>{d.style.color='';d.style.color=c;return d.style.color?c:null;}).filter(Boolean);}
function toRGB(c){const d=document.createElement('div');d.style.color=c;document.body.appendChild(d);const m=getComputedStyle(d).color.match(/\d+/g);d.remove();return m?m.slice(0,3).map(Number):[0,0,0];}
function lum(r,g,b){const f=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);}
function ratio(a,b){const la=lum(...a),lb=lum(...b);return (Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05);}
function go(){const cols=parse($('in').value);if(cols.length<2){$('grid').innerHTML='<p style="color:#888;">Enter at least two valid colours.</p>';return;}
 const rgb=cols.map(toRGB);let h='<table class="cg"><tr><th>text \\ bg</th>'+cols.map(c=>'<th style="background:'+c+';color:'+c+';">'+c+'</th>').join('')+'</tr>';
 for(let r=0;r<cols.length;r++){h+='<tr><th>'+cols[r]+'</th>';for(let c=0;c<cols.length;c++){const v=ratio(rgb[r],rgb[c]);const aaa=v>=7,aa=v>=4.5,aaL=v>=3;const col=aaa?'#3ddc84':aa?'#ffcc33':aaL?'#ff8844':'#ff5555';h+='<td style="background:'+cols[c]+';color:'+cols[r]+';"><div class="ratio">'+(Math.round(v*100)/100)+'</div><div class="badge" style="color:'+col+';">'+(aaa?'AAA':aa?'AA':aaL?'AA Lg':'fail')+'</div></td>';}h+='</tr>';}
 $('grid').innerHTML=h+'</table>';}
$('in').addEventListener('input',go);go();