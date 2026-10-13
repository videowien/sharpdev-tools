/** Emoji Finder — curated set with keywords */
const EMOJI = {
  'Smileys': [
    ['😀', 'grinning face smile happy'], ['😃', 'grinning smile happy'], ['😄', 'smile happy joy'],
    ['😁', 'beaming grin smile'], ['😆', 'laugh laughing grin'], ['😅', 'sweat smile nervous'],
    ['🤣', 'rofl laugh hilarious'], ['😂', 'joy laugh cry tears'], ['🙂', 'slight smile'],
    ['🙃', 'upside down silly'], ['😉', 'wink flirt'], ['😊', 'blush happy kind'],
    ['😇', 'halo angel innocent'], ['🥰', 'smiling hearts love'], ['😍', 'heart eyes love'],
    ['🤩', 'star struck excited'], ['😘', 'kiss blow'], ['😗', 'kissing'],
    ['🥲', 'smile tear'], ['😋', 'yum tasty tongue'], ['😛', 'tongue playful'],
    ['😜', 'wink tongue silly'], ['🤪', 'zany crazy goofy'], ['😎', 'cool sunglasses'],
    ['🥳', 'party face celebrate'], ['🤔', 'thinking hmm'], ['🤨', 'raised eyebrow skeptical'],
    ['😐', 'neutral face meh'], ['😶', 'no mouth silence'], ['😏', 'smirk'],
    ['😒', 'unamused meh'], ['🙄', 'eye roll'], ['😬', 'grimace awkward'],
    ['🤐', 'zipper silent'], ['😯', 'surprised oh'], ['😦', 'frown'], ['😧', 'anguished'],
    ['😮', 'open mouth wow'], ['😲', 'astonished shock'], ['🥱', 'yawn tired'],
    ['😴', 'sleeping zzz'], ['🤤', 'drool'], ['😪', 'sleepy tired'],
    ['😌', 'relieved content'], ['😛', 'tongue'], ['🥴', 'woozy drunk'],
    ['😵', 'dizzy ko'], ['🤯', 'mind blown'], ['🤠', 'cowboy'],
    ['🥸', 'disguise glasses'], ['😷', 'mask sick'], ['🤒', 'thermometer sick'],
    ['🤕', 'bandage hurt'], ['🤢', 'nausea sick'], ['🤮', 'vomit puke'],
    ['🥵', 'hot heat'], ['🥶', 'cold freezing'], ['😵‍💫', 'dizzy confused'],
    ['😳', 'flushed embarrassed'], ['🥺', 'pleading puppy eyes'],
    ['😢', 'cry sad tear'], ['😭', 'sob cry loud'], ['😤', 'triumph proud angry'],
    ['😠', 'angry mad'], ['😡', 'rage pout furious'], ['🤬', 'cursing swearing'],
    ['🤫', 'shush quiet'], ['🤭', 'giggle oops'], ['😈', 'smiling devil'],
    ['👿', 'angry devil'], ['💀', 'skull dead'], ['☠️', 'crossbones pirate'],
    ['💩', 'poop'], ['🤡', 'clown'], ['👻', 'ghost spooky'],
    ['👽', 'alien'], ['👾', 'monster space invader'], ['🤖', 'robot'],
    ['👋', 'wave hi hello'], ['🤚', 'raised back hand'], ['🖐️', 'hand fingers'],
    ['✋', 'stop high five'], ['🖖', 'spock vulcan'], ['👌', 'ok perfect'],
    ['🤌', 'pinched fingers italian'], ['🤏', 'pinch small'], ['✌️', 'peace victory'],
    ['🤞', 'fingers crossed luck'], ['🤟', 'love you'], ['🤘', 'rock metal'],
    ['🤙', 'call me hang loose'], ['👈', 'left'], ['👉', 'right'],
    ['👆', 'up'], ['👇', 'down'], ['☝️', 'index point up'],
    ['👍', 'thumbs up like yes'], ['👎', 'thumbs down dislike no'],
    ['✊', 'fist power solidarity'], ['👊', 'fist bump punch'], ['🤛', 'fist left'],
    ['🤜', 'fist right'], ['👏', 'clap applause'], ['🙌', 'praise hands celebrate'],
    ['👐', 'open hands hug'], ['🤲', 'palms up pray'], ['🤝', 'handshake deal'],
    ['🙏', 'pray thanks please'],
  ],
  'Animals': [
    ['🐶', 'dog puppy'], ['🐱', 'cat kitty'], ['🐭', 'mouse'], ['🐹', 'hamster'],
    ['🐰', 'rabbit bunny'], ['🦊', 'fox'], ['🐻', 'bear'], ['🐼', 'panda'],
    ['🐨', 'koala'], ['🐯', 'tiger'], ['🦁', 'lion'], ['🐮', 'cow'],
    ['🐷', 'pig'], ['🐸', 'frog'], ['🐵', 'monkey'], ['🙈', 'see no evil monkey'],
    ['🙉', 'hear no evil'], ['🙊', 'speak no evil'], ['🐒', 'monkey'],
    ['🐔', 'chicken'], ['🐧', 'penguin'], ['🐦', 'bird'], ['🐤', 'chick baby'],
    ['🦆', 'duck'], ['🦅', 'eagle'], ['🦉', 'owl'], ['🦇', 'bat'],
    ['🐺', 'wolf'], ['🐗', 'boar'], ['🐴', 'horse'], ['🦄', 'unicorn'],
    ['🐝', 'bee'], ['🐛', 'caterpillar bug'], ['🦋', 'butterfly'], ['🐌', 'snail slow'],
    ['🐞', 'ladybug'], ['🐜', 'ant'], ['🪲', 'beetle'], ['🦗', 'cricket'],
    ['🕷️', 'spider'], ['🦂', 'scorpion'], ['🐢', 'turtle'], ['🐍', 'snake'],
    ['🦎', 'lizard'], ['🦖', 't-rex dino'], ['🦕', 'sauropod dino'],
    ['🐙', 'octopus'], ['🦑', 'squid'], ['🦐', 'shrimp'], ['🦞', 'lobster'],
    ['🦀', 'crab'], ['🐡', 'pufferfish'], ['🐠', 'tropical fish'], ['🐟', 'fish'],
    ['🐬', 'dolphin'], ['🐳', 'whale spout'], ['🐋', 'whale'], ['🦈', 'shark'],
    ['🐊', 'crocodile'], ['🐅', 'tiger'], ['🐆', 'leopard'], ['🦓', 'zebra'],
    ['🦍', 'gorilla'], ['🦧', 'orangutan'], ['🐘', 'elephant'],
    ['🦛', 'hippo'], ['🦏', 'rhino'], ['🐪', 'camel'], ['🐫', 'camel two humps'],
    ['🦒', 'giraffe'], ['🦘', 'kangaroo'], ['🐃', 'buffalo'], ['🐂', 'bull ox'],
    ['🐄', 'cow'], ['🐎', 'horse'], ['🐖', 'pig'], ['🐏', 'ram'],
    ['🐑', 'sheep'], ['🦙', 'llama'], ['🐐', 'goat'], ['🦌', 'deer'],
    ['🐕', 'dog'], ['🦮', 'guide dog'], ['🐈', 'cat'], ['🐓', 'rooster'],
    ['🦃', 'turkey'], ['🦚', 'peacock'], ['🦜', 'parrot'],
  ],
  'Food': [
    ['🍎', 'apple red'], ['🍐', 'pear'], ['🍊', 'orange'], ['🍋', 'lemon'],
    ['🍌', 'banana'], ['🍉', 'watermelon'], ['🍇', 'grapes'], ['🍓', 'strawberry'],
    ['🫐', 'blueberries'], ['🍈', 'melon'], ['🍒', 'cherry'], ['🍑', 'peach butt'],
    ['🥭', 'mango'], ['🍍', 'pineapple'], ['🥥', 'coconut'], ['🥝', 'kiwi'],
    ['🍅', 'tomato'], ['🍆', 'eggplant'], ['🥑', 'avocado'], ['🥦', 'broccoli'],
    ['🥬', 'leafy greens'], ['🥒', 'cucumber'], ['🌶️', 'hot pepper chili'], ['🫑', 'bell pepper'],
    ['🌽', 'corn'], ['🥕', 'carrot'], ['🫒', 'olive'], ['🧄', 'garlic'],
    ['🧅', 'onion'], ['🥔', 'potato'], ['🍠', 'sweet potato'], ['🥐', 'croissant'],
    ['🥯', 'bagel'], ['🍞', 'bread loaf'], ['🥖', 'baguette'], ['🥨', 'pretzel'],
    ['🧀', 'cheese'], ['🥚', 'egg'], ['🍳', 'cooking fried egg'], ['🥞', 'pancakes'],
    ['🧇', 'waffle'], ['🥓', 'bacon'], ['🥩', 'steak meat'], ['🍗', 'poultry leg'],
    ['🍖', 'meat bone'], ['🌭', 'hot dog'], ['🍔', 'burger'], ['🍟', 'fries'],
    ['🍕', 'pizza'], ['🥪', 'sandwich'], ['🥙', 'wrap'], ['🧆', 'falafel'],
    ['🌮', 'taco'], ['🌯', 'burrito'], ['🫔', 'tamale'], ['🥗', 'salad'],
    ['🥘', 'paella pan'], ['🫕', 'fondue'], ['🥫', 'canned food'], ['🍝', 'spaghetti pasta'],
    ['🍜', 'ramen noodles'], ['🍲', 'pot stew'], ['🍛', 'curry'], ['🍣', 'sushi'],
    ['🍱', 'bento'], ['🥟', 'dumpling'], ['🍤', 'tempura shrimp'], ['🍙', 'rice ball'],
    ['🍚', 'rice'], ['🍘', 'rice cracker'], ['🍥', 'fish cake'], ['🥠', 'fortune cookie'],
    ['🥮', 'moon cake'], ['🍢', 'oden skewer'], ['🍡', 'dango'], ['🍧', 'shaved ice'],
    ['🍨', 'ice cream'], ['🍦', 'soft serve'], ['🥧', 'pie'], ['🧁', 'cupcake'],
    ['🍰', 'cake'], ['🎂', 'birthday cake'], ['🍮', 'custard'], ['🍭', 'lollipop'],
    ['🍬', 'candy'], ['🍫', 'chocolate'], ['🍿', 'popcorn'], ['🍩', 'donut'],
    ['🍪', 'cookie'], ['🌰', 'chestnut'], ['🥜', 'peanut'], ['🍯', 'honey'],
    ['🥛', 'milk'], ['🍼', 'baby bottle'], ['☕', 'coffee'], ['🍵', 'tea'],
    ['🍶', 'sake'], ['🍾', 'champagne bottle'], ['🍷', 'wine'], ['🍸', 'cocktail'],
    ['🍹', 'tropical drink'], ['🍺', 'beer'], ['🍻', 'beers cheers'], ['🥂', 'clinking glasses'],
    ['🥃', 'whisky'], ['🫗', 'pouring'], ['🥤', 'cup straw'], ['🧃', 'juice box'],
    ['🧋', 'bubble tea boba'], ['🧉', 'mate'], ['🧊', 'ice cube'],
  ],
  'Activities': [
    ['⚽', 'soccer ball'], ['🏀', 'basketball'], ['🏈', 'american football'], ['⚾', 'baseball'],
    ['🥎', 'softball'], ['🎾', 'tennis'], ['🏐', 'volleyball'], ['🏉', 'rugby'],
    ['🥏', 'frisbee'], ['🎱', '8 ball pool'], ['🪀', 'yo-yo'], ['🏓', 'ping pong'],
    ['🏸', 'badminton'], ['🥅', 'goal net'], ['⛳', 'golf flag'], ['🏹', 'bow arrow'],
    ['🎣', 'fishing'], ['🥊', 'boxing glove'], ['🥋', 'martial arts'], ['🎽', 'running shirt'],
    ['🛹', 'skateboard'], ['🛼', 'roller skate'], ['🛷', 'sled'], ['⛸️', 'ice skate'],
    ['🥌', 'curling stone'], ['🎿', 'skis'], ['⛷️', 'skier'], ['🏂', 'snowboarder'],
    ['🪂', 'parachute'], ['🏋️', 'weight lifter'], ['🤼', 'wrestlers'], ['🤸', 'cartwheel'],
    ['⛹️', 'basketball player'], ['🤺', 'fencer'], ['🤾', 'handball'], ['🏌️', 'golfer'],
    ['🏇', 'horse racing'], ['🧘', 'yoga meditation'], ['🏄', 'surfing'], ['🏊', 'swimming'],
    ['🤽', 'water polo'], ['🚣', 'rowboat'], ['🧗', 'climbing'], ['🚵', 'mountain biking'],
    ['🚴', 'biking'], ['🏆', 'trophy win'], ['🥇', 'gold medal 1st'], ['🥈', 'silver medal 2nd'],
    ['🥉', 'bronze medal 3rd'], ['🏅', 'sports medal'], ['🎖️', 'military medal'], ['🏵️', 'rosette'],
    ['🎗️', 'ribbon'], ['🎫', 'ticket'], ['🎟️', 'admission ticket'], ['🎪', 'circus tent'],
    ['🤹', 'juggling'], ['🎭', 'theatre masks'], ['🎨', 'art palette'], ['🎬', 'clapper film'],
    ['🎤', 'microphone karaoke'], ['🎧', 'headphones'], ['🎼', 'sheet music'], ['🎹', 'piano'],
    ['🥁', 'drum'], ['🎷', 'saxophone'], ['🎺', 'trumpet'], ['🎸', 'guitar'],
    ['🪕', 'banjo'], ['🎻', 'violin'], ['🎲', 'dice game'], ['♟️', 'chess pawn'],
    ['🎯', 'dart bullseye'], ['🎳', 'bowling'], ['🎮', 'video game controller'], ['🎰', 'slot machine'],
    ['🧩', 'puzzle'],
  ],
  'Travel': [
    ['🚗', 'car'], ['🚕', 'taxi'], ['🚙', 'suv'], ['🚌', 'bus'],
    ['🚎', 'trolleybus'], ['🏎️', 'race car'], ['🚓', 'police car'], ['🚑', 'ambulance'],
    ['🚒', 'fire truck'], ['🚐', 'minibus'], ['🛻', 'pickup truck'], ['🚚', 'truck'],
    ['🚛', 'semi truck'], ['🚜', 'tractor'], ['🦽', 'wheelchair'], ['🛴', 'kick scooter'],
    ['🚲', 'bicycle bike'], ['🛵', 'motor scooter'], ['🏍️', 'motorcycle'], ['🚨', 'siren'],
    ['🚔', 'police car lights'], ['🚇', 'metro'], ['🚊', 'tram'], ['🚉', 'station'],
    ['✈️', 'airplane'], ['🛫', 'takeoff'], ['🛬', 'landing'], ['🛩️', 'small plane'],
    ['💺', 'seat'], ['🛸', 'ufo'], ['🚀', 'rocket'], ['🛰️', 'satellite'],
    ['🚁', 'helicopter'], ['🛶', 'canoe'], ['⛵', 'sailboat'], ['🚤', 'speedboat'],
    ['🛥️', 'motor boat'], ['🛳️', 'cruise ship'], ['⛴️', 'ferry'], ['🚢', 'ship'],
    ['⚓', 'anchor'], ['🪝', 'hook'], ['⛽', 'fuel gas'], ['🚧', 'construction'],
    ['🚏', 'bus stop'], ['🗺️', 'map'], ['🗿', 'moai statue'], ['🗽', 'statue of liberty'],
    ['🗼', 'tokyo tower'], ['🏰', 'castle'], ['🏯', 'japanese castle'], ['🏟️', 'stadium'],
    ['🎡', 'ferris wheel'], ['🎢', 'roller coaster'], ['🎠', 'carousel'], ['⛲', 'fountain'],
    ['⛱️', 'umbrella beach'], ['🏖️', 'beach'], ['🏝️', 'desert island'], ['🏜️', 'desert'],
    ['🌋', 'volcano'], ['⛰️', 'mountain'], ['🏔️', 'snowy mountain'], ['🗻', 'mt fuji'],
    ['🏕️', 'camping'], ['⛺', 'tent'], ['🏠', 'house'], ['🏡', 'house garden'],
    ['🏘️', 'houses'], ['🏚️', 'derelict'], ['🏗️', 'construction'], ['🏭', 'factory'],
    ['🏢', 'office building'], ['🏬', 'department store'], ['🏣', 'post office japan'],
    ['🏤', 'post office'], ['🏥', 'hospital'], ['🏦', 'bank'], ['🏨', 'hotel'],
    ['🏩', 'love hotel'], ['🏪', 'convenience store'], ['🏫', 'school'],
    ['🌍', 'earth globe europe africa'], ['🌎', 'earth globe americas'], ['🌏', 'earth globe asia'],
    ['🌐', 'globe meridians'], ['🧭', 'compass'],
  ],
  'Objects': [
    ['⌚', 'watch'], ['📱', 'phone mobile'], ['💻', 'laptop'], ['⌨️', 'keyboard'],
    ['🖥️', 'desktop'], ['🖨️', 'printer'], ['🖱️', 'mouse computer'], ['🕹️', 'joystick'],
    ['💽', 'minidisc'], ['💾', 'floppy save'], ['💿', 'cd'], ['📀', 'dvd'],
    ['📼', 'videocassette'], ['📷', 'camera'], ['📸', 'camera flash'], ['📹', 'video camera'],
    ['🎥', 'movie camera'], ['📽️', 'film projector'], ['🎞️', 'film frames'], ['📞', 'phone receiver'],
    ['☎️', 'telephone'], ['📟', 'pager'], ['📠', 'fax'], ['📺', 'tv television'],
    ['📻', 'radio'], ['🎙️', 'studio mic'], ['🎚️', 'level slider'], ['🎛️', 'control knobs'],
    ['🧭', 'compass'], ['⏱️', 'stopwatch'], ['⏲️', 'timer'], ['⏰', 'alarm clock'],
    ['🕰️', 'mantelpiece clock'], ['⌛', 'hourglass done'], ['⏳', 'hourglass flowing'],
    ['📡', 'satellite antenna'], ['🔋', 'battery'], ['🔌', 'plug'], ['💡', 'light bulb idea'],
    ['🔦', 'flashlight'], ['🕯️', 'candle'], ['🧯', 'fire extinguisher'], ['🛢️', 'oil drum'],
    ['💸', 'money with wings'], ['💵', 'dollar'], ['💴', 'yen'], ['💶', 'euro'],
    ['💷', 'pound'], ['💰', 'money bag'], ['💳', 'credit card'], ['💎', 'gem'],
    ['⚖️', 'scales'], ['🪜', 'ladder'], ['🧰', 'toolbox'], ['🪛', 'screwdriver'],
    ['🔧', 'wrench'], ['🔨', 'hammer'], ['⚒️', 'hammer pick'], ['🛠️', 'tools'],
    ['⛏️', 'pick'], ['🪚', 'saw'], ['🔩', 'nut bolt'], ['⚙️', 'gear settings'],
    ['🗜️', 'clamp'], ['⚗️', 'alembic'], ['🧪', 'test tube'], ['🧫', 'petri dish'],
    ['🧬', 'dna'], ['🔬', 'microscope'], ['🔭', 'telescope'], ['📡', 'satellite dish'],
    ['💊', 'pill'], ['💉', 'syringe'], ['🩸', 'blood drop'], ['🩹', 'bandage'],
    ['🩺', 'stethoscope'], ['🚪', 'door'], ['🪑', 'chair'], ['🛏️', 'bed'],
    ['🛋️', 'couch'], ['🚽', 'toilet'], ['🚿', 'shower'], ['🛁', 'bathtub'],
    ['🪒', 'razor'], ['🧴', 'lotion'], ['🧷', 'safety pin'], ['🧹', 'broom'],
    ['🧺', 'basket'], ['🧻', 'toilet paper'], ['🪣', 'bucket'], ['🧼', 'soap'],
    ['🪥', 'toothbrush'], ['🧽', 'sponge'], ['🔑', 'key'], ['🗝️', 'old key'],
    ['🪄', 'magic wand'], ['🎁', 'gift present'], ['🎈', 'balloon'], ['🎉', 'party popper'],
    ['🎊', 'confetti ball'], ['🎀', 'ribbon bow'], ['🪅', 'piñata'],
  ],
  'Symbols': [
    ['❤️', 'red heart love'], ['🧡', 'orange heart'], ['💛', 'yellow heart'], ['💚', 'green heart'],
    ['💙', 'blue heart'], ['💜', 'purple heart'], ['🖤', 'black heart'], ['🤍', 'white heart'],
    ['🤎', 'brown heart'], ['💔', 'broken heart'], ['❣️', 'heart exclamation'], ['💕', 'two hearts'],
    ['💞', 'revolving hearts'], ['💓', 'beating heart'], ['💗', 'growing heart'], ['💖', 'sparkling heart'],
    ['💘', 'heart arrow'], ['💝', 'heart gift'], ['💟', 'heart decoration'], ['☮️', 'peace'],
    ['✝️', 'cross christian'], ['☪️', 'star crescent islam'], ['🕉️', 'om hindu'], ['☸️', 'dharma wheel'],
    ['✡️', 'star of david'], ['🔯', 'six pointed star'], ['🕎', 'menorah'], ['☯️', 'yin yang'],
    ['☦️', 'orthodox cross'], ['🛐', 'place of worship'], ['⛎', 'ophiuchus'], ['♈', 'aries'],
    ['♉', 'taurus'], ['♊', 'gemini'], ['♋', 'cancer'], ['♌', 'leo'],
    ['♍', 'virgo'], ['♎', 'libra'], ['♏', 'scorpio'], ['♐', 'sagittarius'],
    ['♑', 'capricorn'], ['♒', 'aquarius'], ['♓', 'pisces'], ['🆔', 'id'],
    ['⚛️', 'atom science'], ['🉑', 'accept'], ['☢️', 'radioactive'], ['☣️', 'biohazard'],
    ['📴', 'mobile off'], ['📳', 'vibration'], ['🈶', 'not free'], ['🈚', 'free charge'],
    ['🈸', 'application'], ['🈺', 'open business'], ['🈷️', 'monthly'], ['✴️', 'eight pointed star'],
    ['🆚', 'vs'], ['💮', 'white flower'], ['🉐', 'bargain'], ['㊙️', 'secret'],
    ['㊗️', 'congratulations'], ['🈴', 'passing'], ['🈵', 'no vacancy'], ['🈹', 'discount'],
    ['🈲', 'prohibited'], ['🅰️', 'a blood type'], ['🅱️', 'b blood type'], ['🆎', 'ab'],
    ['🆑', 'cl'], ['🅾️', 'o blood type'], ['🆘', 'sos help'], ['❌', 'x no cross'],
    ['⭕', 'circle o'], ['🛑', 'stop sign'], ['⛔', 'no entry'], ['📛', 'name badge'],
    ['🚫', 'prohibited'], ['💯', '100 hundred'], ['💢', 'anger'], ['♨️', 'hot springs'],
    ['🚷', 'no pedestrians'], ['🚯', 'no littering'], ['🚳', 'no bicycles'], ['🚱', 'not potable'],
    ['🔞', '18 adult'], ['📵', 'no mobile'], ['🚭', 'no smoking'], ['❗', 'exclamation'],
    ['❕', 'white exclamation'], ['❓', 'question'], ['❔', 'white question'], ['‼️', 'double exclamation'],
    ['⁉️', 'interrobang'], ['🔅', 'dim'], ['🔆', 'bright'], ['〽️', 'part alternation'],
    ['⚠️', 'warning'], ['🚸', 'children crossing'], ['🔱', 'trident'], ['⚜️', 'fleur de lis'],
    ['🔰', 'japanese beginner'], ['♻️', 'recycle'], ['✅', 'check mark green'], ['🈯', 'reserved'],
    ['💹', 'chart up'], ['❇️', 'sparkle'], ['✳️', 'eight spoked'], ['❎', 'cross mark button'],
    ['🌐', 'globe meridians'], ['💠', 'diamond with dot'], ['Ⓜ️', 'metro m'], ['🌀', 'cyclone'],
    ['💤', 'zzz sleep'], ['🏧', 'atm'], ['🚾', 'wc'], ['♿', 'wheelchair'],
    ['🅿️', 'parking'], ['🛗', 'elevator'], ['🈳', 'vacancy'], ['🈂️', 'service'],
    ['🛂', 'passport control'], ['🛃', 'customs'], ['🛄', 'baggage'], ['🛅', 'left luggage'],
    ['🚹', 'mens'], ['🚺', 'womens'], ['🚼', 'baby'], ['🚻', 'restroom'],
    ['🚮', 'litter'], ['🎦', 'cinema'], ['📶', 'signal bars'], ['🈁', 'here'],
    ['🔣', 'input symbols'], ['ℹ️', 'information'], ['🔤', 'input latin'], ['🔡', 'lower case'],
    ['🔠', 'capital letters'], ['🆖', 'ng'], ['🆗', 'ok'], ['🆙', 'up'],
    ['🆒', 'cool'], ['🆕', 'new'], ['🆓', 'free'],
    ['0️⃣', '0 zero'], ['1️⃣', '1 one'], ['2️⃣', '2 two'], ['3️⃣', '3 three'], ['4️⃣', '4 four'],
    ['5️⃣', '5 five'], ['6️⃣', '6 six'], ['7️⃣', '7 seven'], ['8️⃣', '8 eight'], ['9️⃣', '9 nine'],
    ['🔟', '10 ten'], ['🔢', 'numbers input'], ['#️⃣', 'hash'], ['*️⃣', 'asterisk'],
    ['▶️', 'play'], ['⏸️', 'pause'], ['⏯️', 'play pause'], ['⏹️', 'stop'], ['⏺️', 'record'],
    ['⏭️', 'next'], ['⏮️', 'previous'], ['⏩', 'fast forward'], ['⏪', 'rewind'],
    ['🔼', 'up'], ['🔽', 'down'], ['⏫', 'double up'], ['⏬', 'double down'],
    ['➡️', 'right'], ['⬅️', 'left'], ['⬆️', 'up'], ['⬇️', 'down'],
    ['↗️', 'up right'], ['↘️', 'down right'], ['↙️', 'down left'], ['↖️', 'up left'],
    ['↕️', 'up down'], ['↔️', 'left right'], ['↩️', 'back'], ['↪️', 'forward'],
    ['⤴️', 'up'], ['⤵️', 'down'], ['🔀', 'shuffle'], ['🔁', 'repeat'],
    ['🔂', 'repeat one'], ['🔄', 'refresh'], ['🔃', 'vertical cycle'], ['🎵', 'note music'],
    ['🎶', 'notes music'], ['➕', 'plus'], ['➖', 'minus'], ['➗', 'divide'],
    ['✖️', 'multiply'], ['♾️', 'infinity'], ['💲', 'dollar sign'], ['💱', 'currency exchange'],
    ['™️', 'trademark'], ['©️', 'copyright'], ['®️', 'registered'], ['〰️', 'wavy dash'],
    ['➰', 'curly loop'], ['➿', 'double loop'], ['🔚', 'end'], ['🔙', 'back'],
    ['🔛', 'on'], ['🔝', 'top'], ['🔜', 'soon'], ['✔️', 'check'],
    ['☑️', 'ballot box check'], ['🔘', 'radio button'], ['🔴', 'red circle'], ['🟠', 'orange circle'],
    ['🟡', 'yellow circle'], ['🟢', 'green circle'], ['🔵', 'blue circle'], ['🟣', 'purple circle'],
    ['⚫', 'black circle'], ['⚪', 'white circle'], ['🟤', 'brown circle'], ['🟥', 'red square'],
    ['🟧', 'orange square'], ['🟨', 'yellow square'], ['🟩', 'green square'], ['🟦', 'blue square'],
    ['🟪', 'purple square'], ['⬛', 'black square'], ['⬜', 'white square'], ['🟫', 'brown square'],
    ['◼️', 'black medium square'], ['◻️', 'white medium square'], ['◾', 'black small square'], ['◽', 'white small square'],
    ['▪️', 'black small square'], ['▫️', 'white small square'], ['🔶', 'large orange diamond'], ['🔷', 'large blue diamond'],
    ['🔸', 'small orange diamond'], ['🔹', 'small blue diamond'], ['🔺', 'red triangle up'], ['🔻', 'red triangle down'],
    ['💬', 'speech balloon chat'], ['💭', 'thought balloon'], ['🗯️', 'right anger bubble'], ['🗨️', 'left speech'],
    ['🔔', 'bell notification'], ['🔕', 'bell muted'], ['📣', 'megaphone'], ['📢', 'loudspeaker'],
    ['🔥', 'fire'], ['✨', 'sparkles'], ['⭐', 'star'], ['🌟', 'glowing star'],
    ['💫', 'dizzy star'], ['⚡', 'zap lightning'], ['☄️', 'comet'], ['💥', 'boom collision'],
    ['💧', 'droplet'], ['🌊', 'wave water'], ['🌈', 'rainbow'], ['☀️', 'sun'],
    ['🌤️', 'sun cloud'], ['⛅', 'partly cloudy'], ['🌥️', 'cloudy sun'], ['☁️', 'cloud'],
    ['🌦️', 'sun rain'], ['🌧️', 'rain'], ['⛈️', 'thunderstorm'], ['🌩️', 'lightning cloud'],
    ['🌨️', 'snow cloud'], ['❄️', 'snowflake'], ['☃️', 'snowman snow'], ['⛄', 'snowman'],
    ['🌬️', 'wind face'], ['💨', 'dash'], ['🌪️', 'tornado'], ['🌫️', 'fog'],
    ['🌙', 'crescent moon'], ['🌛', 'first quarter moon face'], ['🌜', 'last quarter moon face'],
    ['🌚', 'new moon face'], ['🌝', 'full moon face'], ['🌞', 'sun face'],
    ['🌑', 'new moon'], ['🌒', 'waxing crescent'], ['🌓', 'first quarter'], ['🌔', 'waxing gibbous'],
    ['🌕', 'full moon'], ['🌖', 'waning gibbous'], ['🌗', 'last quarter'], ['🌘', 'waning crescent'],
  ],
};

