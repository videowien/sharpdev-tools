const $=id=>document.getElementById(id);
const BASIC={a:'4',e:'3',i:'1',o:'0'};
const FULL={a:'4',b:'8',c:'(',e:'3',g:'6',i:'1',l:'1',o:'0',s:'5',t:'7',z:'2'};
function go(){const map=$('level').value==='full'?FULL:BASIC;
$('out').textContent=[...$('in').value].map(c=>{const l=c.toLowerCase();return map[l]||c;}).join('');}
['in','level'].forEach(id=>$(id).addEventListener('input',go));
$('copy').addEventListener('click',()=>navigator.clipboard&&navigator.clipboard.writeText($('out').textContent));go();