const $=id=>document.getElementById(id);
const FN=['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','David','Elizabeth','Lucas','Emma','Olivia','Noah','Sophia','Liam','Mia','Ethan','Clara','Felix','Nora','Leon','Anna','Paul','Laura'];
const LN=['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Mueller','Schmidt','Fischer','Weber','Rossi','Dubois','Silva','Novak','Kim','Lopez','Wilson','Taylor','Moore','Clark','Walker','Young','Becker'];
const STREETS=['Oak Street','Maple Avenue','Cedar Lane','Pine Road','Elm Street','Hill Drive','Park Avenue','Lake View','Sunset Boulevard','River Road','Church Street','Market Street','High Street','Station Road','Victoria Street'];
const CITIES=[['Springfield','IL','627'],['Riverside','CA','925'],['Franklin','TN','370'],['Greenville','SC','296'],['Madison','WI','537'],['Vienna','VA','221'],['Bristol','CT','060'],['Auburn','AL','368'],['Salem','OR','973'],['Dover','DE','199']];
const DOMAINS=['example.com','test.dev','mail.example','demo.org','sample.net'];
const COMPANIES=['Acme Corp','Globex','Initech','Umbrella LLC','Soylent Co','Hooli','Vandelay','Stark Industries','Wayne Enterprises','Cyberdyne'];
const JOBS=['Software Engineer','Product Manager','Designer','Accountant','Teacher','Nurse','Sales Rep','Analyst','Consultant','Marketing Lead'];
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function ri(n){return Math.floor(Math.random()*n);}
function person(){const fn=pick(FN),ln=pick(LN);const dom=pick(DOMAINS);const email=(fn+'.'+ln).toLowerCase()+'@'+dom;const phone='('+(200+ri(800))+') '+(200+ri(800))+'-'+String(1000+ri(9000));const city=pick(CITIES);const addr=(100+ri(9800))+' '+pick(STREETS);const zip=city[2]+String(ri(100)).padStart(2,'0');
 return 'Name:    '+fn+' '+ln+'\nEmail:   '+email+'\nPhone:   '+phone+'\nAddress: '+addr+', '+city[0]+', '+city[1]+' '+zip+'\nCompany: '+pick(COMPANIES)+'\nJob:     '+pick(JOBS);}
function gen(){const n=Math.min(50,Math.max(1,parseInt($('count').value)||1));const out=[];for(let i=0;i<n;i++)out.push(person());$('out').value=out.join('\n\n----------------------------------------\n\n');}
$('gen').addEventListener('click',gen);$('count').addEventListener('input',gen);
$('copy').addEventListener('click',()=>navigator.clipboard.writeText($('out').value));
gen();