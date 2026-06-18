const $=id=>document.getElementById(id);
const M={
 'Normal vision':null,
 'Protanopia (red-blind)':[0.567,0.433,0,0.558,0.442,0,0,0.242,0.758],
 'Deuteranopia (green-blind)':[0.625,0.375,0,0.7,0.3,0,0,0.3,0.7],
 'Tritanopia (blue-blind)':[0.95,0.05,0,0,0.433,0.567,0,0.475,0.525],
 'Achromatopsia (no color)':[0.299,0.587,0.114,0.299,0.587,0.114,0.299,0.587,0.114]
};
function hex2rgb(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function apply(rgb,m){if(!m)return rgb;const[r,g,b]=rgb;return [m[0]*r+m[1]*g+m[2]*b,m[3]*r+m[4]*g+m[5]*b,m[6]*r+m[7]*g+m[8]*b].map(v=>Math.max(0,Math.min(255,Math.round(v))));}
function css(rgb){return 'rgb('+rgb.join(',')+')';}
function go(){
  const a=hex2rgb($('c1').value),b=hex2rgb($('c2').value);
  $('grid').innerHTML=Object.entries(M).map(([name,m])=>{
    return `<div class="cbrow"><span class="name">${name}</span><div class="sw"><div style="background:${css(apply(a,m))}"></div><div style="background:${css(apply(b,m))}"></div></div></div>`;
  }).join('');
}
['c1','c2'].forEach(id=>$(id).addEventListener('input',go));
go();