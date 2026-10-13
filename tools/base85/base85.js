const $=id=>document.getElementById(id);
function enc(str){const bytes=new TextEncoder().encode(str);let out='';for(let i=0;i<bytes.length;i+=4){const chunk=bytes.slice(i,i+4),pad=4-chunk.length;let n=0;for(let j=0;j<4;j++)n=(n*256+(chunk[j]||0))>>>0;let block='';let m=n;for(let j=0;j<5;j++){block=String.fromCharCode(33+m%85)+block;m=Math.floor(m/85);}out+=block.slice(0,5-pad);}return out;}
function dec(s){s=s.replace(/\s/g,'').replace(/^<~|~>$/g,'');const out=[];for(let i=0;i<s.length;i+=5){let chunk=s.slice(i,i+5),pad=5-chunk.length;chunk+='u'.repeat(pad);let n=0;for(const c of chunk){const v=c.charCodeAt(0)-33;if(v<0||v>84)return '(invalid Base85)';n=n*85+v;}const b=[];let m=n;for(let j=0;j<4;j++){b.unshift(m&255);m=Math.floor(m/256);}for(let j=0;j<4-pad;j++)out.push(b[j]);}try{return new TextDecoder('utf-8',{fatal:false}).decode(new Uint8Array(out));}catch(e){return '(invalid Base85)';}}
$('enc').addEventListener('click',()=>$('out').value=enc($('in').value));
$('dec').addEventListener('click',()=>$('out').value=dec($('in').value));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('enc').click();