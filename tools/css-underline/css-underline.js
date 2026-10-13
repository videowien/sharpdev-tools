const $=id=>document.getElementById(id);
function gen(){
 const st=$('style').value,c=$('color').value,t=+$('thick').value||2,o=+$('offset').value||0,skip=$('skip').checked;
 const s=$('sample');
 s.style.textDecorationLine='underline';s.style.textDecorationStyle=st;s.style.textDecorationColor=c;
 s.style.textDecorationThickness=t+'px';s.style.textUnderlineOffset=o+'px';s.style.textDecorationSkipInk=skip?'auto':'none';
 $('code').value='text-decoration: underline;\ntext-decoration-style: '+st+';\ntext-decoration-color: '+c+';\ntext-decoration-thickness: '+t+'px;\ntext-underline-offset: '+o+'px;\ntext-decoration-skip-ink: '+(skip?'auto':'none')+';';
}
['style','color','thick','offset','skip'].forEach(id=>{$(id).addEventListener('input',gen);$(id).addEventListener('change',gen);});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('code').value));
gen();