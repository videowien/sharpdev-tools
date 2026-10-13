const $=id=>document.getElementById(id);
function gen(){const base=+$('base').value||16,r=+$('ratio').value,up=+$('up').value,down=+$('down').value;
 const steps=[];for(let i=down;i>=1;i--)steps.push(-i);steps.push(0);for(let i=1;i<=up;i++)steps.push(i);
 const rows=steps.map(s=>{const px=base*Math.pow(r,s);return {step:s,px:Math.round(px*100)/100,rem:Math.round(px/16*1000)/1000};});
 $('prev').innerHTML=rows.slice().reverse().map(x=>'<div class="line" style="font-size:'+Math.min(x.px,72)+'px;">Aa <span class="meta">step '+(x.step>0?'+'+x.step:x.step)+' · '+x.px+'px · '+x.rem+'rem</span></div>').join('');
 const vars=rows.map(x=>'  --step-'+(x.step<0?'n'+(-x.step):x.step)+': '+x.rem+'rem;').join('\n');
 $('code').value=':root {\n'+vars+'\n}';}
['base','ratio','up','down'].forEach(id=>{$(id).addEventListener('input',gen);$(id).addEventListener('change',gen);});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('code').value));
gen();