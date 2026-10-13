const $=id=>document.getElementById(id);let mode='enc';
function go(){const v=$('in').value;if(!v){$('out').textContent='';return;}
try{if(mode==='enc'){const b=new TextEncoder().encode(v);$('out').textContent=[...b].map(x=>x.toString(16).padStart(2,'0')).join(' ');}
else{const hex=v.replace(/0x/gi,'').replace(/[^0-9a-fA-F]/g,'');if(hex.length%2)throw new Error('odd number of hex digits');const b=new Uint8Array(hex.match(/../g).map(h=>parseInt(h,16)));$('out').textContent=new TextDecoder().decode(b);}
$('out').style.color='';}catch(e){$('out').textContent='Error: '+e.message;$('out').style.color='#ff6666';}}
$('enc').addEventListener('click',()=>{mode='enc';go();});$('dec').addEventListener('click',()=>{mode='dec';go();});
$('in').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();