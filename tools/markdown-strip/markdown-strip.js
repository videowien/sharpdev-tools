const $=id=>document.getElementById(id);
function strip(md){
  return md
    .replace(/^---[\s\S]*?---\n/,'')
    .replace(/```[\s\S]*?```/g,m=>m.replace(/```[a-z]*\n?/g,''))
    .replace(/`([^`]+)`/g,'$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g,'$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1')
    .replace(/^#{1,6}\s+/gm,'')
    .replace(/^\s{0,3}>\s?/gm,'')
    .replace(/(\*\*\*|___)(.*?)\1/g,'$2')
    .replace(/(\*\*|__)(.*?)\1/g,'$2')
    .replace(/(\*|_)(.*?)\1/g,'$2')
    .replace(/~~(.*?)~~/g,'$1')
    .replace(/^\s*[-*+]\s+/gm,'')
    .replace(/^\s*\d+\.\s+/gm,'')
    .replace(/^\s*[-*_]{3,}\s*$/gm,'')
    .replace(/\|/g,' ')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}
function go(){$('out').textContent=$('in').value?strip($('in').value):'';}
$('in').addEventListener('input',go);
$('copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText($('out').textContent);});
go();