const $=id=>document.getElementById(id);
function go(){const pre=$('pre').value,suf=$('suf').value,skip=$('skip').checked;
 $('out').value=$('in').value.split('\n').map(function(l){return (skip&&l.trim()==='')?l:pre+l+suf;}).join('\n');}
['in','pre','suf','skip'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});go();