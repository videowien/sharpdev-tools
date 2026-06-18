const $=id=>document.getElementById(id);
const AL='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randBytes(n){return crypto.getRandomValues(new Uint8Array(n));}
function toHex(b){return [...b].map(x=>x.toString(16).padStart(2,'0')).join('');}
function toB64(b,url){let s=btoa(String.fromCharCode(...b));if(url)s=s.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');return s;}
function key(fmt,len){
  if(fmt==='hex')return toHex(randBytes(Math.ceil(len/2))).slice(0,len);
  if(fmt==='alnum'){const b=randBytes(len);let s='';for(let i=0;i<len;i++)s+=AL[b[i]%AL.length];return s;}
  const raw=toB64(randBytes(len),fmt==='b64url');return raw.slice(0,len);
}
function go(){
  const fmt=$('fmt').value,len=Math.min(512,Math.max(4,+$('len').value||32)),n=Math.min(200,Math.max(1,+$('count').value||1));
  const out=[];for(let i=0;i<n;i++)out.push(key(fmt,len));
  $('out').textContent=out.join('\n');
}
$('gen').addEventListener('click',go);$('fmt').addEventListener('change',go);
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();