// DOM
const searchEl = document.getElementById('em-search');
const catsEl = document.getElementById('em-cats');
const listEl = document.getElementById('em-list');
const recentEl = document.getElementById('em-recent');
const recentGrid = document.getElementById('em-grid-recent');
const copiedEl = document.getElementById('em-copied');
const copiedEmoji = document.getElementById('em-copied-emoji');

let activeCat = 'All';
let recent = [];

function renderCats() {
  const cats = ['All', ...Object.keys(EMOJI)];
  catsEl.innerHTML = '';
  cats.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'em-cat-btn' + (c === activeCat ? ' active' : '');
    b.textContent = c;
    b.addEventListener('click', () => { activeCat = c; renderCats(); render(); });
    catsEl.appendChild(b);
  });
}

function makeBtn(emo) {
  const b = document.createElement('button');
  b.className = 'em-btn'; b.type = 'button';
  b.textContent = emo;
  b.title = emo;
  b.addEventListener('click', () => copyEmoji(emo));
  return b;
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  listEl.innerHTML = '';
  const cats = activeCat === 'All' ? Object.keys(EMOJI) : [activeCat];
  let total = 0;
  cats.forEach(cat => {
    const matches = EMOJI[cat].filter(([e, k]) => !q || k.includes(q) || e === q);
    if (matches.length === 0) return;
    const sec = document.createElement('div');
    sec.className = 'em-section';
    sec.innerHTML = `<h2>${cat}</h2><div class="em-grid"></div>`;
    const g = sec.querySelector('.em-grid');
    matches.forEach(([e]) => g.appendChild(makeBtn(e)));
    listEl.appendChild(sec);
    total += matches.length;
  });
  if (total === 0) {
    listEl.innerHTML = '<div class="em-empty">No emojis match.</div>';
  }
}

function renderRecent() {
  if (recent.length === 0) { recentEl.style.display = 'none'; return; }
  recentEl.style.display = 'block';
  recentGrid.innerHTML = '';
  recent.forEach(e => recentGrid.appendChild(makeBtn(e)));
}

async function copyEmoji(e) {
  try {
    await navigator.clipboard.writeText(e);
    copiedEmoji.textContent = e;
    copiedEl.style.display = 'block';
    setTimeout(() => { copiedEl.style.display = 'none'; }, 1200);
    recent = [e, ...recent.filter(x => x !== e)].slice(0, 20);
    renderRecent();
  } catch {}
}

searchEl.addEventListener('input', render);
renderCats();
render();
