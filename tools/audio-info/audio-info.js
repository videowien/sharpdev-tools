const $=id=>document.getElementById(id);
let ctx=null;
function fmtSize(b){return b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(2)+' MB';}
function fmtDur(s){const m=Math.floor(s/60),sec=(s%60);return (m>0?m+'m ':'')+sec.toFixed(2)+'s';}
// Read the TRUE sample rate + channels from the file header. decodeAudioData resamples to the
// AudioContext rate, so it cannot be trusted for a file-info tool. Returns {sr, ch} or null.
function readHeader(buf){
  const dv=new DataView(buf),u8=new Uint8Array(buf);
  const tag=(o,n)=>{let s='';for(let i=0;i<n;i++)s+=String.fromCharCode(u8[o+i]);return s;};
  if(buf.byteLength>44&&tag(0,4)==='RIFF'&&tag(8,4)==='WAVE'){
    let o=12;
    while(o+8<=buf.byteLength){const id=tag(o,4),sz=dv.getUint32(o+4,true);
      if(id==='fmt '){return {sr:dv.getUint32(o+12,true),ch:dv.getUint16(o+10,true)};}
      o+=8+sz+(sz&1);}
  }
  if(tag(0,4)==='fLaC'&&buf.byteLength>21){
    const sr=(dv.getUint8(18)<<12)|(dv.getUint8(19)<<4)|(dv.getUint8(20)>>4);
    const ch=((dv.getUint8(20)>>1)&0x07)+1;
    if(sr>0)return {sr,ch};
  }
  const RATES={3:[44100,48000,32000],2:[22050,24000,16000],0:[11025,12000,8000]};
  const lim=Math.min(buf.byteLength-4,300000);
  for(let i=0;i<lim;i++){
    if(u8[i]===0xFF&&(u8[i+1]&0xE0)===0xE0){
      const ver=(u8[i+1]>>3)&3,srIdx=(u8[i+2]>>2)&3,chMode=(u8[i+3]>>6)&3;
      if(RATES[ver]&&srIdx<3)return {sr:RATES[ver][srIdx],ch:chMode===3?1:2};
    }
  }
  return null;
}
async function processFile(f){
  if(!f)return;
  if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();
  const size=f.size,buf=await f.arrayBuffer();
  const hdr=readHeader(buf.slice(0));
  let dur=null,decCh=null;
  try{const a=await ctx.decodeAudioData(buf.slice(0));dur=a.duration;decCh=a.numberOfChannels;}
  catch(e){if(!hdr){alert('Could not read this audio file in your browser: '+(e.message||e.name));return;}}
  $('drop').style.display='none';$('editor').style.display='';
  const sr=hdr?hdr.sr:null;
  $('dur').textContent=dur!=null?fmtDur(dur):'—';
  $('sr').textContent=sr?sr.toLocaleString('en-US')+' Hz':'not detected';
  $('ch').textContent=(hdr&&hdr.ch)||decCh||'—';
  $('len').textContent=(sr&&dur!=null)?Math.round(sr*dur).toLocaleString('en-US'):'—';
  $('size').textContent=fmtSize(size);
  $('br').textContent=(dur&&dur>0)?Math.round(size*8/dur/1000)+' kbps':'—';
}
function loadFile(f){if(!f)return;if(!f.type.startsWith('audio/')&&!/\.(mp3|wav|ogg|m4a|aac|flac|opus|weba)$/i.test(f.name)){alert('Please choose an audio file.');return;}processFile(f);}
(function(){const drop=$('drop'),file=$('file');drop.addEventListener('click',()=>file.click());drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over');});drop.addEventListener('dragleave',()=>drop.classList.remove('over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');if(e.dataTransfer.files[0])loadFile(e.dataTransfer.files[0]);});file.addEventListener('change',()=>{if(file.files[0])loadFile(file.files[0]);});$('reset').addEventListener('click',()=>{$('editor').style.display='none';drop.style.display='';file.value='';});})();
window.loadAudioFile=loadFile;
