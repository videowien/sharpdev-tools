(function(){
  const CODES = [
    { c:100, n:'Continue', d:'Server received request headers, client should continue sending the body.',
      causes:['Client sent Expect: 100-continue header','Large request body being uploaded'],
      todo:['Continue sending the request body','No action usually needed — purely informational'] },
    { c:101, n:'Switching Protocols', d:'Server is switching to a different protocol as requested by the client.',
      causes:['WebSocket upgrade from HTTP','HTTP/2 negotiation','Upgrade header was sent'],
      todo:['Continue on the new protocol','Common for WebSockets — normal behavior'] },
    { c:102, n:'Processing', d:'Server received the request and is still processing it (WebDAV).',
      causes:['Long-running WebDAV operation','Server wants to prevent client timeout'],
      todo:['Keep the connection open','Wait for the final response'] },
    { c:103, n:'Early Hints', d:'Server is sending preliminary headers before the final response.',
      causes:['Server hints for preloading resources','Link headers sent for early browser optimization'],
      todo:['Browsers preload hinted resources','No action required'] },

    { c:200, n:'OK', d:'Standard successful HTTP response.',
      causes:['Request completed successfully','Resource returned as expected'],
      todo:['Nothing — everything worked','Parse and use the response body'] },
    { c:201, n:'Created', d:'Request succeeded and a new resource was created.',
      causes:['Successful POST that creates a resource','PUT creating a new item'],
      todo:['Read the Location header for the new resource URL','Process the returned entity'] },
    { c:202, n:'Accepted', d:'Request accepted but not yet processed (async).',
      causes:['Background job queued','Async processing pipeline'],
      todo:['Poll the status endpoint','Wait for async completion notification'] },
    { c:203, n:'Non-Authoritative Information', d:'Returned meta-information is from a third-party copy, not the origin.',
      causes:['Response modified by a proxy','Cached or transformed content'],
      todo:['Treat response as potentially modified','Usually safe to use'] },
    { c:204, n:'No Content', d:'Request succeeded but there is no body to return.',
      causes:['Successful DELETE','PUT that doesn\'t need to return the resource','Empty response by design'],
      todo:['Don\'t try to parse the body','Check status code only'] },
    { c:205, n:'Reset Content', d:'Client should reset the document view (e.g. clear a form).',
      causes:['Form submission that clears itself','Terminal-style reset'],
      todo:['Reset the UI/form','Don\'t reload the page'] },
    { c:206, n:'Partial Content', d:'Server is delivering part of the resource due to a Range header.',
      causes:['Resume interrupted download','Video/audio seeking','Byte-range request'],
      todo:['Read Content-Range header','Assemble parts as needed'] },
    { c:207, n:'Multi-Status', d:'Multiple status codes returned for batched WebDAV operations.',
      causes:['WebDAV batch operation','Multiple resources affected in one request'],
      todo:['Parse XML response body','Check per-resource status'] },
    { c:208, n:'Already Reported', d:'Members of a DAV binding were already enumerated.',
      causes:['WebDAV PROPFIND with recursion','Binding already reported in earlier response'],
      todo:['Ignore duplicate reporting','Typical WebDAV behavior'] },
    { c:226, n:'IM Used', d:'Server fulfilled a GET request using instance manipulations.',
      causes:['Delta encoding applied','HTTP instance manipulation'],
      todo:['Decode using the indicated IM','Rare — usually internal'] },

    { c:300, n:'Multiple Choices', d:'Multiple options exist for the resource. Choose one.',
      causes:['Content negotiation with ambiguity','Multiple language/format versions'],
      todo:['Pick a representation','Follow one of the provided links'] },
    { c:301, n:'Moved Permanently', d:'Resource has moved permanently to a new URL.',
      causes:['URL restructure','Domain migration','HTTPS redirect'],
      todo:['Update bookmarks and links','Follow the Location header','SEO: update internal links'] },
    { c:302, n:'Found', d:'Resource temporarily at a different URL.',
      causes:['Temporary redirect','Login flow redirect','A/B testing'],
      todo:['Follow the Location header','Don\'t update stored URLs'] },
    { c:303, n:'See Other', d:'Response can be found at another URL using GET.',
      causes:['POST/Redirect/GET pattern','Form submission followed by results page'],
      todo:['Issue a GET to the Location URL','Common after form submit'] },
    { c:304, n:'Not Modified', d:'Cached version is still valid. No body returned.',
      causes:['Conditional GET with If-None-Match or If-Modified-Since','ETag matched'],
      todo:['Serve the cached version','No need to re-download'] },
    { c:305, n:'Use Proxy', d:'Resource must be accessed through the specified proxy. Deprecated.',
      causes:['Legacy proxy requirement','Deprecated standard'],
      todo:['Don\'t rely on this — deprecated','Use modern proxy config instead'] },
    { c:307, n:'Temporary Redirect', d:'Temporary redirect preserving the HTTP method.',
      causes:['Temporary move where method matters','POST that redirects without becoming GET'],
      todo:['Repeat the same method at the new URL','Unlike 302, keep POST as POST'] },
    { c:308, n:'Permanent Redirect', d:'Permanent redirect preserving the HTTP method.',
      causes:['Permanent URL change','API endpoint renamed','HTTPS upgrade'],
      todo:['Update your URLs permanently','Method and body are preserved'] },

    { c:400, n:'Bad Request', d:'Server cannot process the request due to client error.',
      causes:['Malformed JSON or request body','Invalid query parameters','Missing required fields','Bad syntax'],
      todo:['Validate request format client-side','Check Content-Type header','Review API docs'] },
    { c:401, n:'Unauthorized', d:'Authentication is required or has failed.',
      causes:['Missing Authorization header','Expired token','Invalid credentials','Wrong auth scheme'],
      todo:['Log in again','Refresh the access token','Verify API key'] },
    { c:402, n:'Payment Required', d:'Reserved for future use. Sometimes used for paywalls or quotas.',
      causes:['Subscription expired','API quota exhausted','Paywall hit'],
      todo:['Upgrade subscription','Add payment method','Wait for quota reset'] },
    { c:403, n:'Forbidden', d:'Server understood the request but refuses to authorize it.',
      causes:['Insufficient permissions','IP blocked','CORS restrictions','Resource ownership mismatch'],
      todo:['Verify user permissions','Check firewall/WAF rules','Confirm CORS config'] },
    { c:404, n:'Not Found', d:'The requested resource does not exist.',
      causes:['Typo in URL','Resource was deleted','Wrong API version','Case-sensitivity mismatch'],
      todo:['Double-check the URL','Verify the resource ID','Check API version in path'] },
    { c:405, n:'Method Not Allowed', d:'Request method is not supported on this resource.',
      causes:['Using POST on a GET-only endpoint','DELETE blocked on read-only resource','Wrong HTTP verb'],
      todo:['Read the Allow response header','Check the API docs for allowed methods'] },
    { c:406, n:'Not Acceptable', d:'Server cannot produce a response matching the Accept headers.',
      causes:['Accept header too restrictive','Requested format not supported','Missing content variant'],
      todo:['Relax the Accept header','Request a supported media type'] },
    { c:407, n:'Proxy Authentication Required', d:'Client must authenticate with the proxy.',
      causes:['Corporate proxy auth missing','Proxy credentials expired'],
      todo:['Provide proxy credentials','Check Proxy-Authenticate header'] },
    { c:408, n:'Request Timeout', d:'Server timed out waiting for the request.',
      causes:['Slow network','Client took too long to send body','Idle connection'],
      todo:['Retry the request','Check network connectivity','Increase client upload speed'] },
    { c:409, n:'Conflict', d:'Request conflicts with the current server state.',
      causes:['Concurrent edits (stale version)','Duplicate unique field','Merge conflict'],
      todo:['Fetch latest state and retry','Use ETag/If-Match headers','Resolve conflict manually'] },
    { c:410, n:'Gone', d:'Resource is permanently gone and will not return.',
      causes:['Resource intentionally removed','Deprecated endpoint','Content deleted by user'],
      todo:['Don\'t retry','Remove the link','Update bookmarks'] },
    { c:411, n:'Length Required', d:'Content-Length header is required.',
      causes:['Missing Content-Length on request','Chunked encoding not supported by server'],
      todo:['Add Content-Length header','Compute body length first'] },
    { c:412, n:'Precondition Failed', d:'A precondition in the request headers was not met.',
      causes:['If-Match ETag mismatch','If-Unmodified-Since failed','Optimistic locking conflict'],
      todo:['Fetch current state','Retry with updated precondition'] },
    { c:413, n:'Payload Too Large', d:'Request body exceeds server limits.',
      causes:['File upload too big','Large JSON payload','Server max body size exceeded'],
      todo:['Compress or chunk the body','Increase server limits','Upload smaller files'] },
    { c:414, n:'URI Too Long', d:'Request URI is too long for the server to process.',
      causes:['GET with too many query params','Huge path segment','Base64 in URL'],
      todo:['Use POST with body instead','Shorten or split query params'] },
    { c:415, n:'Unsupported Media Type', d:'Server doesn\'t support the request\'s Content-Type.',
      causes:['Wrong Content-Type header','Server expects JSON but got form data','Binary format not accepted'],
      todo:['Set the correct Content-Type','Match API\'s expected format'] },
    { c:416, n:'Range Not Satisfiable', d:'Requested Range is outside the resource bounds.',
      causes:['Range header exceeds file size','Negative byte range','Invalid range syntax'],
      todo:['Omit the Range header','Request a valid byte range'] },
    { c:417, n:'Expectation Failed', d:'Server cannot meet the requirements of the Expect header.',
      causes:['Expect: 100-continue not supported','Unknown expectation value'],
      todo:['Remove the Expect header','Retry without expectations'] },
    { c:418, n:'I\'m a teapot', d:'Joke status from an April Fools RFC. Used by some APIs for rate-limiting or easter eggs.',
      causes:['Server is a teapot','Easter egg / joke endpoint','Some APIs use for specific errors'],
      todo:['Check the API docs','Probably not a real error'] },
    { c:421, n:'Misdirected Request', d:'Request was sent to a server that can\'t produce a response.',
      causes:['HTTP/2 connection reuse issue','Wrong virtual host','Certificate mismatch'],
      todo:['Retry on a new connection','Verify DNS/host mapping'] },
    { c:422, n:'Unprocessable Entity', d:'Request is well-formed but semantically invalid.',
      causes:['Validation errors','Missing required business-rule fields','Invalid email or date format'],
      todo:['Read the error details in body','Fix validation issues','Check field constraints'] },
    { c:423, n:'Locked', d:'Resource is locked (WebDAV).',
      causes:['Another client has a lock','WebDAV concurrency control'],
      todo:['Wait for the lock to release','Request a lock yourself'] },
    { c:424, n:'Failed Dependency', d:'Request failed because a previous request failed (WebDAV).',
      causes:['Batch dependency failed','Preceding operation failed'],
      todo:['Fix the dependent operation','Retry the chain'] },
    { c:425, n:'Too Early', d:'Server is unwilling to risk processing a replayed request.',
      causes:['TLS 0-RTT early data','Replay attack prevention'],
      todo:['Retry without early data','Wait for full handshake'] },
    { c:426, n:'Upgrade Required', d:'Client must upgrade to a different protocol.',
      causes:['Server requires HTTPS','TLS version too old','HTTP/2 required'],
      todo:['Upgrade to HTTPS','Use a newer TLS version','Check Upgrade header'] },
    { c:428, n:'Precondition Required', d:'Server requires a conditional request to prevent lost updates.',
      causes:['Missing If-Match for PUT','Server enforces optimistic locking'],
      todo:['Add If-Match with current ETag','Fetch resource first to get ETag'] },
    { c:429, n:'Too Many Requests', d:'Rate limit exceeded.',
      causes:['Too many requests per second','Quota exhausted','Burst limit hit'],
      todo:['Read Retry-After header','Back off exponentially','Implement request throttling'] },
    { c:431, n:'Request Header Fields Too Large', d:'Headers are too large for the server.',
      causes:['Huge cookie','Too many headers','Custom headers oversized'],
      todo:['Remove unused headers','Shorten cookies','Clear browser cookies'] },
    { c:451, n:'Unavailable For Legal Reasons', d:'Resource is blocked due to a legal demand.',
      causes:['Censorship','Court order','Regional content block','GDPR / copyright takedown'],
      todo:['Nothing technical — legal issue','Use VPN at your own risk','Contact the content owner'] },

    { c:500, n:'Internal Server Error', d:'Generic server error. Something went wrong on the server.',
      causes:['Unhandled exception','Null pointer / crash','Misconfiguration','Database error'],
      todo:['Check server logs','Retry the request','Report the issue if persistent'] },
    { c:501, n:'Not Implemented', d:'Server doesn\'t support the functionality required.',
      causes:['HTTP method not implemented','Feature not built yet','Unknown request type'],
      todo:['Use a supported method','Check API documentation'] },
    { c:502, n:'Bad Gateway', d:'Upstream server gave an invalid response.',
      causes:['Backend crashed','Gateway/proxy misconfigured','Upstream timed out','DNS issue'],
      todo:['Retry after a short wait','Check upstream health','Verify backend is running'] },
    { c:503, n:'Service Unavailable', d:'Server is temporarily unavailable.',
      causes:['Maintenance window','Overload','Deployment in progress','Circuit breaker open'],
      todo:['Read Retry-After header','Retry with exponential backoff','Check status page'] },
    { c:504, n:'Gateway Timeout', d:'Upstream server didn\'t respond in time.',
      causes:['Slow database query','Backend hang','Network latency','Lambda cold start'],
      todo:['Retry the request','Optimize slow backend queries','Increase gateway timeout'] },
    { c:505, n:'HTTP Version Not Supported', d:'Server doesn\'t support the HTTP version used.',
      causes:['Client using HTTP/0.9 or unsupported version','Legacy client'],
      todo:['Use HTTP/1.1 or newer','Update the HTTP client'] },
    { c:506, n:'Variant Also Negotiates', d:'Content negotiation configuration error on the server.',
      causes:['Misconfigured content negotiation','Circular variant reference'],
      todo:['Server-side fix required','Check server config'] },
    { c:507, n:'Insufficient Storage', d:'Server is out of space to store the representation (WebDAV).',
      causes:['Disk full','Quota exceeded','Allocation limit hit'],
      todo:['Free up server storage','Request a quota increase'] },
    { c:508, n:'Loop Detected', d:'Server detected an infinite loop while processing (WebDAV).',
      causes:['Circular WebDAV binding','Recursive redirect'],
      todo:['Fix the circular reference','Server-side issue'] },
    { c:510, n:'Not Extended', d:'Further extensions to the request are required.',
      causes:['Missing HTTP extension required by server','Rare'],
      todo:['Add the required extension','Consult server docs'] },
    { c:511, n:'Network Authentication Required', d:'Client must authenticate to gain network access (captive portal).',
      causes:['Captive portal on WiFi','Hotel or airport network','Network gateway auth'],
      todo:['Open a browser and log in','Accept terms of service'] },
  ];

  const grid = document.getElementById('grid');
  const search = document.getElementById('search');
  const pills = document.getElementById('pills');
  const counter = document.getElementById('counter');
  let activeClass = 'all';
  let query = '';
  let typedCode = '';
  let typedTimer = null;

  function classOf(code) { return Math.floor(code / 100); }
  function matches(entry) {
    if (activeClass !== 'all' && classOf(entry.c) !== parseInt(activeClass, 10)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return String(entry.c).includes(q) || entry.n.toLowerCase().includes(q) || entry.d.toLowerCase().includes(q);
  }
  function render() {
    let html = '';
    let shown = 0;
    for (const e of CODES) {
      if (!matches(e)) continue;
      shown++;
      const cls = 'c' + classOf(e.c);
      html += '<div class="code-card" id="code-' + e.c + '" data-code="' + e.c + '">' +
        '<div class="code-num ' + cls + '">' + e.c + '</div>' +
        '<div class="code-name">' + escapeHtml(e.n) + '</div>' +
        '<div class="code-desc">' + escapeHtml(e.d) + '</div>' +
        '<div class="code-details">' +
          '<h4>Common causes</h4><ul>' + e.causes.map(c => '<li>' + escapeHtml(c) + '</li>').join('') + '</ul>' +
          '<h4>What to do</h4><ul>' + e.todo.map(t => '<li>' + escapeHtml(t) + '</li>').join('') + '</ul>' +
        '</div></div>';
    }
    grid.innerHTML = html || '<div style="grid-column:1/-1;color:#666;text-align:center;padding:40px;">No matches.</div>';
    counter.textContent = shown + ' of ' + CODES.length + ' codes shown';
    grid.querySelectorAll('.code-card').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('expanded'));
    });
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  search.addEventListener('input', () => { query = search.value.trim(); render(); });
  pills.addEventListener('click', e => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    pills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    activeClass = btn.dataset.class;
    render();
  });

  function jumpTo(code) {
    const el = document.getElementById('code-' + code);
    if (!el) return;
    el.classList.add('expanded', 'target');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => el.classList.remove('target'), 1600);
  }

  // Hash sync
  function handleHash() {
    const h = (location.hash || '').replace('#', '');
    if (/^\d{3}$/.test(h)) jumpTo(h);
  }

  // Keyboard — type any 3-digit code
  document.addEventListener('keydown', e => {
    if (e.target === search) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^\d$/.test(e.key)) {
      typedCode += e.key;
      if (typedCode.length > 3) typedCode = typedCode.slice(-3);
      clearTimeout(typedTimer);
      typedTimer = setTimeout(() => { typedCode = ''; }, 1000);
      if (typedCode.length === 3) {
        if (CODES.some(c => c.c === parseInt(typedCode, 10))) {
          jumpTo(typedCode);
          location.hash = typedCode;
        }
        typedCode = '';
      }
    }
  });

  render();
  handleHash();
  window.addEventListener('hashchange', handleHash);
})();
