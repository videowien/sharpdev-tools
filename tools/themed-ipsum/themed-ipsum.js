const $=id=>document.getElementById(id);
const W={pirate:['arr','avast','matey','booty','doubloon','scallywag','plunder','grog','landlubber','treasure','parley','cutlass','jolly','roger','scurvy','buccaneer','galleon','marooned','sail','crew','captain','hearties','seas','rum','anchor','crow','nest','plank','kraken','tide'],
hipster:['artisan','craft','vinyl','kombucha','sustainable','organic','locavore','flannel','fixie','cold-pressed','small-batch','heirloom','bespoke','vegan','typewriter','gentrify','authentic','ethical','farm-to-table','single-origin','retro','vintage','aesthetic','sriracha','mixtape','tote','pour-over','beard','meditation','succulent'],
corporate:['synergy','leverage','paradigm','disrupt','bandwidth','stakeholder','deliverable','scalable','holistic','actionable','ideate','pivot','runway','low-hanging','circle-back','deep-dive','value-add','core-competency','streamline','optimize','ecosystem','roadmap','alignment','touchpoint','growth','agile','north-star','win-win','KPI','onboarding']};
function rnd(n){return Math.floor(Math.random()*n);}
function sentence(w){const n=6+rnd(8);const s=[];for(let i=0;i<n;i++)s.push(w[rnd(w.length)]);let str=s.join(' ');return str.charAt(0).toUpperCase()+str.slice(1)+'.';}
function para(w){const n=3+rnd(4);const p=[];for(let i=0;i<n;i++)p.push(sentence(w));return p.join(' ');}
function gen(){const w=W[$('style').value];const n=Math.min(20,Math.max(1,parseInt($('paras').value)||1));const out=[];for(let i=0;i<n;i++)out.push(para(w));$('out').value=out.join('\n\n');}
$('gen').addEventListener('click',gen);$('style').addEventListener('change',gen);$('paras').addEventListener('input',gen);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
gen();