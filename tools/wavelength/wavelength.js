const $=id=>document.getElementById(id);
function band(f){var B=[[1.8,2,'160m'],[3.5,4,'80m'],[5.33,5.41,'60m'],[7,7.3,'40m'],[10.1,10.15,'30m'],[14,14.35,'20m'],[18.068,18.168,'17m'],[21,21.45,'15m'],[24.89,24.99,'12m'],[28,29.7,'10m'],[50,54,'6m'],[144,148,'2m'],[222,225,'1.25m'],[420,450,'70cm'],[902,928,'33cm'],[1240,1300,'23cm']];for(var i=0;i<B.length;i++){if(f>=B[i][0]&&f<=B[i][1])return B[i][2];}return '';}
function go(){const f=+$('f').value;if(!(f>0)){['wl','hw','qw','bd'].forEach(id=>$(id).textContent='-');return;}
 const m=299.792458/f;
 $('wl').textContent=m.toFixed(3)+' m / '+(m/0.3048).toFixed(2)+' ft';
 $('hw').textContent=(m/2).toFixed(3)+' m';$('qw').textContent=(m/4).toFixed(3)+' m';
 const b=band(f);$('bd').textContent=b||'(not a ham band)';}
$('f').addEventListener('input',go);go();