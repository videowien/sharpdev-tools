const $=id=>document.getElementById(id);
let idx=null,raf=null;
function onConn(e){idx=e.gamepad.index;$('gpstatus').textContent='Controller connected. Press buttons and move the sticks.';loop();}
function onDisc(){idx=null;$('gpname').textContent='—';$('btns').innerHTML='';$('axes').innerHTML='';$('gpstatus').textContent='Controller disconnected.';if(raf)cancelAnimationFrame(raf);}
window.addEventListener('gamepadconnected',onConn);
window.addEventListener('gamepaddisconnected',onDisc);
function loop(){const pads=navigator.getGamepads?navigator.getGamepads():[];let gp=null;for(const p of pads){if(p){gp=p;break;}}
 if(gp){$('gpname').textContent=gp.id;const bc=$('btns');if(bc.children.length!==gp.buttons.length){bc.innerHTML='';gp.buttons.forEach((b,i)=>{const d=document.createElement('div');d.className='gp-btn';d.id='b'+i;bc.appendChild(d);});}
  gp.buttons.forEach((b,i)=>{const d=$('b'+i);if(d){d.className='gp-btn'+(b.pressed?' on':'');d.textContent='B'+i+' '+(Math.round(b.value*100)/100);}});
  const ac=$('axes');if(ac.children.length!==gp.axes.length){ac.innerHTML='';gp.axes.forEach((a,i)=>{const d=document.createElement('div');d.className='gp-axis';d.id='a'+i;ac.appendChild(d);});}
  gp.axes.forEach((a,i)=>{const d=$('a'+i);if(d)d.textContent='Axis '+i+': '+(Math.round(a*1000)/1000);});}
 raf=requestAnimationFrame(loop);}
// in case a pad is already present (e.g. page reload)
if(navigator.getGamepads){for(const p of navigator.getGamepads()){if(p){idx=p.index;$('gpstatus').textContent='Controller detected. Press buttons and move the sticks.';loop();break;}}}