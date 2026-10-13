const $=id=>document.getElementById(id);
function check10(d){let s=0;for(let i=0;i<9;i++)s+=(+d[i])*(10-i);const c=(11-s%11)%11;return c===10?'X':String(c);}
function check13(d){let s=0;for(let i=0;i<12;i++)s+=(+d[i])*(i%2?3:1);return String((10-s%10)%10);}
function to13(isbn10){const core='978'+isbn10.slice(0,9);return core+check13(core);}
function to10(isbn13){if(isbn13.slice(0,3)!=='978')return null;const core=isbn13.slice(3,12);return core+check10(core);}
function go(){
 const s=$('in').value.replace(/[\s-]/g,'').toUpperCase();
 let valid=false,type='—',conv='—';
 if(/^\d{9}[\dX]$/.test(s)){type='ISBN-10';valid=check10(s)===s[9];if(valid)conv=to13(s).replace(/(\d{3})(\d)(\d{3})(\d{5})(\d)/,'$1-$2-$3-$4-$5');}
 else if(/^\d{13}$/.test(s)){type='ISBN-13';valid=check13(s)===s[12];if(valid){const t=to10(s);conv=t?t:'(no ISBN-10: prefix is not 978)';}}
 else if(s){type='unknown';}
 $('type').textContent=type;
 $('result').innerHTML=s?(valid?'<span style="color:#3ddc84;">Valid</span>':'<span style="color:#ff6666;">Invalid</span>'):'—';
 $('conv').textContent=valid?conv:'—';
}
$('in').addEventListener('input',go);go();