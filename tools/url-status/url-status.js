const $=id=>document.getElementById(id);
const TXT={200:'OK',201:'Created',204:'No Content',301:'Moved Permanently',302:'Found',303:'See Other',304:'Not Modified',307:'Temporary Redirect',308:'Permanent Redirect',400:'Bad Request',401:'Unauthorized',403:'Forbidden',404:'Not Found',405:'Method Not Allowed',410:'Gone',429:'Too Many Requests',500:'Internal Server Error',502:'Bad Gateway',503:'Service Unavailable',504:'Gateway Timeout'};
function cls(s){return s<300?'s2':s<400?'s3':s<500?'s4':'s5';}
async function check(){
  const u=$('url').value.trim();
  if(!u)return;
  $('err').style.display='none';$('chain').innerHTML='';$('summary').innerHTML='<div class="result-card"><div class="label">Checking</div><div class="value">…</div></div>';
  try{
    const r=await fetch('/api/inspect?url='+encodeURIComponent(u));
    const d=await r.json();
    if(d.error&&!d.chain){$('summary').innerHTML='';$('err').textContent=d.error;$('err').style.display='block';return;}
    const chain=d.chain||[];
    const last=chain[chain.length-1]||{};
    const redirects=chain.filter(h=>h.location).length;
    $('summary').innerHTML=[
      ['Final status',last.status||'—',true],
      ['Redirects',redirects+'',false],
      ['Total hops',chain.length+'',false],
      ['Time',(d.totalMs||0)+' ms',false]
    ].map(([l,v,hl])=>`<div class="result-card${hl?' hl':''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');
    $('chain').innerHTML=chain.map((h,i)=>{
      const t=TXT[h.status]||h.statusText||'';
      const row=`<div class="hop"><span class="badge ${cls(h.status)}">${h.status}</span><span class="u">${esc(h.url)}</span><span class="st">${t}</span></div>`;
      return row+(h.location?'<div class="hop-arrow">&#8595; redirects to</div>':'');
    }).join('');
    if(d.error){$('err').textContent=d.error;$('err').style.display='block';}
  }catch(e){$('summary').innerHTML='';$('err').textContent='Check failed: '+e.message;$('err').style.display='block';}
}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
$('check').addEventListener('click',check);
$('url').addEventListener('keydown',e=>{if(e.key==='Enter')check();});