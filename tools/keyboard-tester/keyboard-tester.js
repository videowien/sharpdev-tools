const $=id=>document.getElementById(id);
const held=new Set();let count=0;const hist=[];
const box=$('kt');
const PREVENT=new Set([' ','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','PageUp','PageDown','Home','End','Backspace']);
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function label(e){return e.key===' '?'Space':e.key;}
function renderHeld(){if(held.size===0){$('held').innerHTML='<span style="color:#666;">none</span>';return;}$('held').innerHTML=Array.from(held).map(k=>'<span class="chip">'+esc(k)+'</span>').join('');}
window.addEventListener('keydown',function(e){
 if(PREVENT.has(e.key))e.preventDefault();
 box.classList.add('hit');
 const lk=label(e);
 $('kkey').textContent=lk;
 $('kcodes').textContent=(e.code||'?')+' · keyCode '+e.keyCode;
 $('vkey').textContent=lk;$('vcode').textContent=e.code||'—';$('vwhich').textContent=e.keyCode;
 if(!e.repeat){count++;$('vcount').textContent=count;hist.push(lk+'  ('+(e.code||'?')+', '+e.keyCode+')');if(hist.length>200)hist.shift();$('hist').value=hist.join('\n');$('hist').scrollTop=$('hist').scrollHeight;}
 held.add(e.code||lk);renderHeld();
});
window.addEventListener('keyup',function(e){held.delete(e.code||label(e));if(held.size===0)box.classList.remove('hit');renderHeld();});
$('clear').addEventListener('click',function(){count=0;hist.length=0;$('hist').value='';$('vcount').textContent='0';});
box.addEventListener('click',()=>box.focus());
box.focus();