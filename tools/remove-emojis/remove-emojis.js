const $=id=>document.getElementById(id);
function go(){let o=$('in').value.replace(/[\p{Extended_Pictographic}\u{1F000}-\u{1FAFF}\u{1F900}-\u{1F9FF}\u{2600}-\u{27BF}]/gu,'').replace(/[️‍⃣]/g,'').replace(/[ \t]{2,}/g,' ');
$('out').textContent=o;}
$('in').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();