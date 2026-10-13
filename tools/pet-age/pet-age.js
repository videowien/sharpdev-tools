const $=id=>document.getElementById(id);
function human(age,type,size){if(age<=0)return 0;if(age<=1)return Math.round(15*age);if(age<=2)return Math.round(15+9*(age-1));const per=type==='cat'?4:(size==='small'?4.5:size==='large'?6:5);return Math.round(24+(age-2)*per);}
function go(){const age=parseFloat($('age').value)||0;const type=$('type').value;$('sizeWrap').style.display=type==='dog'?'':'none';$('out').textContent=human(age,type,$('size').value);}
['age','type','size'].forEach(id=>{$(id).addEventListener('input',go);$(id).addEventListener('change',go);});
go();