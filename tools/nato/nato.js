const NATO={a:'Alpha',b:'Bravo',c:'Charlie',d:'Delta',e:'Echo',f:'Foxtrot',g:'Golf',h:'Hotel',i:'India',j:'Juliett',k:'Kilo',l:'Lima',m:'Mike',n:'November',o:'Oscar',p:'Papa',q:'Quebec',r:'Romeo',s:'Sierra',t:'Tango',u:'Uniform',v:'Victor',w:'Whiskey',x:'X-ray',y:'Yankee',z:'Zulu','0':'Zero','1':'One','2':'Two','3':'Three','4':'Four','5':'Five','6':'Six','7':'Seven','8':'Eight','9':'Nine'};
const inEl=document.getElementById('in'),outEl=document.getElementById('out');
function go(){
  if(!inEl.value){outEl.textContent='—';return;}
  const lines=inEl.value.split('\n').map(line=>{
    return [...line.toLowerCase()].map(ch=>{
      if(NATO[ch])return NATO[ch];
      if(ch===' ')return '·';
      return ch;
    }).join(' ');
  });
  outEl.textContent=lines.join('\n');
}
inEl.addEventListener('input',go);
document.getElementById('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(outEl.textContent);});
go();