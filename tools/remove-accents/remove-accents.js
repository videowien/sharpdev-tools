const $=id=>document.getElementById(id);
const EX={'ø':'o','Ø':'O','æ':'ae','Æ':'AE','œ':'oe','Œ':'OE','ß':'ss','ð':'d','Ð':'D','þ':'th','Þ':'Th','ł':'l','Ł':'L'};
function strip(s){return s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[øØæÆœŒßðÐþÞłŁ]/g,c=>EX[c]||c);}
function go(){$('out').value=strip($('in').value);}
$('in').addEventListener('input',go);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
go();