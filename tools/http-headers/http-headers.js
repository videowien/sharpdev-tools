const $=id=>document.getElementById(id);
const SEC=[
  ['strict-transport-security','HSTS'],
  ['content-security-policy','Content-Security-Policy'],
  ['x-frame-options','X-Frame-Options'],
  ['x-content-type-options','X-Content-Type-Options'],
  ['referrer-policy','Referrer-Policy'],
  ['permissions-policy','Permissions-Policy']
];
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
async function check(){
  const u=$('url').value.trim();
  if(!u)return;
  $('err').style.display='none';$('sec').innerHTML='';$('tbl').innerHTML='';
  $('meta').innerHTML='<div class="result-card"><div class="label">Fetching</div><div class="value">…</div></div>';
  try{
    const r=await fetch('/api/inspect?url='+encodeURIComponent(u));
    const d=await r.json();
    const chain=d.chain||[];
    const last=chain[chain.length-1];
    if(!last||!last.headers){$('meta').innerHTML='';$('err').textContent=d.error||'No response headers received.';$('err').style.display='block';return;}
    const H=last.headers;
    $('meta').innerHTML=[
      ['Status',last.status+'',true],
      ['Headers',Object.keys(H).length+'',false],
      ['Redirects',(chain.length-1)+'',false],
      ['Server',H['server']||'—',false]
    ].map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value" style="font-size:16px">${esc(v)}</div></div>`).join('');
    $('sec').innerHTML='<div class="sec-grid">'+SEC.map(([k,label])=>{
      const ok=k in H;
      return `<div class="sec-item"><span class="dot ${ok?'ok':'miss'}"></span>${label}: ${ok?'present':'missing'}</div>`;
    }).join('')+'</div>';
    const rows=Object.keys(H).sort().map(k=>`<tr><td>${esc(k)}</td><td>${esc(H[k])}</td></tr>`).join('');
    $('tbl').innerHTML='<table class="hdr-table">'+rows+'</table>';
    if(d.error){$('err').textContent=d.error;$('err').style.display='block';}
  }catch(e){$('meta').innerHTML='';$('err').textContent='Inspect failed: '+e.message;$('err').style.display='block';}
}
$('check').addEventListener('click',check);
$('url').addEventListener('keydown',e=>{if(e.key==='Enter')check();});