const $=id=>document.getElementById(id);
function build(){var p=[];
if($('nolist').checked)p.push('# Disable directory listing\nOptions -Indexes\n');
if($('index').checked)p.push('# Default file\nDirectoryIndex index.html\n');
if($('https').checked||$('www').checked){var r=['RewriteEngine On'];if($('https').checked){r.push('RewriteCond %{HTTPS} off');r.push('RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]');}if($('www').checked){r.push('RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]');r.push('RewriteRule ^(.*)$ https://%1/$1 [R=301,L]');}p.push('# Redirects\n'+r.join('\n')+'\n');}
if($('gzip').checked)p.push('# Gzip compression\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml\n</IfModule>\n');
if($('cache').checked)p.push('# Browser caching\n<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/jpeg "access plus 1 year"\n  ExpiresByType image/png "access plus 1 year"\n  ExpiresByType image/svg+xml "access plus 1 year"\n  ExpiresByType text/css "access plus 1 month"\n  ExpiresByType application/javascript "access plus 1 month"\n</IfModule>\n');
if($('hotlink').checked)p.push('# Block image hotlinking\nRewriteEngine On\nRewriteCond %{HTTP_REFERER} !^$\nRewriteCond %{HTTP_REFERER} !^https?://(www\\.)?%{HTTP_HOST} [NC]\nRewriteRule \\.(jpg|jpeg|png|gif|svg|webp)$ - [F,NC]\n');
if($('e404').checked)p.push('# Custom error page\nErrorDocument 404 /404.html\n');
$('out').value=p.join('\n').trim()||'# Select options above to generate rules';}
Array.prototype.forEach.call(document.querySelectorAll('#opts input'),function(el){el.addEventListener('change',build);});
$('copy').addEventListener('click',function(){navigator.clipboard.writeText($('out').value);});
build();