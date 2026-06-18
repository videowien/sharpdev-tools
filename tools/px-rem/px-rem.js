const $=id=>document.getElementById(id);
function setAll(px){
  const base=+$('base').value||16;
  const r=Math.round(px/base*1e4)/1e4;
  $('rem').value=r;$('em').value=r;$('pt').value=Math.round(px*72/96*1e4)/1e4;$('pct').value=Math.round(px/base*100*100)/100;$('px').value=Math.round(px*1e4)/1e4;
}
function fromPx(){setAll(+$('px').value||0);}
function fromRem(){setAll((+$('rem').value||0)*(+$('base').value||16));}
function fromEm(){setAll((+$('em').value||0)*(+$('base').value||16));}
function fromPt(){setAll((+$('pt').value||0)*96/72);}
function fromPct(){setAll((+$('pct').value||0)/100*(+$('base').value||16));}
$('px').addEventListener('input',fromPx);$('rem').addEventListener('input',fromRem);$('em').addEventListener('input',fromEm);$('pt').addEventListener('input',fromPt);$('pct').addEventListener('input',fromPct);$('base').addEventListener('input',fromPx);
fromPx();