const $=id=>document.getElementById(id);
const A='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function enc(bytes){
  let zeros=0;while(zeros<bytes.length&&bytes[zeros]===0)zeros++;
  const digits=[0];
  for(let i=zeros;i<bytes.length;i++){let carry=bytes[i];for(let j=0;j<digits.length;j++){carry+=digits[j]<<8;digits[j]=carry%58;carry=(carry/58)|0;}while(carry){digits.push(carry%58);carry=(carry/58)|0;}}
  let out='1'.repeat(zeros);for(let i=digits.length-1;i>=0;i--)out+=A[digits[i]];
  return out;
}
function dec(str){
  let zeros=0;while(zeros<str.length&&str[zeros]==='1')zeros++;
  const bytes=[0];
  for(let i=zeros;i<str.length;i++){const v=A.indexOf(str[i]);if(v<0)throw new Error('Invalid Base58 character: '+str[i]);let carry=v;for(let j=0;j<bytes.length;j++){carry+=bytes[j]*58;bytes[j]=carry&255;carry>>=8;}while(carry){bytes.push(carry&255);carry>>=8;}}
  const out=new Uint8Array(zeros+bytes.length);for(let i=0;i<bytes.length;i++)out[zeros+i]=bytes[bytes.length-1-i];
  return new TextDecoder().decode(out);
}
let mode='enc';
function run(){
  const v=$('in').value;if(!v){$('out').textContent='';return;}
  try{
    if(mode==='enc')$('out').textContent=enc(new TextEncoder().encode(v));
    else $('out').textContent=dec(v.trim());
    $('out').style.color='';
  }catch(e){$('out').textContent=e.message;$('out').style.color='#ff6666';}
}
$('enc').addEventListener('click',()=>{mode='enc';run();});
$('dec').addEventListener('click',()=>{mode='dec';run();});
$('in').addEventListener('input',run);
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
run();