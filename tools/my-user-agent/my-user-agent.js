const $=id=>document.getElementById(id);
const ua=navigator.userAgent;
$('ua').value=ua;
function guessBrowser(u){
 if(/Edg\//.test(u))return 'Edge';
 if(/OPR\//.test(u)||/Opera/.test(u))return 'Opera';
 if(/Firefox\//.test(u))return 'Firefox';
 if(/Chrome\//.test(u))return 'Chrome';
 if(/Safari\//.test(u)&&/Version\//.test(u))return 'Safari';
 return 'Unknown';
}
function guessOS(u){
 if(/Windows NT 10/.test(u))return 'Windows 10 or 11';
 if(/Windows/.test(u))return 'Windows';
 if(/Mac OS X/.test(u))return 'macOS';
 if(/Android/.test(u))return 'Android';
 if(/(iPhone|iPad|iPod)/.test(u))return 'iOS';
 if(/Linux/.test(u))return 'Linux';
 return 'Unknown';
}
function guessDevice(u){
 if(/iPad|Tablet/.test(u))return 'Tablet';
 if(/Mobile|iPhone|iPod/.test(u))return 'Mobile';
 return 'Desktop';
}
$('br').textContent=guessBrowser(ua);
$('os').textContent=guessOS(ua);
$('dev').textContent=guessDevice(ua);
$('lang').textContent=(navigator.languages&&navigator.languages.join(', '))||navigator.language||'—';
$('copy').addEventListener('click',()=>navigator.clipboard.writeText(ua));