const $=id=>document.getElementById(id);
function sig(s){s=s.trim();if(!/^[+-]?\d*\.?\d+$/.test(s))return null;let d=s.replace(/^[+-]/,'');if(d.includes('.')){const t=d.replace('.','').replace(/^0+/,'');return t.length||1;}else{const t=d.replace(/^0+/,'').replace(/0+$/,'');return t.length||1;}}
function dp(s){s=s.trim();const i=s.indexOf('.');return i<0?0:s.length-i-1;}
function roundSig(x,k){if(x===0)return '0';const d=Math.ceil(Math.log10(Math.abs(x)));const p=k-d;const m=Math.pow(10,p);let r=Math.round(x*m)/m;return p>0?r.toFixed(p):String(r);}
function go(){const s=$('num').value;const c=sig(s);if(c===null){$('count').textContent='—';$('dp').textContent='—';$('rounded').value='not a number';return;}
 $('count').textContent=c;$('dp').textContent=dp(s);
 const k=Math.max(1,parseInt($('n').value)||1);const x=parseFloat(s);$('rounded').value=isFinite(x)?roundSig(x,k):'—';}
['num','n'].forEach(id=>$(id).addEventListener('input',go));go();