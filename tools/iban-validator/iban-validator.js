const $=id=>document.getElementById(id);
const LEN={AD:24,AT:20,BE:16,CH:21,CZ:24,DE:22,DK:18,ES:24,FI:18,FR:27,GB:22,IE:22,IT:27,NL:18,NO:15,PL:28,PT:25,SE:24,NO:15,LU:20,SK:24,SI:19,HU:28,RO:24,GR:27,HR:21,BG:22,EE:20,LT:20,LV:21,MT:31,CY:28};
const CC={DE:'Germany',GB:'United Kingdom',FR:'France',ES:'Spain',IT:'Italy',NL:'Netherlands',AT:'Austria',CH:'Switzerland',BE:'Belgium',IE:'Ireland',PT:'Portugal',SE:'Sweden',NO:'Norway',DK:'Denmark',FI:'Finland',PL:'Poland',CZ:'Czechia',LU:'Luxembourg'};
function go(){
 const raw=$('in').value.replace(/\s+/g,'').toUpperCase();
 if(!raw){$('result').textContent='—';$('country').textContent='—';$('len').textContent='—';$('fmt').textContent='—';return;}
 const cc=raw.slice(0,2);
 $('country').textContent=CC[cc]||cc;
 $('len').textContent=raw.length+(LEN[cc]?(' / '+LEN[cc]+' expected'):'');
 $('fmt').textContent=raw.replace(/(.{4})/g,'$1 ').trim();
 let valid=/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(raw)&&raw.length>=5;
 if(valid&&LEN[cc]&&raw.length!==LEN[cc])valid=false;
 if(valid){const r=raw.slice(4)+raw.slice(0,4);const num=r.replace(/[A-Z]/g,c=>c.charCodeAt(0)-55);let rem=0;for(const ch of num)rem=(rem*10+(+ch))%97;valid=rem===1;}
 $('result').innerHTML=valid?'<span style="color:#3ddc84;">Valid</span>':'<span style="color:#ff6666;">Invalid</span>';
}
$('in').addEventListener('input',go);go();