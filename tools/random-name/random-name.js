const $=id=>document.getElementById(id);
const M=['James','John','Robert','Michael','William','David','Daniel','Matthew','Andrew','Joseph','Lucas','Henry','Leo','Max','Felix','Oliver','Noah','Elijah','Liam','Ethan','Thomas','Charles','Paul','Mark','Benjamin'];
const F=['Mary','Emma','Olivia','Sophia','Isabella','Ava','Mia','Charlotte','Amelia','Hannah','Lena','Clara','Anna','Marie','Laura','Sarah','Grace','Lucy','Ella','Nora','Julia','Sofia','Alice','Chloe','Zoe'];
const L=['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Martinez','Mueller','Schmidt','Fischer','Weber','Wagner','Becker','Rossi','Dubois','Silva','Novak','Kim','Lopez','Wilson','Taylor','Moore','Clark'];
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function gen(){const g=$('gender').value;const count=Math.min(200,Math.max(1,parseInt($('count').value)||1));const out=[];for(let i=0;i<count;i++){const pool=g==='male'?M:g==='female'?F:(Math.random()<0.5?M:F);out.push(pick(pool)+' '+pick(L));}$('out').value=out.join('\n');}
$('gen').addEventListener('click',gen);$('gender').addEventListener('change',gen);$('count').addEventListener('input',gen);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
gen();