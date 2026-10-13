const $=id=>document.getElementById(id);
const A=['It is certain','It is decidedly so','Without a doubt','Yes definitely','You may rely on it','As I see it, yes','Most likely','Outlook good','Yes','Signs point to yes','Reply hazy, try again','Ask again later','Better not tell you now','Cannot predict now','Concentrate and ask again','Don\'t count on it','My reply is no','My sources say no','Outlook not so good','Very doubtful'];
function go(){const w=$('window');w.style.transform='scale(0.7)';w.style.opacity='0.4';
setTimeout(()=>{w.textContent=A[crypto.getRandomValues(new Uint32Array(1))[0]%A.length];w.style.transform='scale(1)';w.style.opacity='1';},220);}
w0=$('window');$('window').style.transition='all .2s';
$('go').addEventListener('click',go);$('ball').addEventListener('click',go);