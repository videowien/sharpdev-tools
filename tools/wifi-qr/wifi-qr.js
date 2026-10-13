function drawQR(text,cv){const qr=qrcode(0,'M');qr.addData(text);qr.make();const n=qr.getModuleCount(),cell=8,m=4,px=(n+2*m)*cell;cv.width=px;cv.height=px;const ctx=cv.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,px,px);ctx.fillStyle='#000';for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(qr.isDark(r,c))ctx.fillRect((c+m)*cell,(r+m)*cell,cell,cell);}
function dlCanvas(cv,name){const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download=name;a.click();}
const $=id=>document.getElementById(id);
function esc(s){return String(s).replace(/([\\;,:"])/g,'\\$1');}
function content(){const enc=$('enc').value;const ssid=esc($('ssid').value);const h=$('hidden').checked?'true':'false';if(enc==='nopass')return 'WIFI:T:nopass;S:'+ssid+';H:'+h+';;';return 'WIFI:T:'+enc+';S:'+ssid+';P:'+esc($('pw').value)+';H:'+h+';;';}
function draw(){$('pw').disabled=$('enc').value==='nopass';drawQR(content(),$('cv'));}
['ssid','pw','enc','hidden'].forEach(id=>{$(id).addEventListener('input',draw);$(id).addEventListener('change',draw);});
$('dl').addEventListener('click',()=>dlCanvas($('cv'),'wifi-qr.png'));
draw();