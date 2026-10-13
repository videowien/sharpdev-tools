const $=id=>document.getElementById(id);
function gen(){
 const minF=parseFloat($('minf').value),maxF=parseFloat($('maxf').value),minV=parseFloat($('minv').value),maxV=parseFloat($('maxv').value);
 if(![minF,maxF,minV,maxV].every(isFinite)||maxV===minV){$('out').textContent='—';return;}
 const slope=(maxF-minF)/(maxV-minV);
 const intercept=minF-slope*minV;
 const rem=v=>Math.round(v/16*10000)/10000;
 const cl='clamp('+rem(Math.min(minF,maxF))+'rem, '+rem(intercept)+'rem + '+(Math.round(slope*100*10000)/10000)+'vw, '+rem(Math.max(minF,maxF))+'rem)';
 $('out').textContent='font-size: '+cl+';';
 $('sample').style.fontSize=cl;
}
['minf','maxf','minv','maxv'].forEach(id=>$(id).addEventListener('input',gen));
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').textContent));
gen();