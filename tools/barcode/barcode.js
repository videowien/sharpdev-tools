const $=id=>document.getElementById(id);
function go(){
  $('w-val').textContent=$('bw').value;$('h-val').textContent=$('bh').value;
  if(!window.JsBarcode){setTimeout(go,120);return;}
  try{
    JsBarcode('#bc',$('val').value||' ',{format:$('fmt').value,width:+$('bw').value,height:+$('bh').value,displayValue:$('showtext').checked,margin:8});
    $('bc-err').style.display='none';$('bc').style.display='';
  }catch(e){$('bc-err').textContent='Cannot encode this data as '+$('fmt').value+': '+(e.message||'invalid input for this format');$('bc-err').style.display='block';}
}
['val','fmt','bw','bh','showtext'].forEach(id=>$(id).addEventListener('input',go));
function svgStr(){const s=$('bc');return '<?xml version="1.0"?>\n'+new XMLSerializer().serializeToString(s);}
$('svg').addEventListener('click',()=>{const blob=new Blob([svgStr()],{type:'image/svg+xml'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='barcode.svg';a.click();});
$('png').addEventListener('click',()=>{const s=$('bc');const xml=new XMLSerializer().serializeToString(s);const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=img.width||300;c.height=img.height||120;const cx=c.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,c.width,c.height);cx.drawImage(img,0,0);const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='barcode.png';a.click();};img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(xml)));});
window.addEventListener('load',go);go();