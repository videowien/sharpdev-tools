const $=id=>document.getElementById(id);
function caesar(s,sh){sh=((sh%26)+26)%26;return s.replace(/[a-z]/gi,c=>{const b=c<='Z'?65:97;return String.fromCharCode((c.charCodeAt(0)-b+sh)%26+b);});}
function enc(){$('out').value=caesar($('in').value,parseInt($('shift').value)||0);}
function dec(){$('out').value=caesar($('in').value,-(parseInt($('shift').value)||0));}
$('enc').addEventListener('click',enc);$('dec').addEventListener('click',dec);
$('in').addEventListener('input',enc);$('shift').addEventListener('input',enc);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
enc();