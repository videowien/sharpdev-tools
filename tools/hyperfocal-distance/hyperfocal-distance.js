const $=id=>document.getElementById(id);
const COC={ff:0.029,apsc:0.019,canon:0.018,mft:0.015,one:0.011};
function fmtD(m){if(!isFinite(m))return '∞';if(m<1)return Math.round(m*100)+' cm';if(m<10)return (Math.round(m*100)/100)+' m';return (Math.round(m*10)/10)+' m';}
function go(){const f=+$('f').value,N=+$('N').value,c=COC[$('sensor').value];
 if(!(f>0&&N>0&&c>0)){$('h').textContent='-';$('near').textContent='-';return;}
 const H=f*f/(N*c)+f;
 $('h').textContent=fmtD(H/1000);$('near').textContent=fmtD(H/2000)+' to ∞';}
['f','N','sensor'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();