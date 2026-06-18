const $=id=>document.getElementById(id);
function minify(svg){
  return svg
    .replace(/<!--[\s\S]*?-->/g,'')
    .replace(/<\?xml[\s\S]*?\?>/g,'')
    .replace(/<!DOCTYPE[\s\S]*?>/gi,'')
    .replace(/<metadata[\s\S]*?<\/metadata>/gi,'')
    .replace(/<(sodipodi|inkscape)[^>]*>/gi,'')
    .replace(/\s(sodipodi|inkscape|xmlns:sodipodi|xmlns:inkscape|xmlns:dc|xmlns:cc|xmlns:rdf):[a-z-]+="[^"]*"/gi,'')
    .replace(/>\s+</g,'><')
    .replace(/\s{2,}/g,' ')
    .replace(/\s*\/>/g,'/>')
    .trim();
}
function go(){
  const raw=$('in').value;
  if(!raw.trim()){$('out').textContent='';$('stats').innerHTML='';return;}
  const min=minify(raw);
  const before=raw.length,after=min.length,saved=before?Math.round((1-after/before)*100):0;
  $('stats').innerHTML=[['Before',before+' B'],['After',after+' B'],['Saved',saved+'%']].map(([l,v],i)=>`<div class="result-card${i===2?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');
  const fmt=$('fmt').value;
  if(fmt==='svg'){$('out').textContent=min;}
  else{
    const enc=encodeURIComponent(min).replace(/'/g,'%27').replace(/"/g,'%22');
    const uri='data:image/svg+xml,'+enc;
    $('out').textContent=fmt==='css'?'background-image: url("'+uri+'");':'<img src="'+uri+'" alt="" />';
  }
}
['in','fmt'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();