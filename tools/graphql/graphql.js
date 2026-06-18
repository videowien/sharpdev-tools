const $=id=>document.getElementById(id);
function fmt(src){
  src=src.replace(/#[^\n\r]*/g,'');
  var toks=src.match(/"{3}[\s\S]*?"{3}|"(?:\\.|[^"\\])*"|\.\.\.|[A-Za-z_][A-Za-z0-9_]*|[{}()\[\]:!=@$&|]|[-+]?[0-9][0-9.eE+-]*/g)||[];
  var lines=[],depth=0,buf='',paren=0;
  function flush(){var b=buf.trim();if(b)lines.push('  '.repeat(depth)+b);buf='';}
  for(var i=0;i<toks.length;i++){var t=toks[i];
    if(t==='{'){buf=buf.trim();buf+=(buf?' ':'')+'{';flush();depth++;continue;}
    if(t==='}'){flush();depth=Math.max(0,depth-1);lines.push('  '.repeat(depth)+'}');continue;}
    if(t==='('){paren++;buf+='(';continue;}
    if(t===')'){paren--;buf+=')';continue;}
    if(t===':'){buf=buf.replace(/\s+$/,'')+': ';continue;}
    if(t==='['||t===']'||t==='!'||t==='='||t==='@'||t==='$'||t==='&'||t==='|'){buf+=t;continue;}
    if(t==='...'){buf+=(buf&&!/[\s(]$/.test(buf)?' ':'')+'...';continue;}
    if(paren===0&&depth>=1){if(buf&&!/[:\s([@$&|=.]$/.test(buf)){flush();}}
    buf+=(buf&&!/[\s([:@$&|=.!]$/.test(buf)?' ':'')+t;
  }
  flush();
  return lines.join('\n').replace(/\(\s+/g,'(').replace(/\s+\)/g,')').trim();
}
function go(){try{$('out').value=fmt($('in').value);}catch(e){$('out').value='Error: '+e.message;}}
$('fmt').addEventListener('click',go);$('in').addEventListener('input',go);
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').value);});
go();