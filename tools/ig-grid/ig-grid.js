/**
 * Instagram Grid Preview — drag-to-reorder, up to 12 images
 */

const MAX = 12;
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const gridCard = document.getElementById('grid-card');
const gridPreview = document.getElementById('grid-preview');

let tiles = []; // each: { id, dataUrl }
let dragSrc = null;

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) addFiles(Array.from(fileInput.files));
  fileInput.value = '';
});
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) addFiles(Array.from(e.dataTransfer.files));
});

document.getElementById('clear-btn').addEventListener('click', () => {
  tiles = [];
  render();
});

async function addFiles(files) {
  const available = MAX - tiles.length;
  const accept = files.filter(f => f.type.startsWith('image/')).slice(0, available);
  for (const file of accept) {
    const dataUrl = await new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(file);
    });
    tiles.push({ id: Math.random().toString(36).slice(2), dataUrl });
  }
  render();
}

function render() {
  if (tiles.length === 0) {
    gridCard.style.display = 'none';
    return;
  }
  gridCard.style.display = '';
  gridPreview.innerHTML = '';
  tiles.forEach((t, idx) => {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.draggable = true;
    cell.dataset.idx = idx;
    cell.innerHTML = `<img src="${t.dataUrl}" alt="grid item ${idx + 1}"/><button class="remove" type="button" aria-label="Remove">×</button>`;

    cell.querySelector('.remove').addEventListener('click', (e) => {
      e.stopPropagation();
      tiles.splice(idx, 1);
      render();
    });

    cell.addEventListener('dragstart', (e) => {
      dragSrc = idx;
      cell.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    cell.addEventListener('dragend', () => cell.classList.remove('dragging'));
    cell.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
    cell.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragSrc === null || dragSrc === idx) return;
      const moved = tiles.splice(dragSrc, 1)[0];
      tiles.splice(idx, 0, moved);
      dragSrc = null;
      render();
    });

    gridPreview.appendChild(cell);
  });
}
