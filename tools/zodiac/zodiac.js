const $=id=>document.getElementById(id);
const LAST=[19,18,20,19,20,20,22,22,22,22,21,21];
const SIGNS=['Capricorn','Aquarius','Pisces','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn'];
const SYM={Aries:'♈',Taurus:'♉',Gemini:'♊',Cancer:'♋',Leo:'♌',Virgo:'♍',Libra:'♎',Scorpio:'♏',Sagittarius:'♐',Capricorn:'♑',Aquarius:'♒',Pisces:'♓'};
const FIRE=['Aries','Leo','Sagittarius'],EARTH=['Taurus','Virgo','Capricorn'],AIR=['Gemini','Libra','Aquarius'];
const RANGE={Aries:'Mar 21 – Apr 19',Taurus:'Apr 20 – May 20',Gemini:'May 21 – Jun 20',Cancer:'Jun 21 – Jul 22',Leo:'Jul 23 – Aug 22',Virgo:'Aug 23 – Sep 22',Libra:'Sep 23 – Oct 22',Scorpio:'Oct 23 – Nov 21',Sagittarius:'Nov 22 – Dec 21',Capricorn:'Dec 22 – Jan 19',Aquarius:'Jan 20 – Feb 18',Pisces:'Feb 19 – Mar 20'};
function go(){const v=$('d').value;if(!v){$('out').textContent='Pick a birth date.';return;}const [,m,d]=v.split('-').map(Number);
const sign=d<=LAST[m-1]?SIGNS[m-1]:SIGNS[m];const el=FIRE.includes(sign)?'Fire':EARTH.includes(sign)?'Earth':AIR.includes(sign)?'Air':'Water';
$('out').innerHTML='<div style="font-size:30px;color:#fff;">'+SYM[sign]+' <b style="color:#ff6666;">'+sign+'</b></div>'
+'<div style="color:#aaa;font-size:14px;margin-top:8px;">'+el+' sign · '+RANGE[sign]+'</div>';}
$('d').addEventListener('input',go);go();