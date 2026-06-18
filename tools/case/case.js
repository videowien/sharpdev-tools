/**
 * Case Converter — SharpDev Tools
 * 100% browser-side text case conversion.
 */

const textInput = document.getElementById('text-input');
const resultArea = document.getElementById('result-area');
const resultText = document.getElementById('result-text');
const charCount = document.getElementById('char-count');
const copyMsg = document.getElementById('copy-msg');

let lastResult = '';

textInput.addEventListener('input', () => {
  charCount.textContent = textInput.value.length;
});

function splitWords(text) {
  // Split on spaces, underscores, hyphens, dots, camelCase boundaries
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')      // camelCase split
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // ABCDef -> ABC Def
    .replace(/[_\-\.]+/g, ' ')                   // underscores, hyphens, dots -> spaces
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function convert(type) {
  const text = textInput.value;
  if (!text.trim()) return;

  let result = '';

  switch (type) {
    case 'upper':
      result = text.toUpperCase();
      break;

    case 'lower':
      result = text.toLowerCase();
      break;

    case 'title':
      // Capitalize first letter of every word, lowercase the rest
      // Keeps small words lowercase when not first (a, an, the, in, on, at, to, for, of, and, but, or)
      const small = new Set(['a','an','the','in','on','at','to','for','of','and','but','or','nor','is','it','by','as']);
      result = text.toLowerCase().replace(/\b\w+/g, (word, idx) => {
        if (idx === 0 || !small.has(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      });
      // Always capitalize first character
      result = result.charAt(0).toUpperCase() + result.slice(1);
      break;

    case 'sentence':
      result = text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, prefix, letter) => {
        return prefix + letter.toUpperCase();
      });
      // Capitalize very first letter
      result = result.charAt(0).toUpperCase() + result.slice(1);
      break;

    case 'camel': {
      const words = splitWords(text);
      result = words.map((w, i) => {
        w = w.toLowerCase();
        return i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1);
      }).join('');
      break;
    }

    case 'pascal': {
      const words = splitWords(text);
      result = words.map(w => {
        w = w.toLowerCase();
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join('');
      break;
    }

    case 'snake': {
      const words = splitWords(text);
      result = words.map(w => w.toLowerCase()).join('_');
      break;
    }

    case 'kebab': {
      const words = splitWords(text);
      result = words.map(w => w.toLowerCase()).join('-');
      break;
    }

    case 'dot': {
      const words = splitWords(text);
      result = words.map(w => w.toLowerCase()).join('.');
      break;
    }

    case 'constant': {
      const words = splitWords(text);
      result = words.map(w => w.toUpperCase()).join('_');
      break;
    }

    case 'toggle':
      result = text.split('').map(c => {
        if (c === c.toUpperCase()) return c.toLowerCase();
        return c.toUpperCase();
      }).join('');
      break;

    case 'capitalize':
      result = text.replace(/\b\w/g, c => c.toUpperCase());
      break;
  }

  lastResult = result;
  resultText.textContent = result;
  resultArea.style.display = 'block';
  copyMsg.textContent = '';
}

function copyResult() {
  if (!lastResult) return;
  navigator.clipboard.writeText(lastResult).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = lastResult;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
  copyMsg.textContent = 'Copied!';
  setTimeout(() => { copyMsg.textContent = ''; }, 2000);
}

function useAsInput() {
  if (!lastResult) return;
  textInput.value = lastResult;
  charCount.textContent = lastResult.length;
  resultArea.style.display = 'none';
  textInput.focus();
}
