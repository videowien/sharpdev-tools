const $=id=>document.getElementById(id);
function num(id){const v=$(id).value.trim();return v===''?null:parseFloat(v);}
function f(n){return Math.round(n*1e6)/1e6;}
function go(){const a=num('a'),b=num('b'),c=num('c'),d=num('d');
 const blanks=['a','b','c','d'].filter(id=>num(id)===null);
 if(blanks.length!==1){$('out').textContent=blanks.length===0?'Leave one box empty to solve':'Fill in exactly three boxes';return;}
 const k=blanks[0];let val,label;
 try{
  if(k==='a'){val=b*c/d;}else if(k==='b'){val=a*d/c;}else if(k==='c'){val=a*d/b;}else{val=b*c/a;}
 }catch(e){val=NaN;}
 if(!isFinite(val)){$('out').textContent='Cannot solve (division by zero)';return;}
 $('out').textContent=k+' = '+f(val);}
['a','b','c','d'].forEach(id=>$(id).addEventListener('input',go));go();