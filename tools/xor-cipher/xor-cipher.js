const $=id=>document.getElementById(id);
function keyBytes(k){return new TextEncoder().encode(k.length?k:' ');}
function xorBytes(bytes,kb){const out=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)out[i]=bytes[i]^kb[i%kb.length];return out;}
function enc(){const kb=keyBytes($('key').value);const x=xorBytes(new TextEncoder().encode($('in').value),kb);$('out').value=Array.from(x).map(b=>b.toString(16).padStart(2,'0')).join('');}
function dec(){const kb=keyBytes($('key').value);const hex=$('in').value.replace(/[^0-9a-f]/gi,'');const m=hex.match(/.{1,2}/g)||[];const bytes=new Uint8Array(m.map(h=>parseInt(h,16)));try{$('out').value=new TextDecoder('utf-8',{fatal:false}).decode(xorBytes(bytes,kb));}catch(e){$('out').value='(invalid hex / key)';}}
$('enc').addEventListener('click',enc);$('dec').addEventListener('click',dec);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
enc();