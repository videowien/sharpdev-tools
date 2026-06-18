/**
 * GPA Calculator — 4.0 + 5.0 (weighted) US scales
 */

const GRADES = [
  { label: 'A+', uw: 4.0, w: 5.0 }, { label: 'A',  uw: 4.0, w: 5.0 }, { label: 'A-', uw: 3.7, w: 4.7 },
  { label: 'B+', uw: 3.3, w: 4.3 }, { label: 'B',  uw: 3.0, w: 4.0 }, { label: 'B-', uw: 2.7, w: 3.7 },
  { label: 'C+', uw: 2.3, w: 3.3 }, { label: 'C',  uw: 2.0, w: 3.0 }, { label: 'C-', uw: 1.7, w: 2.7 },
  { label: 'D+', uw: 1.3, w: 2.3 }, { label: 'D',  uw: 1.0, w: 2.0 }, { label: 'D-', uw: 0.7, w: 1.7 },
  { label: 'F',  uw: 0.0, w: 0.0 },
];
const TYPES = [
  { id: 'regular', label: 'Regular', bonus: 0 },
  { id: 'honors',  label: 'Honors',  bonus: 0.5 },
  { id: 'ap',      label: 'AP / IB / College', bonus: 1.0 },
];

let courses = [
  { name: 'English', grade: 'A', credits: 1, type: 'regular' },
  { name: 'Calculus', grade: 'B+', credits: 1, type: 'ap' },
  { name: 'Biology', grade: 'A-', credits: 1, type: 'honors' },
];

const list = document.getElementById('course-list');

function render() {
  list.innerHTML = '';
  courses.forEach((c, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" value="${escAttr(c.name)}" placeholder="Course name"/></td>
      <td><select>${GRADES.map(g => `<option ${g.label === c.grade ? 'selected' : ''}>${g.label}</option>`).join('')}</select></td>
      <td><input class="numeric" type="number" step="0.5" min="0" value="${c.credits}"/></td>
      <td><select>${TYPES.map(t => `<option value="${t.id}" ${t.id === c.type ? 'selected' : ''}>${t.label}</option>`).join('')}</select></td>
      <td><button class="x" type="button" aria-label="Remove">×</button></td>
    `;
    const [nameI, gradeI, credI, typeI] = tr.querySelectorAll('input, select');
    nameI.addEventListener('input', () => { c.name = nameI.value; });
    gradeI.addEventListener('change', () => { c.grade = gradeI.value; calc(); });
    credI.addEventListener('input', () => { c.credits = parseFloat(credI.value) || 0; calc(); });
    typeI.addEventListener('change', () => { c.type = typeI.value; calc(); });
    tr.querySelector('.x').addEventListener('click', () => { courses.splice(i, 1); render(); calc(); });
    list.appendChild(tr);
  });
}

function calc() {
  let totalCredits = 0;
  let unweightedSum = 0;
  let weightedSum = 0;
  for (const c of courses) {
    const g = GRADES.find(g => g.label === c.grade);
    const t = TYPES.find(t => t.id === c.type);
    if (!g || !t) continue;
    const credits = Math.max(0, c.credits || 0);
    totalCredits += credits;
    unweightedSum += g.uw * credits;
    // Weighted: F still F, otherwise add type bonus to unweighted
    const w = g.uw === 0 ? 0 : Math.min(5.0, g.uw + t.bonus);
    weightedSum += w * credits;
  }
  document.getElementById('r-credits').textContent = totalCredits.toFixed(1);
  document.getElementById('r-unweighted').textContent = totalCredits ? (unweightedSum / totalCredits).toFixed(2) : '—';
  document.getElementById('r-weighted').textContent = totalCredits ? (weightedSum / totalCredits).toFixed(2) : '—';
}

function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

document.getElementById('add-course').addEventListener('click', () => {
  courses.push({ name: '', grade: 'A', credits: 1, type: 'regular' });
  render(); calc();
});

render();
calc();
