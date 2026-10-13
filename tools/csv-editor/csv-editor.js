const $=id=>document.getElementById(id);
function parseCSV(text){var rows=[],row=[],cur='',q=false;for(var i=0;i<text.length;i++){var c=text[i];if(q){if(c==='"'){if(text[i+1]==='"'){cur+='"';i++;}else q=false;}else cur+=c;}else{if(c==='"')q=true;else if(c===','){row.push(cur);cur='';}else if(c==='\n'){row.push(cur);rows.push(row);row=[];cur='';}else if(c==='\r'){}else cur+=c;}}if(cur!==''||row.length){row.push(cur);rows.push(row);}return rows;}
function toCSV(rows){return rows.map(function(r){return r.map(function(f){f=(f==null?'':String(f));if(/[",\n]/.test(f))f='"'+f.replace(/"/g,'""')+'"';return f;}).join(',');}).join('\n');}
function renderTable(rows){var cols=rows.reduce(function(m,r){return Math.max(m,r.length);},0);var html='<table class="csvt"><tbody>';rows.forEach(function(r){html+='<tr>';for(var c=0;c<cols;c++)html+='<td contenteditable="true">'+(r[c]!=null?r[c].replace(/&/g,'&amp;').replace(/</g,'&lt;'):'')+'</td>';html+='</tr>';});html+='</tbody></table>';$('wrap').innerHTML=html;}
function readTable(){var rows=[];Array.prototype.forEach.call($('wrap').querySelectorAll('tr'),function(tr){var r=[];Array.prototype.forEach.call(tr.querySelectorAll('td'),function(td){r.push(td.textContent);});rows.push(r);});return rows;}
$('load').addEventListener('click',function(){renderTable(parseCSV($('in').value));});
$('file').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){$('in').value=ev.target.result;renderTable(parseCSV(ev.target.result));};r.readAsText(f);});
$('addrow').addEventListener('click',function(){var rows=readTable();var cols=rows[0]?rows[0].length:1;var nr=[];for(var i=0;i<cols;i++)nr.push('');rows.push(nr);renderTable(rows);});
$('addcol').addEventListener('click',function(){var rows=readTable();rows.forEach(function(r){r.push('');});renderTable(rows);});
$('exp').addEventListener('click',function(){$('out').value=toCSV(readTable());});
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').value);});
renderTable(parseCSV($('in').value));