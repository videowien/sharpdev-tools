const M={a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'ן',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',A:'∀',B:'ᗺ',C:'Ɔ',D:'ᗡ',E:'Ǝ',F:'Ⅎ',G:'פ',H:'H',I:'I',J:'ſ',K:'ʞ',L:'˥',M:'W',N:'N',O:'O',P:'Ԁ',Q:'Ό',R:'ᴚ',S:'S',T:'⊥',U:'∩',V:'Λ',W:'M',X:'X',Y:'⅄',Z:'Z','1':'Ɩ','2':'ᘔ','3':'Ɛ','4':'ㄣ','5':'Ϛ','6':'9','7':'ㄥ','8':'8','9':'6','0':'0','.':'˙',',':"'",'?':'¿','!':'¡','"':',',"'":',','(':')',')':'(','[':']',']':'[','{':'}','}':'{','<':'>','>':'<','&':'⅋','_':'‾'};
const inEl=document.getElementById('in'),outEl=document.getElementById('out');
function go(){
  const s=inEl.value;
  outEl.textContent=[...s].reverse().map(c=>M[c]||M[c.toLowerCase()]||c).join('')||'‮';
  if(!s)outEl.textContent='';
}
inEl.addEventListener('input',go);
document.getElementById('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(outEl.textContent);});
go();