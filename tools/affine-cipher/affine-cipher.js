const $=id=>document.getElementById(id);
function gcd(a,b){return b?gcd(b,a%b):a;}
function modinv(a){a=((a%26)+26)%26;for(let x=1;x<26;x++)if((a*x)%26===1)return x;return null;}
function valid(a){return gcd(((a%26)+26)%26,26)===1;}
function enc(s,a,b){return s.toUpperCase().replace(/[A-Z]/g,c=>String.fromCharCode((a*(c.charCodeAt(0)-65)+b)%26+65));}
function dec(s,a,b){const ai=modinv(a);if(ai===null)return '';return s.toUpperCase().replace(/[A-Z]/g,c=>String.fromCharCode((ai*(((c.charCodeAt(0)-65)-b)%26+26*99))%26+65));}
function params(){return [parseInt($('a').value)||1,((parseInt($('b').value)||0)%26+26)%26];}
function check(){const [a]=params();const w=$('warn');if(!valid(a)){w.style.display='block';w.textContent='a = '+a+' is not coprime with 26, so the cipher is not reversible. Use 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23 or 25.';return false;}w.style.display='none';return true;}
$('enc').addEventListener('click',()=>{if(check()){const [a,b]=params();$('out').value=enc($('in').value,a,b);}});
$('dec').addEventListener('click',()=>{if(check()){const [a,b]=params();$('out').value=dec($('in').value,a,b);}});
['a','b'].forEach(id=>$(id).addEventListener('input',check));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
check();$('enc').click();