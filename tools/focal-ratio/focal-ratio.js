const $=id=>document.getElementById(id);
function go(){const s=$('solve').value,fl=+$('fl').value,ap=+$('ap').value,fr=+$('fr').value;
 $('flwrap').style.display=s==='fl'?'none':'';
 $('apwrap').style.display=s==='ap'?'none':'';
 $('frwrap').style.display=s==='f'?'none':'';
 $('olabel').textContent=s==='f'?'Focal ratio':(s==='fl'?'Focal length':'Aperture');
 let v=null;
 if(s==='f'&&fl>0&&ap>0)v='f/'+(Math.round(fl/ap*100)/100);
 if(s==='fl'&&fr>0&&ap>0)v=(Math.round(fr*ap*10)/10)+' mm';
 if(s==='ap'&&fr>0&&fl>0)v=(Math.round(fl/fr*10)/10)+' mm';
 $('out').textContent=v===null?'-':v;}
['solve','fl','ap','fr'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();