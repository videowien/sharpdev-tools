const $=id=>document.getElementById(id);
const W={
bacon:'bacon ipsum dolor amet pork belly short ribs ribeye brisket meatball jerky pancetta tenderloin sausage bresaola chuck spare ribs ham hock chicken cow pig flank shank turkey tri-tip salami prosciutto kielbasa drumstick beef cured smoked grilled'.split(' '),
pirate:'arr matey ahoy avast booty doubloon scurvy landlubber grog plunder treasure parrot cannon cutlass jolly roger sail mast anchor rum kraken buccaneer galleon hornswaggle shiver timbers yo ho sea dog'.split(' '),
hipster:'artisan kale chips selvage vinyl cold-pressed fixie kombucha brunch beard mustache organic locavore sriracha gentrify williamsburg meditation succulent tote bag pour-over migas banjo small batch tattooed ethical'.split(' '),
corporate:'synergy leverage paradigm stakeholder bandwidth deliverable scalable actionable disrupt ideate streamline pivot ecosystem alignment optimize holistic value-add core competency low-hanging fruit circle back touch base move the needle'.split(' ')
};
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function sentence(words){
  const n=5+Math.floor(Math.random()*10);let s=[];
  for(let i=0;i<n;i++)s.push(words[Math.floor(Math.random()*words.length)]);
  return cap(s.join(' '))+'.';
}
function go(){
  const words=W[$('theme').value],p=Math.min(30,Math.max(1,+$('paras').value||1));
  const paras=[];
  for(let i=0;i<p;i++){const sc=3+Math.floor(Math.random()*4);let s=[];for(let j=0;j<sc;j++)s.push(sentence(words));paras.push(s.join(' '));}
  $('out').textContent=paras.join('\n\n');
}
$('gen').addEventListener('click',go);$('theme').addEventListener('change',go);
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();