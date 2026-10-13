/**
 * Lorem Ipsum Generator — SharpDev Tools
 * 100% browser-side placeholder text generation.
 */

// Classic Lorem Ipsum word bank (from the original Cicero text)
const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
  'aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit',
  'voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
  'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt',
  'mollit','anim','id','est','laborum','porta','nibh','venenatis','cras','fermentum',
  'posuere','urna','nec','tincidunt','praesent','semper','feugiat','leo','vel',
  'fringilla','turpis','massa','tincidunt','dui','sapien','eget','mi','proin',
  'gravida','hendrerit','lectus','vestibulum','mattis','ullamcorper','morbi',
  'tristique','senectus','netus','malesuada','fames','ac','pellentesque','eu',
  'tincidunt','tortor','aliquam','elementum','sagittis','vitae','orci','diam',
  'sollicitudin','maecenas','ultricies','lacus','viverra','accumsan','lacinia',
  'at','quis','risus','vivamus','arcu','felis','bibendum','auctor','augue',
  'mauris','rhoncus','aenean','pharetra','dignissim','suspendisse','potenti',
  'blandit','volutpat','donec','pretium','vulputate','odio','facilisis',
  'convallis','nam','libero','justo','laoreet','placerat','orci','a','scelerisque',
  'purus','imperdiet','condimentum','neque','ligula','pulvinar','etiam','dictum',
];

const FIRST_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const outputText = document.getElementById('output-text');
const outputStats = document.getElementById('output-stats');
const copyMsgEl = document.getElementById('copy-msg');

let lastPlain = '';
let lastHtml = '';

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(minWords, maxWords) {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const words = [];
  for (let i = 0; i < len; i++) {
    words.push(randomWord());
  }
  // Capitalize first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  // Occasionally add a comma
  if (len > 6) {
    const commaPos = 2 + Math.floor(Math.random() * (len - 4));
    words[commaPos] += ',';
  }

  return words.join(' ') + '.';
}

function generateParagraph(minSentences, maxSentences) {
  const count = minSentences + Math.floor(Math.random() * (maxSentences - minSentences + 1));
  const sentences = [];
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence(6, 16));
  }
  return sentences.join(' ');
}

// Classic opener has this many words; used to keep Words-mode counts exact.
const CLASSIC_WORDS = FIRST_SENTENCE.replace(/[.,]/g, '').split(/\s+/).length; // 19

function generate() {
  const amount = Math.min(1000, Math.max(1, parseInt(document.getElementById('amount').value) || 1));
  const unit = document.getElementById('unit').value;
  const startWithLorem = document.getElementById('start-lorem').checked;

  let paragraphs = [];

  if (unit === 'paragraphs') {
    for (let i = 0; i < amount; i++) {
      paragraphs.push(generateParagraph(4, 7));
    }
  } else if (unit === 'sentences') {
    const sentences = [];
    for (let i = 0; i < amount; i++) {
      sentences.push(generateSentence(6, 16));
    }
    // Group into paragraphs of ~4-6 sentences
    const perPara = Math.min(amount, 5);
    for (let i = 0; i < sentences.length; i += perPara) {
      paragraphs.push(sentences.slice(i, i + perPara).join(' '));
    }
  } else {
    // Words — generate EXACTLY `amount` words.
    // If "Start with Lorem" is on and we have room, the classic 19-word
    // phrase becomes the first sentence and we fill the rest with random
    // words so the total never inflates beyond `amount`.
    const sentences = [];
    let remainingWords = amount;
    if (startWithLorem && amount >= CLASSIC_WORDS) {
      sentences.push(FIRST_SENTENCE);
      remainingWords = amount - CLASSIC_WORDS;
    }
    const words = [];
    for (let i = 0; i < remainingWords; i++) words.push(randomWord());
    if (words.length > 0) {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    // Break into sentences (~10 words each)
    for (let i = 0; i < words.length; i += 10) {
      const chunk = words.slice(i, i + 10);
      chunk[0] = chunk[0].charAt(0).toUpperCase() + chunk[0].slice(1);
      if (chunk.length > 5) {
        const cp = 2 + Math.floor(Math.random() * (chunk.length - 3));
        chunk[cp] += ',';
      }
      sentences.push(chunk.join(' ') + '.');
    }

    // Group into paragraphs of 4 sentences each
    const perPara = Math.min(sentences.length, 4);
    if (perPara > 0) {
      for (let i = 0; i < sentences.length; i += perPara) {
        paragraphs.push(sentences.slice(i, i + perPara).join(' '));
      }
    }
  }

  // For paragraphs/sentences modes, splice the classic opener onto the
  // first generated sentence. Words mode already handled it above.
  if (startWithLorem && unit !== 'words' && paragraphs.length > 0) {
    const rest = paragraphs[0].split('. ').slice(1).join('. ');
    paragraphs[0] = FIRST_SENTENCE + (rest ? ' ' + rest : '');
  }

  // Render
  lastPlain = paragraphs.join('\n\n');
  lastHtml = paragraphs.map(p => '<p>' + p + '</p>').join('\n');

  outputText.innerHTML = paragraphs.map(p => '<p>' + p + '</p>').join('');

  // Stats
  const wordCount = lastPlain.trim().split(/\s+/).length;
  const charCount = lastPlain.length;
  outputStats.textContent = `${wordCount} words \u2022 ${charCount} characters \u2022 ${paragraphs.length} paragraph${paragraphs.length !== 1 ? 's' : ''}`;
}

function copyOutput() {
  if (!lastPlain) return;
  navigator.clipboard.writeText(lastPlain).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = lastPlain;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
  showCopyMsg('Copied!');
}

function copyHtml() {
  if (!lastHtml) return;
  navigator.clipboard.writeText(lastHtml).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = lastHtml;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
  showCopyMsg('HTML copied!');
}

function showCopyMsg(msg) {
  copyMsgEl.textContent = msg;
  setTimeout(() => { copyMsgEl.textContent = ''; }, 2000);
}

// Generate on load
generate();
