const $=id=>document.getElementById(id);
function go(){const raw=$('in').value;const norm=raw.toLowerCase().replace(/[^a-z0-9]/g,'');const rev=[...norm].reverse().join('');
if(!raw.trim()){$('verdict').textContent='—';$('verdict').style.color='#888';$('norm').style.display='none';return;}
const isP=norm.length>0&&norm===rev;
$('verdict').textContent=isP?'✓ Yes, it is a palindrome':'✗ Not a palindrome';
$('verdict').style.color=isP?'#44dd88':'#ff6666';
$('norm').style.display='block';$('norm').textContent='Compared (letters and digits only): '+norm;}
$('in').addEventListener('input',go);go();