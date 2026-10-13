const $=id=>document.getElementById(id);
const COC={ff:0.029,apsc:0.019,canon:0.018,mft:0.015,one:0.011};
function fmtD(m){if(!isFinite(m)||m<0)return '∞';if(m<1)return Math.round(m*100)+' cm';if(m<10)return (Math.round(m*100)/100)+' m';return (Math.round(m*10)/10)+' m';}
function go(){const f=+$('f').value,N=+$('N').value,s=(+$('s').value)*1000,c=COC[$('sensor').value];
 if(!(f>0&&N>0&&s>0&&c>0)){['near','far','total','hyp'].forEach(id=>$(id).textContent='-');return;}
 const H=f*f/(N*c)+f;
 const near=s*(H-f)/(H+s-2*f);
 const den=H-s;const far=den<=0?Infinity:s*(H-f)/den;
 const total=far-near;
 $('hyp').textContent=fmtD(H/1000);
 $('near').textContent=fmtD(near/1000);
 $('far').textContent=fmtD(far/1000);
 $('total').textContent=isFinite(total)?fmtD(total/1000):'∞';}
['f','N','s','sensor'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();