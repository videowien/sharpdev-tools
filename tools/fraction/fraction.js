const $=id=>document.getElementById(id);
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}
function dec2frac(x){
  const neg=x<0;x=Math.abs(x);
  let den=1;const s=String(x);const dot=s.indexOf('.');
  if(dot>=0)den=Math.pow(10,s.length-dot-1);
  let num=Math.round(x*den);const g=gcd(num,den);num/=g;den/=g;
  return [neg?-num:num,den];
}
function show(num,den){
  if(!den){$('cards').innerHTML='';return;}
  const g=gcd(num,den);const sn=num/g,sd=den/g;
  const dec=num/den;
  const whole=Math.trunc(sn/sd),rem=Math.abs(sn%sd);
  const mixed=whole&&rem?whole+' '+rem+'/'+sd:(rem?sn+'/'+sd:String(whole));
  const cards=[['Simplified',sn+'/'+sd,true],['Decimal',Math.round(dec*1e6)/1e6+'',false],['Mixed number',mixed,false],['Percent',Math.round(dec*1e4)/100+'%',false]];
  $('cards').innerHTML=cards.map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');
}
function fromFrac(){const m=$('frac').value.match(/(-?\d+)\s*\/\s*(-?\d+)/);if(m)show(+m[1],+m[2]);}
function fromDec(){const x=parseFloat($('dec').value);if(isFinite(x)){const[n,d]=dec2frac(x);show(n,d);}}
$('frac').addEventListener('input',()=>{$('dec').value='';fromFrac();});
$('dec').addEventListener('input',()=>{$('frac').value='';fromDec();});
fromFrac();