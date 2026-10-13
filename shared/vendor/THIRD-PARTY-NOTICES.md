# Third-party code in this folder

These libraries are included unmodified as distributed (`jsqr.js` unminified, `qrcode-generator.min.js` minified by
jsDelivr from qrcode.js 1.4.4, `gif.worker.js` from cdnjs, SRI-checked) and keep their own licenses. The rest of SharpDev.tools is © Gillian Scharf,
all rights reserved.

| File | Library | Authors | License |
|---|---|---|---|
| `jsqr.js` | [jsQR](https://github.com/cozmo/jsQR) 1.4.0 (`dist/jsQR.js`) | Cosmo Wolfe | Apache License 2.0, see `LICENSE-Apache-2.0.txt` |
| `bcrypt.min.js` | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) 2.4.3 (`dist/bcrypt.min.js`) | Nevins Bartolomeo, Shane Girish, Daniel Wirtz; isaac.js by Yves-Marie K. Rinquin | BSD-3-Clause (bcrypt.js) and MIT (isaac.js), text below |
| `qrcode-generator.min.js` | [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) 1.4.4 | Kazuhiko Arase | MIT, text below |
| `gif.worker.js` | [gif.js](https://github.com/jnordberg/gif.js) 0.2.0 (`dist/gif.worker.js`; web workers must be same-origin) | Johan Nordberg | MIT, text below |
| `libheif/libheif-bundle-1.19.8.min.js` | [libheif-js](https://github.com/catdad-experiments/libheif-js/tree/1.19.8) 1.19.8 (`libheif-wasm/libheif-bundle.js`, renamed): Emscripten build of [libheif](https://github.com/strukturag/libheif/tree/v1.19.8) 1.19.8 with [libde265](https://github.com/strukturag/libde265) statically linked | Kiril Vatev (libheif-js); struktur AG (libheif, libde265) | GNU LGPL 3.0, see `libheif/LICENSE` |

Libraries loaded with `<script>` tags from cdnjs.cloudflare.com (pdf-lib, jsPDF, html2canvas, JSZip and others)
are not part of this repository and carry a Subresource Integrity hash. pdf.js (loaded with `import()`) and the
Tesseract OCR worker, core and language data (from jsDelivr) are loaded dynamically. All of them keep their
own licenses.

## BSD-3-Clause and MIT (bcryptjs 2.4.3, upstream LICENSE)

```
bcrypt.js
---------
Copyright (c) 2012 Nevins Bartolomeo <nevins.bartolomeo@gmail.com>
Copyright (c) 2012 Shane Girish <shaneGirish@gmail.com>
Copyright (c) 2014 Daniel Wirtz <dcode@dcode.io>
 
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. The name of the author may not be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

isaac.js
--------
Copyright (c) 2012 Yves-Marie K. Rinquin

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## MIT License (qrcode-generator)

Copyright (c) 2009 Kazuhiko Arase

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## MIT License (gif.js)

Copyright (c) 2013-2018 Johan Nordberg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
