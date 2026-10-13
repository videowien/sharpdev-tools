/**
 * ASCII Art Generator — 5×6 bitmap font with multiple render styles
 * Each character is 5 cols wide × 6 rows tall. # = filled, . = empty.
 */

const FONT = {
  'A': [' ### ','#   #','#   #','#####','#   #','#   #'],
  'B': ['#### ','#   #','#### ','#   #','#   #','#### '],
  'C': [' ####','#    ','#    ','#    ','#    ',' ####'],
  'D': ['#### ','#   #','#   #','#   #','#   #','#### '],
  'E': ['#####','#    ','#### ','#    ','#    ','#####'],
  'F': ['#####','#    ','#### ','#    ','#    ','#    '],
  'G': [' ####','#    ','#  ##','#   #','#   #',' ####'],
  'H': ['#   #','#   #','#####','#   #','#   #','#   #'],
  'I': ['#####','  #  ','  #  ','  #  ','  #  ','#####'],
  'J': ['  ###','    #','    #','    #','#   #',' ### '],
  'K': ['#   #','#  # ','###  ','#  # ','#   #','#   #'],
  'L': ['#    ','#    ','#    ','#    ','#    ','#####'],
  'M': ['#   #','## ##','# # #','#   #','#   #','#   #'],
  'N': ['#   #','##  #','# # #','#  ##','#   #','#   #'],
  'O': [' ### ','#   #','#   #','#   #','#   #',' ### '],
  'P': ['#### ','#   #','#### ','#    ','#    ','#    '],
  'Q': [' ### ','#   #','#   #','# # #','#  # ',' ## #'],
  'R': ['#### ','#   #','#### ','#  # ','#   #','#   #'],
  'S': [' ####','#    ',' ### ','    #','    #','#### '],
  'T': ['#####','  #  ','  #  ','  #  ','  #  ','  #  '],
  'U': ['#   #','#   #','#   #','#   #','#   #',' ### '],
  'V': ['#   #','#   #','#   #','#   #',' # # ','  #  '],
  'W': ['#   #','#   #','#   #','# # #','## ##','#   #'],
  'X': ['#   #',' # # ','  #  ','  #  ',' # # ','#   #'],
  'Y': ['#   #',' # # ','  #  ','  #  ','  #  ','  #  '],
  'Z': ['#####','    #','   # ','  #  ',' #   ','#####'],
  '0': [' ### ','#   #','#  ##','# # #','##  #',' ### '],
  '1': ['  #  ',' ##  ','  #  ','  #  ','  #  ','#####'],
  '2': [' ### ','#   #','   # ','  #  ',' #   ','#####'],
  '3': [' ### ','#   #','   # ','    #','#   #',' ### '],
  '4': ['#  # ','#  # ','#####','   # ','   # ','   # '],
  '5': ['#####','#    ','#### ','    #','#   #',' ### '],
  '6': [' ### ','#    ','#### ','#   #','#   #',' ### '],
  '7': ['#####','    #','   # ','  #  ',' #   ','#    '],
  '8': [' ### ','#   #',' ### ','#   #','#   #',' ### '],
  '9': [' ### ','#   #','#   #',' ####','    #',' ### '],
  '?': [' ### ','#   #','   # ','  #  ','     ','  #  '],
  '!': ['  #  ','  #  ','  #  ','  #  ','     ','  #  '],
  '.': ['     ','     ','     ','     ','     ','  #  '],
  ',': ['     ','     ','     ','     ','  #  ',' #   '],
  '-': ['     ','     ','#####','     ','     ','     '],
  ' ': ['     ','     ','     ','     ','     ','     '],
};

const textEl = document.getElementById('text');
const styleEl = document.getElementById('style');
const fillEl = document.getElementById('fill');
const art = document.getElementById('art');
const statusMsg = document.getElementById('status-msg');

function render() {
  let chars = textEl.value.toUpperCase().split('').map(c => FONT[c] ? c : (c === ' ' ? ' ' : '?'));
  // Limit to ~20 chars to keep output sane
  chars = chars.slice(0, 20);
  if (chars.length === 0) { art.textContent = ''; return; }
  const fill = (fillEl.value || '#').slice(0, 1);
  const style = styleEl.value;

  const ROWS = 6;
  const lines = Array(ROWS).fill('');
  for (const c of chars) {
    const glyph = FONT[c];
    for (let r = 0; r < ROWS; r++) {
      let row = glyph[r];
      if (style === 'shadow') {
        // Add a "shadow" — replace # with fill and add light shadow on right
        row = row.replace(/#/g, fill);
      } else if (style === 'thin') {
        // Just replace # with single char, but use less dense fill
        row = row.replace(/#/g, '|').replace(/\|+/g, m => m.length > 1 ? '═'.repeat(m.length) : '|');
        // Convert back to fill for chosen char
        row = row.replace(/[|═]/g, fill);
      } else if (style === 'hash') {
        // dense
        row = row.replace(/#/g, fill + fill);
      } else {
        // block
        row = row.replace(/#/g, fill);
      }
      lines[r] += row + ' ';
    }
  }
  art.textContent = lines.join('\n');
}

[textEl, styleEl, fillEl].forEach(el => {
  el.addEventListener('input', render);
  if (el.tagName === 'SELECT') el.addEventListener('change', render);
});

document.getElementById('copy-btn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(art.textContent);
  statusMsg.textContent = '✓ Copied'; statusMsg.className = 'status-msg ok';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
});
document.getElementById('dl-btn').addEventListener('click', () => {
  const blob = new Blob([art.textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `ascii-${(textEl.value || 'art').toLowerCase().slice(0,20)}.txt`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

render();
