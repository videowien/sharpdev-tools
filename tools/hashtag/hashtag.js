/** Hashtag Generator — curated topic → hashtags database */
const TOPICS = {
  travel: ['travel','travelgram','wanderlust','instatravel','traveler','traveling','travels','traveltheworld','travelblog','travelphotography','wander','adventure','trip','vacation','holiday','explore','roaming','globetrotter','backpacker','travelcouple','familytravel','solotravel','digitalnomad','traveladdict','traveldiaries','traveler2024','ttot','travellife','beautifuldestinations','passportready','nomad','letsgosomewhere','dametraveler'],
  food: ['food','foodie','foodporn','foodstagram','foodblogger','foodgasm','instafood','foodphotography','foodlover','yum','yummy','delicious','homecooking','foodpics','foodies','chef','recipe','recipes','baking','homemade','tasty','cook','cooking','dinner','breakfast','lunch','hungry','eats','foodgram','foodshare','igfood','onthetable','foodspotting'],
  fitness: ['fitness','gym','workout','fit','bodybuilding','training','motivation','fitfam','fitnessmotivation','fitspo','gymlife','healthy','health','lifestyle','crossfit','exercise','strong','muscle','strength','cardio','abs','shredded','gains','noexcuses','personaltrainer','fitnessjourney','transformation','athlete','powerlifting','weightlifting','homegym','legday','shapeofyou','hustle'],
  photography: ['photography','photooftheday','photographer','photo','photoshoot','picoftheday','instaphoto','photogram','portrait','landscape','nature','street','naturephotography','streetphotography','portraitphotography','photographylife','shutterbug','lightroom','canon','nikon','sony','camera','35mm','ig_photo','shootermag','photoart','photoofthday','artofvisuals','agameoftones','instagood','moodygrams','visualsoflife','photographysouls'],
  fashion: ['fashion','style','ootd','fashionblogger','styleblogger','lookoftheday','instafashion','fashionista','streetstyle','outfit','fashionable','stylish','menswear','womenswear','lookbook','whatiwore','mylook','trend','designer','couture','fashionpost','stylegram','mensfashion','ootdfashion','fashioninspo','vintage','fashionweek','fashionstyle','fashionaddict','styleinspo','styleinspiration','fashiongram'],
  beauty: ['beauty','makeup','skincare','mua','makeupartist','beautyblogger','makeupjunkie','instabeauty','makeupaddict','makeuptutorial','lashes','lipstick','foundation','highlight','contour','eyeshadow','beautycommunity','glow','glowup','selfcare','skincareroutine','clearskin','beautytips','eyeliner','blending','makeupoftheday','motd','beautygram','lashextensions','brows','glam','bhfyp','smokeyeye','naturalmakeup'],
  art: ['art','artist','artwork','artistsoninstagram','painting','drawing','sketch','illustration','digitalart','creative','arte','contemporaryart','modernart','fineart','gallery','artstudio','artgram','arte_illustriate','art_collective','drawings','sketchbook','pen','pencil','watercolor','acrylic','oilpainting','portraitart','landscapeart','abstractart','artoftheday','artsy','artlife','artistry','artpop'],
  nature: ['nature','naturephotography','natureza','naturelovers','naturelover','naturegram','ig_nature','outdoors','landscape','wilderness','outdoor','hiking','forest','mountain','mountains','sky','sunset','sunrise','clouds','trees','green','planet','earth','earthpix','wildlife','wildlifephotography','forestphotography','woodlands','natgeo','naturephoto','planet_earth','naturelove','goexplore'],
  business: ['business','entrepreneur','entrepreneurship','smallbusiness','startup','businessowner','success','marketing','hustle','entrepreneurlife','businesswoman','businessman','bossbabe','girlboss','startuplife','leadership','leader','businesstips','ceo','founder','entrepreneurs','workhard','growth','innovation','entrepreneurmindset','dreambigger','businesscoach','goals','mindset','inspiration','onlinebusiness','businessstrategy','sidehustle','startupgrind'],
  tech: ['tech','technology','innovation','coding','programmer','programming','developer','webdev','javascript','python','ai','artificialintelligence','machinelearning','datascience','softwareengineer','code','coder','developerlife','100daysofcode','css','html','react','vuejs','node','typescript','devops','cloud','aws','frontend','backend','fullstack','computerscience','techie','geek','sql'],
  music: ['music','musician','musica','hiphop','rap','singer','songwriter','producer','artist','newmusic','musicislife','livemusic','musicvideo','dj','beats','trap','edm','guitar','piano','drummer','vocal','studio','recording','musiclover','musiclife','musicindustry','spotify','soundcloud','applemusic','producerlife','beatmaker','musicproducer','songwriting'],
  gaming: ['gaming','gamer','games','game','videogames','gamerlife','gaminglife','twitch','streamer','xbox','playstation','nintendo','ps5','pcgaming','pcgamer','consolegaming','esports','gamingcommunity','gamingposts','gamingsetup','rpg','fps','battleroyale','fortnite','minecraft','league','valorant','callofduty','warzone','multiplayer','indiegame','gamedev','gamedesign'],
  fitness_yoga: ['yoga','yogi','yogainspiration','yogaeverydamnday','yogalife','yogagirl','yogapractice','yogateacher','yogaeverywhere','meditation','mindfulness','namaste','asana','yogaflow','yogachallenge','yogalove','yogaaddict','pranayama','zen','calm','balance','flexibility','innerpeace','selfcare','wellbeing','wellness','mindbodysoul','soulful','breathe','meditate','present','conscious'],
  pet: ['dog','cat','pet','pets','dogsofinstagram','catsofinstagram','puppy','kitten','doglover','catlover','petlove','petsofinstagram','petstagram','instapet','dogstagram','catstagram','doglife','catlife','doggy','kitty','pup','adoptdontshop','rescuedog','rescuecat','shelter','furbaby','goldenretriever','labrador','bulldog','persian','siamese','mainecoon','pethealth'],
  wedding: ['wedding','weddingday','bride','groom','weddingphotography','weddingphotographer','weddingdress','weddinginspiration','weddingplanner','weddings','weddinggown','bridetobe','engaged','ido','weddingdetails','weddingideas','weddingflowers','weddingdecor','weddingcake','weddingring','love','couple','marriage','justmarried','mrandmrs','bridal','bridesmaids','weddingparty','destinationwedding','receptiondress','weddingseason','weddinggoals','love4ever','engagementring'],
  realestate: ['realestate','realtor','realestateagent','forsale','newhome','homesweethome','house','housing','homesforsale','dreamhome','newlisting','openhouse','homes','property','realtorlife','houseforsale','luxuryhomes','luxuryrealestate','realestateinvestor','realestateinvesting','homebuying','homeseller','broker','mortgage','firsttimehomebuyer','sellingyourhome','homeowner','investmentproperty','realestatelife','realestatebusiness','justlisted','justsold','househunting','residentialrealestate'],
  books: ['books','bookstagram','booklover','reading','bookworm','booksofinstagram','bibliophile','read','literature','bookish','bookaholic','readersofinstagram','readingtime','currentlyreading','booklove','bookphotography','bookshelf','booksbooksbooks','booknerd','ilovereading','bookrecommendations','readingislife','bookblog','bookblogger','booknerdigans','bookclub','epicreads','novel','fiction','nonfiction','yafiction','poetry','bookaddict','fantasybooks'],
  design: ['design','graphicdesign','webdesign','designer','designinspiration','designlife','art','creative','branding','logodesign','ui','ux','uxdesign','uidesign','typography','illustration','graphic','minimal','minimalism','aesthetic','uxui','designstudio','designthinking','interiordesign','productdesign','dailyui','graphicdesigner','logo','logodesigner','graphicsdesign','creativewriting','colorpalette','flatdesign','moderndesign'],
  gardening: ['garden','gardening','plants','plantsofinstagram','plantlover','plantmom','plantdad','houseplants','succulents','flowers','flower','urbangarden','vegetablegarden','growyourown','organicgardening','homegrown','greenthumb','planthobby','indoorjungle','planttherapy','gardenlove','gardeners','gardendesign','backyardgarden','flowergarden','gardeningtips','gardeningisfun','lovegardening','plantsmakepeoplehappy','plantparenthood','indoorplants','botanical','floral','gardenlife'],
  coffee: ['coffee','coffeelover','coffeetime','coffeeshop','coffeeaddict','coffeegram','coffeelife','coffeehouse','coffeeculture','coffeebreak','espresso','latte','cappuccino','coldbrew','pourover','barista','butfirstcoffee','caffeine','coffeelove','coffeephotography','coffeestagram','coffeeaddicted','coffeelovers','coffeeart','latteart','coffeeroaster','specialtycoffee','thirdwavecoffee','goodcoffee','freshbrew','morningbrew','morningcoffee','inmycup','coffeeeveryday'],
};

