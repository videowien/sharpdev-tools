const $=id=>document.getElementById(id);
const DATA={'Happy':['(㇋‿㇋)','(ʘ‿ʘ)','ヾ(≧▽≦)ノ','(☞ﾟヮﾟ)☞','(⌐■_■)','＼(♥▽♥)／','(˘▾˘)','(◕‿◕✿)'],
'Shrug / meh':['¯\\_(ツ)_/¯','¯\\_(ツ)_/¯','(・_・)','(┐ʘ‿ʘ)┌','(´・ω・`)','( ͡° ͜ʖ ͡°)'],
'Love':['(づ｡◕‿‿◕｡)づ','(˘♡˘)','と((*´∀`*))っ','(♥˘͜˘♡)','(˘ᗜ˘)','✌(゜∀゜)✌'],
'Angry':['(งಠ_ಠ)ง','(╯°□°)╯︵ ┻━┻','ヽ(`Д´)ﾉ','ʕ⊙؟⊙ʔ','(　ﾟДﾟ)','o(ﾟдﾟ)o'],
'Sad':['(╥﹏╥)','(ノ付`Д´)ノ','(;´Д`)','q(´ー｀)p','ʕ•̵͜•ʔ','(′㠥`)'],
'Animals':['(≡≡≡̌)','（と・ϐ・と）','(=‘ᴥ‘=)','༼つ ◕_◕ ༽つ','ʍ•ᴥ•ʔ','(´・(‥)・`)'],
'Excited':['\\(゜・∀・゜)/','ヾ(∂∇∂)ﾉ','(๑•̀ㅂ•́)و✧','ヽ(´▽`)/','゜+.(´∀`*).+゜'],
'Table flip':['(╯°□°）╯︵ ┻━┻','┬─┬ ノ( ゜-゜ノ)','(ノ゜□゜)ノ︵┻━┻','┻━┻ ︵ ヽ(°□°ヽ)']};
function build(){const root=$('km');let h='';for(const cat in DATA){h+='<div class="km-cat">'+cat+'</div><div class="km-grid">';DATA[cat].forEach(k=>{h+='<button>'+k.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</button>';});h+='</div>';}root.innerHTML=h;
 root.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{navigator.clipboard.writeText(b.textContent);const t=$('km-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),900);}));}
build();