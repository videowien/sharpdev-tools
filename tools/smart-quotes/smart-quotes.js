const $=id=>document.getElementById(id);
function curl(s){if($('dash').checked){s=s.replace(/---/g,'—').replace(/--/g,'–').replace(/\.\.\./g,'…');}return s.replace(/(^|[\s([{<–—])"/g,'$1“').replace(/"/g,'”').replace(/(^|[\s([{<–—])'/g,'$1‘').replace(/'/g,'’');}
function straighten(s){return s.replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[–—]/g,'-').replace(/…/g,'...');}
$('curl').addEventListener('click',()=>{$('out').value=curl($('in').value);});
$('straight').addEventListener('click',()=>{$('out').value=straighten($('in').value);});
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
$('curl').click();