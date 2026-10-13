const $=id=>document.getElementById(id);
function vig(text,key,dec){
  key=key.toUpperCase().replace(/[^A-Z]/g,'');if(!key)return text;
  let ki=0,out='';
  for(const ch of text){
    const up=ch.toUpperCase();
    if(up>='A'&&up<='Z'){
      const base=ch===up?65:97;
      let k=key.charCodeAt(ki%key.length)-65;if(dec)k=26-k;
      out+=String.fromCharCode((ch.charCodeAt(0)-base+k)%26+base);ki++;
    }else out+=ch;
  }
  return out;
}
let mode='enc';
function run(){$('out').textContent=vig($('in').value,$('key').value,mode==='dec');}
$('enc').addEventListener('click',()=>{mode='enc';run();});
$('dec').addEventListener('click',()=>{mode='dec';run();});
['in','key'].forEach(id=>$(id).addEventListener('input',run));
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
run();