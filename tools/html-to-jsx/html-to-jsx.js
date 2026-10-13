const inEl=document.getElementById('in'),outEl=document.getElementById('out');
const VOID=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const RENAME={'class':'className','for':'htmlFor','tabindex':'tabIndex','readonly':'readOnly','maxlength':'maxLength','colspan':'colSpan','rowspan':'rowSpan','contenteditable':'contentEditable','crossorigin':'crossOrigin','autocomplete':'autoComplete','autofocus':'autoFocus','enctype':'encType','novalidate':'noValidate','srcset':'srcSet'};
function camel(s){return s.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());}
function attrName(n){if(RENAME[n])return RENAME[n];if(n.startsWith('data-')||n.startsWith('aria-'))return n;if(n.startsWith('on'))return n.toLowerCase().replace(/^on(.)/,(m,c)=>'on'+c.toUpperCase());return camel(n);}
function styleObj(s){const o=s.split(';').map(d=>d.trim()).filter(Boolean).map(d=>{const i=d.indexOf(':');const k=camel(d.slice(0,i).trim());const v=d.slice(i+1).trim();return JSON.stringify(k)+': '+JSON.stringify(v);});return '{{'+o.join(', ')+'}}';}
function conv(node,ind){
  const pad='  '.repeat(ind);
  if(node.nodeType===3){const t=node.textContent;return t.trim()?pad+t.trim()+'\n':'';}
  if(node.nodeType===8)return pad+'{/* '+node.textContent.trim()+' */}\n';
  if(node.nodeType!==1)return '';
  const tag=node.tagName.toLowerCase();
  let attrs='';
  for(const a of node.attributes){
    let name=attrName(a.name),val=a.value;
    if(name==='style'){attrs+=' style='+styleObj(val);continue;}
    attrs+=' '+name+'='+JSON.stringify(val);
  }
  const kids=[...node.childNodes];
  if(VOID.has(tag)||!kids.length){
    if(!kids.length&&!VOID.has(tag))return pad+'<'+tag+attrs+'></'+tag+'>\n';
    return pad+'<'+tag+attrs+' />\n';
  }
  let inner='';for(const k of kids)inner+=conv(k,ind+1);
  return pad+'<'+tag+attrs+'>\n'+inner+pad+'</'+tag+'>\n';
}
function go(){
  if(!inEl.value.trim()){outEl.textContent='';return;}
  const doc=new DOMParser().parseFromString(inEl.value,'text/html');
  let out='';for(const k of doc.body.childNodes)out+=conv(k,0);
  outEl.textContent=out.trim()||'(no elements)';
}
inEl.addEventListener('input',go);
document.getElementById('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(outEl.textContent);});
go();