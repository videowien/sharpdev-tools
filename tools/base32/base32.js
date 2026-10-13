const $=id=>document.getElementById(id);
const AL='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function enc(){const bytes=new TextEncoder().encode($('in').value);let bits='';for(const b of bytes)bits+=b.toString(2).padStart(8,'0');let out='';for(let i=0;i<bits.length;i+=5){let c=bits.substr(i,5);if(c.length<5)c=c.padEnd(5,'0');out+=AL[parseInt(c,2)];}while(out.length%8)out+='=';$('out').value=out;}
function dec(){const s=$('in').value.toUpperCase().replace(/=+$/,'').replace(/[^A-Z2-7]/g,'');let bits='';for(const ch of s){const v=AL.indexOf(ch);if(v<0)continue;bits+=v.toString(2).padStart(5,'0');}const bytes=[];for(let i=0;i+8<=bits.length;i+=8)bytes.push(parseInt(bits.substr(i,8),2));try{$('out').value=new TextDecoder('utf-8',{fatal:false}).decode(new Uint8Array(bytes));}catch(e){$('out').value='(invalid Base32)';}}
$('enc').addEventListener('click',enc);$('dec').addEventListener('click',dec);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
enc();