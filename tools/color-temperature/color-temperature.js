const $=id=>document.getElementById(id);
function k2rgb(k){k/=100;let r,g,b;if(k<=66){r=255;g=99.4708025861*Math.log(k)-161.1195681661;}else{r=329.698727446*Math.pow(k-60,-0.1332047592);g=288.1221695283*Math.pow(k-60,-0.0755148492);}if(k>=66)b=255;else if(k<=19)b=0;else b=138.5177312231*Math.log(k-10)-305.0447927307;const cl=x=>Math.round(Math.max(0,Math.min(255,x)));return [cl(r),cl(g),cl(b)];}
function hex(r,g,b){return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');}
function label(k){return k<2200?'Candlelight':k<3200?'Warm / tungsten':k<4500?'Soft white':k<5500?'Neutral white':k<7000?'Daylight':k<9000?'Overcast':'Cool blue';}
function go(){const k=+$('k').value;$('kval').textContent=k;const rgb=k2rgb(k);const h=hex(...rgb);$('swatch').style.background=h;$('hex').textContent=h;$('rgb').textContent='rgb('+rgb.join(', ')+')';$('desc').textContent=label(k);}
$('k').addEventListener('input',go);go();