const GENERIC = ['instagood','instadaily','photooftheday','picoftheday','love','follow','like4like','likeforlike','followme','amazing','beautiful','happy','fun','smile','life','style','cute','art','explore','viral'];

const $ = id => document.getElementById(id);
const suggested = $('hg-suggested');
const outEl = $('hg-output');
const tagsEl = $('hg-tags');
const cntEl = $('hg-count');

const selected = new Set();

function suggest() {
  suggested.innerHTML = '';
  Object.keys(TOPICS).slice(0, 12).forEach(t => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hg-chip';
    b.textContent = t.replace('_', ' ');
    b.addEventListener('click', () => { $('hg-in').value = t.split('_')[0]; go(); });
    suggested.appendChild(b);
  });
}

function findTopic(q) {
  q = q.toLowerCase();
  // Exact match
  if (TOPICS[q]) return TOPICS[q];
  // Substring match
  for (const key of Object.keys(TOPICS)) {
    if (key.includes(q) || q.includes(key)) return TOPICS[key];
  }
  return null;
}

function go() {
  const raw = $('hg-in').value.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '');
  if (!raw) { outEl.style.display = 'none'; return; }
  const topicTags = findTopic(raw) || [];
  const base = [
    '#' + raw,
    '#' + raw + 'love',
    '#' + raw + 'lover',
    '#' + raw + 'life',
    '#' + raw + 'style',
    '#' + raw + 'daily',
    '#' + raw + 'gram',
    '#' + raw + 'stagram',
    '#' + raw + 'oftheday',
    '#' + raw + 'ofinstagram',
    '#insta' + raw,
    '#my' + raw,
  ];
  const topicHash = topicTags.map(t => '#' + t);
  const generic = GENERIC.map(t => '#' + t);
  const all = [...new Set([...base, ...topicHash, ...generic])];

  selected.clear();
  // Preselect top 30
  all.slice(0, 30).forEach(t => selected.add(t));

  tagsEl.innerHTML = '';
  all.forEach((t, i) => {
    const el = document.createElement('span');
    el.className = 'hg-tag' + (selected.has(t) ? ' on' : '') + (i >= 30 ? ' niche' : '');
    el.textContent = t;
    el.addEventListener('click', () => {
      if (selected.has(t)) { selected.delete(t); el.classList.remove('on'); }
      else { selected.add(t); el.classList.add('on'); }
      cntEl.textContent = selected.size;
    });
    tagsEl.appendChild(el);
  });
  cntEl.textContent = selected.size;
  outEl.style.display = 'block';
}

$('hg-in').addEventListener('input', () => {
  // Debounce-lite
  clearTimeout(window._hgT);
  window._hgT = setTimeout(go, 200);
});
$('hg-in').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(window._hgT); go(); } });

function copy(str, btn, orig) {
  navigator.clipboard.writeText(str).then(() => {
    btn.textContent = 'Copied'; btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1400);
  }).catch(() => { btn.textContent = 'Failed'; });
}
$('copy-selected').addEventListener('click', () => {
  const str = [...selected].join(' ');
  if (str) copy(str, $('copy-selected'), 'Copy selected');
});
$('copy-all').addEventListener('click', () => {
  const all = [...tagsEl.querySelectorAll('.hg-tag')].map(e => e.textContent).join(' ');
  if (all) copy(all, $('copy-all'), 'Copy all (space)');
});
$('copy-block').addEventListener('click', () => {
  const first30 = [...tagsEl.querySelectorAll('.hg-tag')].slice(0, 30).map(e => e.textContent).join(' ');
  if (first30) copy(first30, $('copy-block'), 'Copy block (30 only)');
});

suggest();
