/**
 * Slug Generator — SharpDev Tools
 * Handles Unicode, accents, stopwords.
 */

const STOPWORDS = new Set([
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'for', 'to', 'and', 'or', 'but',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'with', 'from',
  'by', 'as', 'it', 'its', 'this', 'that', 'these', 'those'
]);

function generate() {
  const input = document.getElementById('input-text').value;
  const sep = document.querySelector('input[name="sep"]:checked').value;
  const lower = document.getElementById('opt-lower').checked;
  const stripStop = document.getElementById('opt-strip-stop').checked;

  let text = input;

  // Normalize Unicode — convert accented chars to ASCII (é → e, ñ → n, etc.)
  text = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

  // German umlauts and special chars not handled by NFKD
  text = text.replace(/ß/g, 'ss').replace(/æ/gi, 'ae').replace(/œ/gi, 'oe').replace(/ø/gi, 'o');

  if (lower) text = text.toLowerCase();

  // Strip stopwords (word boundaries)
  if (stripStop) {
    text = text.split(/\s+/).filter(w => !STOPWORDS.has(w.toLowerCase())).join(' ');
  }

  // Replace any non-alphanumeric sequence with separator
  text = text.replace(/[^a-zA-Z0-9]+/g, sep);

  // Trim leading/trailing separators
  const sepEscaped = sep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  text = text.replace(new RegExp(`^${sepEscaped}+|${sepEscaped}+$`, 'g'), '');

  document.getElementById('output').value = text;
}

function copySlug() {
  const out = document.getElementById('output');
  if (!out.value) return;
  navigator.clipboard.writeText(out.value).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1000);
  });
}

// Initial
generate();
