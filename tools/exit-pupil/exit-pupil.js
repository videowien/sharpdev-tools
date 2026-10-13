const $=id=>document.getElementById(id);
function go(){const mode=$('mode').value;
 $('amrow').style.display=mode==='am'?'':'none';
 $('efrow').style.display=mode==='ef'?'':'none';
 let xp=null;
 if(mode==='am'){const ap=+$('ap').value,m=+$('mag').value;if(ap>0&&m>0)xp=ap/m;}
 else{const ep=+$('ep').value,fr=+$('fr').value;if(ep>0&&fr>0)xp=ep/fr;}
 if(xp===null){$('out').textContent='-';$('tip').textContent='-';return;}
 $('out').textContent=(Math.round(xp*100)/100)+' mm';
 let tip;
 if(xp>7)tip='larger than a dark-adapted pupil (~7 mm): light is wasted';
 else if(xp>=2)tip='comfortable sweet spot for most observing';
 else if(xp>=0.5)tip='high-power territory: dimmer view, fine for Moon/planets/doubles';
 else tip='below ~0.5 mm: very dim, floaters become obvious';
 $('tip').textContent=tip;}
['mode','ap','mag','ep','fr'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();