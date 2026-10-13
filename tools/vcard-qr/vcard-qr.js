function drawQR(text,cv){const qr=qrcode(0,'M');qr.addData(text);qr.make();const n=qr.getModuleCount(),cell=8,m=4,px=(n+2*m)*cell;cv.width=px;cv.height=px;const ctx=cv.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,px,px);ctx.fillStyle='#000';for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(qr.isDark(r,c))ctx.fillRect((c+m)*cell,(r+m)*cell,cell,cell);}
function dlCanvas(cv,name){const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download=name;a.click();}
const $=id=>document.getElementById(id);
function val(id){return $(id).value.trim();}
function vcard(){const fn=val('first'),ln=val('last');let v='BEGIN:VCARD\nVERSION:3.0\n';v+='N:'+ln+';'+fn+'\n';v+='FN:'+(fn+' '+ln).trim()+'\n';if(val('org'))v+='ORG:'+val('org')+'\n';if(val('title'))v+='TITLE:'+val('title')+'\n';if(val('phone'))v+='TEL;TYPE=CELL:'+val('phone')+'\n';if(val('email'))v+='EMAIL:'+val('email')+'\n';if(val('url'))v+='URL:'+val('url')+'\n';v+='END:VCARD';return v;}
function draw(){drawQR(vcard(),$('cv'));}
['first','last','phone','email','org','title','url'].forEach(id=>$(id).addEventListener('input',draw));
$('dl').addEventListener('click',()=>dlCanvas($('cv'),'contact-qr.png'));
$('vcf').addEventListener('click',()=>{const b=new Blob([vcard()],{type:'text/vcard'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='contact.vcf';a.click();URL.revokeObjectURL(u);});
draw();