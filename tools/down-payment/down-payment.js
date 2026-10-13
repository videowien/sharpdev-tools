const $=id=>document.getElementById(id);
function fmt(n){return n.toLocaleString('en-US',{maximumFractionDigits:2});}
function go(){const price=parseFloat($('price').value)||0;const pct=parseFloat($('pct').value)||0;const down=price*pct/100;const loan=price-down;$('down').textContent=fmt(down);$('loan').textContent=fmt(loan);$('ltv').textContent=price?fmt(loan/price*100)+'%':'—';}
['price','pct'].forEach(id=>$(id).addEventListener('input',go));go();