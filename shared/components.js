/* SharpDev — Shared Header & Footer (v4.1 — bug-report) */

// Tip jar URL — change here to update across the whole site.
const SD_TIP_URL = 'https://buymeacoffee.com/sharpdev.tools';

const SD_CATEGORIES = [
  {
    name: 'Text',
    tools: [
      { id: 'wordcount',     name: 'Word Count',         path: '/tools/wordcount/' },
      { id: 'case',          name: 'Case Converter',     path: '/tools/case/' },
      { id: 'lorem',         name: 'Lorem Ipsum',        path: '/tools/lorem/' },
      { id: 'diff',          name: 'Text Diff',          path: '/tools/diff/' },
      { id: 'lines',         name: 'Line Sorter',        path: '/tools/lines/' },
      { id: 'chars',         name: 'Character Counter',  path: '/tools/chars/' },
      { id: 'slug',          name: 'Slug Generator',     path: '/tools/slug/' },
      { id: 'markdown',      name: 'Markdown Preview',   path: '/tools/markdown/' },
      { id: 'whitespace',    name: 'Whitespace Cleaner', path: '/tools/whitespace/' },
      { id: 'md-html',       name: 'Markdown \u2194 HTML', path: '/tools/md-html/' },
      { id: 'reading-level', name: 'Reading Level',      path: '/tools/reading-level/' },
      { id: 'string-utils',  name: 'String Utilities',   path: '/tools/string-utils/' },
      { id: 'md-table',      name: 'Markdown Table',     path: '/tools/md-table/' },
      { id: 'unicode-text',  name: 'Unicode Text',       path: '/tools/unicode-text/' },
      { id: 'reverse',       name: 'Text Reverser',      path: '/tools/reverse/' },
      { id: 'find-replace',  name: 'Find & Replace',     path: '/tools/find-replace/' },
      { id: 'html-strip',    name: 'HTML → Plain Text',  path: '/tools/html-strip/' },
      { id: 'keyword-density', name: 'Keyword Density', path: '/tools/keyword-density/' },
      { id: 'wpm',           name: 'WPM Typing Test',    path: '/tools/wpm/' },
      { id: 'flip-text', name: 'Upside Down Text', path: '/tools/flip-text/' },
      { id: 'text-repeat', name: 'Text Repeater', path: '/tools/text-repeat/' },
      { id: 'markdown-strip', name: 'Markdown Stripper', path: '/tools/markdown-strip/' },
      { id: 'bacon-ipsum', name: 'Bacon Ipsum', path: '/tools/bacon-ipsum/' },
      { id: 'remove-line-breaks', name: 'Remove Line Breaks', path: '/tools/remove-line-breaks/' },
      { id: 'add-line-numbers', name: 'Add Line Numbers', path: '/tools/add-line-numbers/' },
      { id: 'remove-duplicate-words', name: 'Remove Duplicate Words', path: '/tools/remove-duplicate-words/' },
      { id: 'extract-emails', name: 'Email Extractor', path: '/tools/extract-emails/' },
      { id: 'extract-urls', name: 'URL Extractor', path: '/tools/extract-urls/' },
      { id: 'remove-emojis', name: 'Remove Emojis', path: '/tools/remove-emojis/' },
      { id: 'pig-latin', name: 'Pig Latin Translator', path: '/tools/pig-latin/' },
      { id: 'leetspeak', name: 'Leetspeak Translator', path: '/tools/leetspeak/' },
      { id: 'palindrome-checker', name: 'Palindrome Checker', path: '/tools/palindrome-checker/' },
      { id: 'count-occurrences', name: 'Count Occurrences', path: '/tools/count-occurrences/' },
      { id: 'remove-accents', name: 'Remove Accents', path: '/tools/remove-accents/' },
      { id: 'zalgo', name: 'Zalgo Text', path: '/tools/zalgo/' },
      { id: 'invisible-text', name: 'Invisible Text', path: '/tools/invisible-text/' },
    ]
  },
  {
    name: 'YouTube',
    tools: [
      { id: 'thumbnail',       name: 'YouTube Thumbnails',  path: '/tools/thumbnail/' },
      { id: 'subtitles',       name: 'YouTube Subtitles',   path: '/tools/subtitles/' },
      { id: 'yt-tags',         name: 'YouTube Tags',        path: '/tools/yt-tags/' },
      { id: 'yt-clean',        name: 'YouTube URL Cleaner', path: '/tools/yt-clean/' },
      { id: 'yt-embed',        name: 'Embed Code',          path: '/tools/yt-embed/' },
      { id: 'yt-chapters',     name: 'Chapters Generator',  path: '/tools/yt-chapters/' },
      { id: 'yt-title',        name: 'Title Counter',       path: '/tools/yt-title/' },
      { id: 'yt-description',  name: 'Description Counter', path: '/tools/yt-description/' },
      { id: 'yt-money',        name: 'Revenue Estimator',   path: '/tools/yt-money/' },
    ]
  },
  {
    name: 'Twitter',
    tools: [
      { id: 'twitter-count',  name: 'Twitter / X Counter', path: '/tools/twitter-count/' },
      { id: 'twitter-thread', name: 'Thread Builder',      path: '/tools/twitter-thread/' },
      { id: 'twitter-image',  name: 'Tweet to Image',      path: '/tools/twitter-image/' },
      { id: 'twitter-clean',  name: 'URL Cleaner',         path: '/tools/twitter-clean/' },
      { id: 'twitter-bio',    name: 'Bio Counter',         path: '/tools/twitter-bio/' },
      { id: 'twitter-banner', name: 'Banner Sizer',        path: '/tools/twitter-banner/' },
      { id: 'twitter-poll',   name: 'Poll Composer',       path: '/tools/twitter-poll/' },
    ]
  },

  {
    name: 'LinkedIn',
    tools: [
      { id: 'linkedin-count',      name: 'LinkedIn Counter',   path: '/tools/linkedin-count/' },
      { id: 'linkedin-headline',   name: 'Headline Counter',   path: '/tools/linkedin-headline/' },
      { id: 'linkedin-about',      name: 'About Counter',      path: '/tools/linkedin-about/' },
      { id: 'linkedin-pdf',        name: 'Carousel PDF',       path: '/tools/linkedin-pdf/' },
      { id: 'linkedin-clean',      name: 'URL Cleaner',        path: '/tools/linkedin-clean/' },
      { id: 'linkedin-banner',     name: 'Banner Sizer',       path: '/tools/linkedin-banner/' },
      { id: 'linkedin-comment',    name: 'Comment Counter',    path: '/tools/linkedin-comment/' },
      { id: 'linkedin-newsletter', name: 'Newsletter Counter', path: '/tools/linkedin-newsletter/' },
      { id: 'linkedin-poll',       name: 'Poll Composer',      path: '/tools/linkedin-poll/' },
    ]
  },
  {
    name: 'Instagram',
    tools: [
      { id: 'ig-count',        name: 'Caption Counter',   path: '/tools/ig-count/' },
      { id: 'ig-bio',          name: 'Bio Line Breaks',   path: '/tools/ig-bio/' },
      { id: 'ig-carousel',     name: 'Carousel Splitter', path: '/tools/ig-carousel/' },
      { id: 'ig-highlight',    name: 'Highlight Cover',   path: '/tools/ig-highlight/' },
      { id: 'ig-engagement',   name: 'Engagement Rate',   path: '/tools/ig-engagement/' },
      { id: 'ig-pfp',          name: 'Profile Pic Crop',  path: '/tools/ig-pfp/' },
      { id: 'ig-grid',         name: 'Grid Preview',      path: '/tools/ig-grid/' },
      { id: 'ig-reels-cover',  name: 'Reels Cover Sizer', path: '/tools/ig-reels-cover/' },
      { id: 'ig-hashtag-mix',  name: 'Hashtag Mix',       path: '/tools/ig-hashtag-mix/' },
    ]
  },
  {
    name: 'Social Media',
    tools: [
      { id: 'hashtag',             name: 'Hashtag Generator',  path: '/tools/hashtag/' },
      { id: 'emoji',               name: 'Emoji Finder',       path: '/tools/emoji/' },
      { id: 'bio',                 name: 'Bio Builder',        path: '/tools/bio/' },
      { id: 'meta-tags',           name: 'OG / Meta Tags',     path: '/tools/meta-tags/' },
      { id: 'signature',           name: 'Email Signature',    path: '/tools/signature/' },
      { id: 'utm',                 name: 'UTM Builder',        path: '/tools/utm/' },
      { id: 'mention-extractor',   name: 'Mention Extractor',  path: '/tools/mention-extractor/' },
      { id: 'char-counter-multi',  name: 'Multi-Platform Counter', path: '/tools/char-counter-multi/' },
      { id: 'handle-checker',      name: 'Handle Checker',     path: '/tools/handle-checker/' },
    ]
  },
  {
    name: 'Images & Media',
    tools: [
      { id: 'image',         name: 'Image Compressor',  path: '/tools/image/' },
      { id: 'image-dl',      name: 'Image Downloader',  path: '/tools/image-dl/' },
      { id: 'image-base64',  name: 'Image \u2192 Base64',    path: '/tools/image-base64/' },
      { id: 'image-convert', name: 'Format Converter',  path: '/tools/image-convert/' },
      { id: 'image-color',   name: 'Color Picker',      path: '/tools/image-color/' },
      { id: 'image-rotate',  name: 'Rotate & Flip',     path: '/tools/image-rotate/' },
      { id: 'image-crop',    name: 'Crop',              path: '/tools/image-crop/' },
      { id: 'heic-jpg',      name: 'HEIC → JPG',       path: '/tools/heic-jpg/' },
      { id: 'ocr',           name: 'Image → Text (OCR)', path: '/tools/ocr/' },
      { id: 'pixelate',      name: 'Pixelate / Blur',   path: '/tools/pixelate/' },
      { id: 'photo-collage', name: 'Photo Collage',     path: '/tools/photo-collage/' },
      { id: 'color-from-image', name: 'Palette from Image', path: '/tools/color-from-image/' },
      { id: 'gif-maker',     name: 'GIF Maker',         path: '/tools/gif-maker/' },
      { id: 'exif',          name: 'EXIF Viewer',       path: '/tools/exif/' },
      { id: 'favicon',       name: 'Favicon',           path: '/tools/favicon/' },
      { id: 'image-resize', name: "Image Resizer", path: '/tools/image-resize/' },
      { id: 'image-watermark', name: "Image Watermark", path: '/tools/image-watermark/' },
      { id: 'avatar-crop', name: "Avatar Crop", path: '/tools/avatar-crop/' },
      { id: 'image-ascii', name: "Image to ASCII", path: '/tools/image-ascii/' },
      { id: 'meme', name: "Meme Generator", path: '/tools/meme/' },
      { id: 'audio-trim', name: "Audio Trimmer", path: '/tools/audio-trim/' },
    ]
  },
  {
    name: 'PDF',
    tools: [
      { id: 'pdf-text',         name: 'PDF to Text',       path: '/tools/pdf-text/' },
      { id: 'pdf-to-image',     name: 'PDF to JPG / PNG',  path: '/tools/pdf-to-image/' },
      { id: 'image-to-pdf',     name: 'Image to PDF',      path: '/tools/image-to-pdf/' },
      { id: 'pdf-merge',        name: 'Merge PDF',         path: '/tools/pdf-merge/' },
      { id: 'pdf-split',        name: 'Split PDF',         path: '/tools/pdf-split/' },
      { id: 'pdf-rotate',       name: 'Rotate PDF',        path: '/tools/pdf-rotate/' },
      { id: 'pdf-delete-pages', name: 'Delete Pages',      path: '/tools/pdf-delete-pages/' },
      { id: 'pdf-numbers',      name: 'Page Numbering',    path: '/tools/pdf-numbers/' },
      { id: 'pdf-watermark',    name: 'Watermark',         path: '/tools/pdf-watermark/' },
      { id: 'md-to-pdf',        name: 'Markdown to PDF',   path: '/tools/md-to-pdf/' },
      { id: 'html-to-pdf',      name: 'HTML to PDF',       path: '/tools/html-to-pdf/' },
      { id: 'word-to-pdf',      name: 'Word to PDF',       path: '/tools/word-to-pdf/' },
      { id: 'pdf-metadata',     name: 'Metadata Editor',   path: '/tools/pdf-metadata/' },
      { id: 'pdf-crop',         name: 'Crop PDF',          path: '/tools/pdf-crop/' },
      { id: 'pdf-reorder',      name: 'Reorder Pages',     path: '/tools/pdf-reorder/' },
      { id: 'pdf-insert',       name: 'Insert Pages',      path: '/tools/pdf-insert/' },
      { id: 'pdf-sign',         name: 'Sign PDF',          path: '/tools/pdf-sign/' },
      { id: 'pdf-compress',     name: 'Compress PDF',      path: '/tools/pdf-compress/' },
      { id: 'pdf-flatten',      name: 'Flatten Forms',     path: '/tools/pdf-flatten/' },
      { id: 'pdf-fill',         name: 'Form Fill',         path: '/tools/pdf-fill/' },
      { id: 'pdf-ocr',          name: 'OCR (Searchable)',  path: '/tools/pdf-ocr/' },
      { id: 'pdf-redact',       name: 'Redact',            path: '/tools/pdf-redact/' },
      { id: 'pdf-resize',       name: 'Page Size',         path: '/tools/pdf-resize/' },
      { id: 'pdf-to-md',        name: 'PDF to Markdown',   path: '/tools/pdf-to-md/' },
      { id: 'pdf-to-html',      name: 'PDF to HTML',       path: '/tools/pdf-to-html/' },
      { id: 'pdf-to-word',      name: 'PDF to Word',       path: '/tools/pdf-to-word/' },
    ]
  },
  {
    name: 'Design & CSS',
    tools: [
      { id: 'colors',        name: 'Color Palette',      path: '/tools/colors/' },
      { id: 'color-convert', name: 'Color Converter',    path: '/tools/color-convert/' },
      { id: 'contrast',      name: 'WCAG Contrast',      path: '/tools/contrast/' },
      { id: 'gradient',      name: 'Gradient Generator', path: '/tools/gradient/' },
      { id: 'shadow',        name: 'Box Shadow',         path: '/tools/shadow/' },
      { id: 'text-shadow',   name: 'Text Shadow',        path: '/tools/text-shadow/' },
      { id: 'css-filter',    name: 'CSS Filter',         path: '/tools/css-filter/' },
      { id: 'glass',         name: 'Glassmorphism',      path: '/tools/glass/' },
      { id: 'radius',        name: 'Border Radius',      path: '/tools/radius/' },
      { id: 'clip-path',     name: 'Clip-path',          path: '/tools/clip-path/' },
      { id: 'css-gen',       name: 'CSS Generator',      path: '/tools/css-gen/' },
      { id: 'css-anim',      name: 'CSS Animation',      path: '/tools/css-anim/' },
      { id: 'css-flexbox',   name: 'Flexbox Generator',  path: '/tools/css-flexbox/' },
      { id: 'css-grid',      name: 'Grid Generator',     path: '/tools/css-grid/' },
      { id: 'color-mixer', name: 'Color Mixer', path: '/tools/color-mixer/' },
      { id: 'css-triangle', name: 'CSS Triangle', path: '/tools/css-triangle/' },
      { id: 'cubic-bezier', name: 'Cubic Bezier', path: '/tools/cubic-bezier/' },
      { id: 'neumorphism', name: 'Neumorphism', path: '/tools/neumorphism/' },
      { id: 'px-rem', name: 'PX to REM', path: '/tools/px-rem/' },
      { id: 'color-blind', name: 'Color Blind Sim', path: '/tools/color-blind/' },
      { id: 'color-name', name: 'Color Name Finder', path: '/tools/color-name/' },
      { id: 'css-button', name: "CSS Button", path: '/tools/css-button/' },
      { id: 'css-spinner', name: "CSS Spinner", path: '/tools/css-spinner/' },
      { id: 'css-scrollbar', name: "CSS Scrollbar", path: '/tools/css-scrollbar/' },
      { id: 'text-gradient', name: "Gradient Text", path: '/tools/text-gradient/' },
      { id: 'css-specificity', name: "CSS Specificity", path: '/tools/css-specificity/' },
      { id: 'color-palette', name: "Color Palette", path: '/tools/color-palette/' },
    ]
  },
  {
    name: 'Calculators',
    tools: [
      { id: 'meeting-cost', name: 'Meeting Cost',    path: '/tools/meeting-cost/' },
      { id: 'aspect',       name: 'Aspect Ratio',    path: '/tools/aspect/' },
      { id: 'convert',      name: 'Unit Converter',  path: '/tools/convert/' },
      { id: 'base',         name: 'Number Base',     path: '/tools/base/' },
      { id: 'bmi',          name: 'BMI / Body',      path: '/tools/bmi/' },
      { id: 'roman',        name: 'Roman Numerals',  path: '/tools/roman/' },
      { id: 'percent',      name: 'Percentage',      path: '/tools/percent/' },
      { id: 'random',       name: 'Random Number',   path: '/tools/random/' },
      { id: 'temperature',  name: 'Temperature',     path: '/tools/temperature/' },
      { id: 'num-words',    name: 'Number to Words', path: '/tools/num-words/' },
      { id: 'tdee',         name: 'TDEE / BMR',      path: '/tools/tdee/' },
      { id: 'pregnancy',    name: 'Due Date',        path: '/tools/pregnancy/' },
      { id: 'pace',         name: 'Running Pace',    path: '/tools/pace/' },
      { id: 'cooking',      name: 'Cooking Converter', path: '/tools/cooking/' },
      { id: 'sleep',        name: 'Sleep Cycles',    path: '/tools/sleep/' },
      { id: 'gpa',          name: 'GPA',             path: '/tools/gpa/' },
      { id: 'mpg',          name: 'Gas Mileage / MPG', path: '/tools/mpg/' },
      { id: 'recipe-scaler', name: 'Recipe Scaler',  path: '/tools/recipe-scaler/' },
      { id: 'average', name: 'Average Calculator', path: '/tools/average/' },
      { id: 'hours-calculator', name: 'Hours Calculator', path: '/tools/hours-calculator/' },
      { id: 'fraction', name: 'Fraction Calculator', path: '/tools/fraction/' },
      { id: 'ratio', name: 'Ratio Calculator', path: '/tools/ratio/' },
      { id: 'scientific-notation', name: 'Scientific Notation', path: '/tools/scientific-notation/' },
      { id: 'circle-calculator', name: 'Circle Calculator', path: '/tools/circle-calculator/' },
      { id: 'triangle-calculator', name: 'Triangle Calculator', path: '/tools/triangle-calculator/' },
      { id: 'pythagorean', name: 'Pythagorean Theorem', path: '/tools/pythagorean/' },
      { id: 'gcd-lcm', name: 'GCD & LCM', path: '/tools/gcd-lcm/' },
      { id: 'prime-checker', name: 'Prime Checker', path: '/tools/prime-checker/' },
      { id: 'standard-deviation', name: 'Standard Deviation', path: '/tools/standard-deviation/' },
      { id: 'combinations', name: 'Combinations (nCr/nPr)', path: '/tools/combinations/' },
      { id: 'unit-price', name: 'Unit Price Calculator', path: '/tools/unit-price/' },
      { id: 'slope', name: 'Slope Calculator', path: '/tools/slope/' },
      { id: 'quadratic', name: 'Quadratic Solver', path: '/tools/quadratic/' },
      { id: 'tally-counter', name: 'Tally Counter', path: '/tools/tally-counter/' },
      { id: 'fibonacci', name: 'Fibonacci Generator', path: '/tools/fibonacci/' },
      { id: 'prime-factors', name: 'Prime Factorization', path: '/tools/prime-factors/' },
      { id: 'factorial', name: 'Factorial Calculator', path: '/tools/factorial/' },
      { id: 'simple-interest', name: 'Simple Interest', path: '/tools/simple-interest/' },
      { id: 'ohms-law', name: "Ohm's Law", path: '/tools/ohms-law/' },
    ]
  },
  {
    name: 'Converters',
    tools: [
      { id: 'cm-to-inches', name: 'Centimeters to Inches', path: '/tools/cm-to-inches/' },
      { id: 'inches-to-cm', name: 'Inches to Centimeters', path: '/tools/inches-to-cm/' },
      { id: 'mm-to-inches', name: 'Millimeters to Inches', path: '/tools/mm-to-inches/' },
      { id: 'inches-to-mm', name: 'Inches to Millimeters', path: '/tools/inches-to-mm/' },
      { id: 'feet-to-meters', name: 'Feet to Meters', path: '/tools/feet-to-meters/' },
      { id: 'meters-to-feet', name: 'Meters to Feet', path: '/tools/meters-to-feet/' },
      { id: 'km-to-miles', name: 'Kilometers to Miles', path: '/tools/km-to-miles/' },
      { id: 'miles-to-km', name: 'Miles to Kilometers', path: '/tools/miles-to-km/' },
      { id: 'cm-to-feet', name: 'Centimeters to Feet', path: '/tools/cm-to-feet/' },
      { id: 'feet-to-cm', name: 'Feet to Centimeters', path: '/tools/feet-to-cm/' },
      { id: 'meters-to-yards', name: 'Meters to Yards', path: '/tools/meters-to-yards/' },
      { id: 'yards-to-meters', name: 'Yards to Meters', path: '/tools/yards-to-meters/' },
      { id: 'kg-to-lbs', name: 'Kilograms to Pounds', path: '/tools/kg-to-lbs/' },
      { id: 'lbs-to-kg', name: 'Pounds to Kilograms', path: '/tools/lbs-to-kg/' },
      { id: 'grams-to-ounces', name: 'Grams to Ounces', path: '/tools/grams-to-ounces/' },
      { id: 'ounces-to-grams', name: 'Ounces to Grams', path: '/tools/ounces-to-grams/' },
      { id: 'kg-to-stone', name: 'Kilograms to Stone', path: '/tools/kg-to-stone/' },
      { id: 'stone-to-kg', name: 'Stone to Kilograms', path: '/tools/stone-to-kg/' },
      { id: 'lbs-to-ounces', name: 'Pounds to Ounces', path: '/tools/lbs-to-ounces/' },
      { id: 'ounces-to-lbs', name: 'Ounces to Pounds', path: '/tools/ounces-to-lbs/' },
      { id: 'liters-to-gallons', name: 'Liters to US gallons', path: '/tools/liters-to-gallons/' },
      { id: 'gallons-to-liters', name: 'US gallons to Liters', path: '/tools/gallons-to-liters/' },
      { id: 'ml-to-cups', name: 'Milliliters to US cups', path: '/tools/ml-to-cups/' },
      { id: 'cups-to-ml', name: 'US cups to Milliliters', path: '/tools/cups-to-ml/' },
      { id: 'mph-to-kmh', name: 'Miles per hour to Kilometers per hour', path: '/tools/mph-to-kmh/' },
      { id: 'kmh-to-mph', name: 'Kilometers per hour to Miles per hour', path: '/tools/kmh-to-mph/' },
      { id: 'mb-to-gb', name: 'Megabytes to Gigabytes', path: '/tools/mb-to-gb/' },
      { id: 'gb-to-mb', name: 'Gigabytes to Megabytes', path: '/tools/gb-to-mb/' },
      { id: 'kb-to-mb', name: 'Kilobytes to Megabytes', path: '/tools/kb-to-mb/' },
      { id: 'mb-to-kb', name: 'Megabytes to Kilobytes', path: '/tools/mb-to-kb/' },
      { id: 'celsius-to-fahrenheit', name: 'Celsius to Fahrenheit', path: '/tools/celsius-to-fahrenheit/' },
      { id: 'fahrenheit-to-celsius', name: 'Fahrenheit to Celsius', path: '/tools/fahrenheit-to-celsius/' },
      { id: 'celsius-to-kelvin', name: 'Celsius to Kelvin', path: '/tools/celsius-to-kelvin/' },
      { id: 'kelvin-to-celsius', name: 'Kelvin to Celsius', path: '/tools/kelvin-to-celsius/' },
      { id: 'mm-to-cm', name: 'Millimeters to Centimeters', path: '/tools/mm-to-cm/' },
      { id: 'cm-to-mm', name: 'Centimeters to Millimeters', path: '/tools/cm-to-mm/' },
      { id: 'km-to-feet', name: 'Kilometers to Feet', path: '/tools/km-to-feet/' },
      { id: 'feet-to-km', name: 'Feet to Kilometers', path: '/tools/feet-to-km/' },
      { id: 'miles-to-yards', name: 'Miles to Yards', path: '/tools/miles-to-yards/' },
      { id: 'yards-to-miles', name: 'Yards to Miles', path: '/tools/yards-to-miles/' },
      { id: 'yards-to-feet', name: 'Yards to Feet', path: '/tools/yards-to-feet/' },
      { id: 'feet-to-yards', name: 'Feet to Yards', path: '/tools/feet-to-yards/' },
      { id: 'miles-to-feet', name: 'Miles to Feet', path: '/tools/miles-to-feet/' },
      { id: 'feet-to-miles', name: 'Feet to Miles', path: '/tools/feet-to-miles/' },
      { id: 'milligrams-to-grams', name: 'Milligrams to Grams', path: '/tools/milligrams-to-grams/' },
      { id: 'grams-to-milligrams', name: 'Grams to Milligrams', path: '/tools/grams-to-milligrams/' },
      { id: 'tonnes-to-kg', name: 'Tonnes to Kilograms', path: '/tools/tonnes-to-kg/' },
      { id: 'kg-to-tonnes', name: 'Kilograms to Tonnes', path: '/tools/kg-to-tonnes/' },
      { id: 'grams-to-lbs', name: 'Grams to Pounds', path: '/tools/grams-to-lbs/' },
      { id: 'lbs-to-grams', name: 'Pounds to Grams', path: '/tools/lbs-to-grams/' },
      { id: 'ounces-to-kg', name: 'Ounces to Kilograms', path: '/tools/ounces-to-kg/' },
      { id: 'kg-to-ounces', name: 'Kilograms to Ounces', path: '/tools/kg-to-ounces/' },
      { id: 'tablespoons-to-ml', name: 'Tablespoons to Milliliters', path: '/tools/tablespoons-to-ml/' },
      { id: 'ml-to-tablespoons', name: 'Milliliters to Tablespoons', path: '/tools/ml-to-tablespoons/' },
      { id: 'teaspoons-to-ml', name: 'Teaspoons to Milliliters', path: '/tools/teaspoons-to-ml/' },
      { id: 'ml-to-teaspoons', name: 'Milliliters to Teaspoons', path: '/tools/ml-to-teaspoons/' },
      { id: 'pints-to-ml', name: 'US pints to Milliliters', path: '/tools/pints-to-ml/' },
      { id: 'ml-to-pints', name: 'Milliliters to US pints', path: '/tools/ml-to-pints/' },
      { id: 'quarts-to-liters', name: 'US quarts to Liters', path: '/tools/quarts-to-liters/' },
      { id: 'liters-to-quarts', name: 'Liters to US quarts', path: '/tools/liters-to-quarts/' },
      { id: 'fluid-ounces-to-ml', name: 'US fluid ounces to Milliliters', path: '/tools/fluid-ounces-to-ml/' },
      { id: 'ml-to-fluid-ounces', name: 'Milliliters to US fluid ounces', path: '/tools/ml-to-fluid-ounces/' },
      { id: 'knots-to-kmh', name: 'Knots to Kilometers per hour', path: '/tools/knots-to-kmh/' },
      { id: 'kmh-to-knots', name: 'Kilometers per hour to Knots', path: '/tools/kmh-to-knots/' },
      { id: 'knots-to-mph', name: 'Knots to Miles per hour', path: '/tools/knots-to-mph/' },
      { id: 'mph-to-knots', name: 'Miles per hour to Knots', path: '/tools/mph-to-knots/' },
      { id: 'meters-per-second-to-kmh', name: 'Meters per second to Kilometers per hour', path: '/tools/meters-per-second-to-kmh/' },
      { id: 'kmh-to-meters-per-second', name: 'Kilometers per hour to Meters per second', path: '/tools/kmh-to-meters-per-second/' },
      { id: 'feet-per-second-to-mph', name: 'Feet per second to Miles per hour', path: '/tools/feet-per-second-to-mph/' },
      { id: 'mph-to-feet-per-second', name: 'Miles per hour to Feet per second', path: '/tools/mph-to-feet-per-second/' },
      { id: 'gb-to-tb', name: 'Gigabytes to Terabytes', path: '/tools/gb-to-tb/' },
      { id: 'tb-to-gb', name: 'Terabytes to Gigabytes', path: '/tools/tb-to-gb/' },
      { id: 'bytes-to-kb', name: 'Bytes to Kilobytes', path: '/tools/bytes-to-kb/' },
      { id: 'kb-to-bytes', name: 'Kilobytes to Bytes', path: '/tools/kb-to-bytes/' },
      { id: 'bits-to-bytes', name: 'Bits to Bytes', path: '/tools/bits-to-bytes/' },
      { id: 'bytes-to-bits', name: 'Bytes to Bits', path: '/tools/bytes-to-bits/' },
      { id: 'square-meters-to-square-feet', name: 'Square meters to Square feet', path: '/tools/square-meters-to-square-feet/' },
      { id: 'square-feet-to-square-meters', name: 'Square feet to Square meters', path: '/tools/square-feet-to-square-meters/' },
      { id: 'acres-to-hectares', name: 'Acres to Hectares', path: '/tools/acres-to-hectares/' },
      { id: 'hectares-to-acres', name: 'Hectares to Acres', path: '/tools/hectares-to-acres/' },
      { id: 'square-kilometers-to-square-miles', name: 'Square kilometers to Square miles', path: '/tools/square-kilometers-to-square-miles/' },
      { id: 'square-miles-to-square-kilometers', name: 'Square miles to Square kilometers', path: '/tools/square-miles-to-square-kilometers/' },
      { id: 'square-feet-to-square-yards', name: 'Square feet to Square yards', path: '/tools/square-feet-to-square-yards/' },
      { id: 'square-yards-to-square-feet', name: 'Square yards to Square feet', path: '/tools/square-yards-to-square-feet/' },
      { id: 'bar-to-psi', name: 'Bar to Psi', path: '/tools/bar-to-psi/' },
      { id: 'psi-to-bar', name: 'Psi to Bar', path: '/tools/psi-to-bar/' },
      { id: 'psi-to-kilopascals', name: 'Psi to Kilopascals', path: '/tools/psi-to-kilopascals/' },
      { id: 'kilopascals-to-psi', name: 'Kilopascals to Psi', path: '/tools/kilopascals-to-psi/' },
      { id: 'atmospheres-to-bar', name: 'Atmospheres to Bar', path: '/tools/atmospheres-to-bar/' },
      { id: 'bar-to-atmospheres', name: 'Bar to Atmospheres', path: '/tools/bar-to-atmospheres/' },
      { id: 'kilocalories-to-kilojoules', name: 'Kilocalories to Kilojoules', path: '/tools/kilocalories-to-kilojoules/' },
      { id: 'kilojoules-to-kilocalories', name: 'Kilojoules to Kilocalories', path: '/tools/kilojoules-to-kilocalories/' },
      { id: 'calories-to-joules', name: 'Calories to Joules', path: '/tools/calories-to-joules/' },
      { id: 'joules-to-calories', name: 'Joules to Calories', path: '/tools/joules-to-calories/' },
      { id: 'degrees-to-radians', name: 'Degrees to Radians', path: '/tools/degrees-to-radians/' },
      { id: 'radians-to-degrees', name: 'Radians to Degrees', path: '/tools/radians-to-degrees/' },
      { id: 'horsepower-to-kilowatts', name: 'Horsepower to Kilowatts', path: '/tools/horsepower-to-kilowatts/' },
      { id: 'kilowatts-to-horsepower', name: 'Kilowatts to Horsepower', path: '/tools/kilowatts-to-horsepower/' },
      { id: 'meters-to-cm', name: 'Meters to Centimeters', path: '/tools/meters-to-cm/' },
      { id: 'cm-to-meters', name: 'Centimeters to Meters', path: '/tools/cm-to-meters/' },
      { id: 'meters-to-inches', name: 'Meters to Inches', path: '/tools/meters-to-inches/' },
      { id: 'inches-to-meters', name: 'Inches to Meters', path: '/tools/inches-to-meters/' },
      { id: 'inches-to-yards', name: 'Inches to Yards', path: '/tools/inches-to-yards/' },
      { id: 'yards-to-inches', name: 'Yards to Inches', path: '/tools/yards-to-inches/' },
      { id: 'grams-to-kg', name: 'Grams to Kilograms', path: '/tools/grams-to-kg/' },
      { id: 'kg-to-grams', name: 'Kilograms to Grams', path: '/tools/kg-to-grams/' },
      { id: 'lbs-to-stone', name: 'Pounds to Stone', path: '/tools/lbs-to-stone/' },
      { id: 'stone-to-lbs', name: 'Stone to Pounds', path: '/tools/stone-to-lbs/' },
      { id: 'cups-to-tablespoons', name: 'US cups to Tablespoons', path: '/tools/cups-to-tablespoons/' },
      { id: 'tablespoons-to-cups', name: 'Tablespoons to US cups', path: '/tools/tablespoons-to-cups/' },
      { id: 'tablespoons-to-teaspoons', name: 'Tablespoons to Teaspoons', path: '/tools/tablespoons-to-teaspoons/' },
      { id: 'teaspoons-to-tablespoons', name: 'Teaspoons to Tablespoons', path: '/tools/teaspoons-to-tablespoons/' },
      { id: 'gallons-to-cups', name: 'US gallons to US cups', path: '/tools/gallons-to-cups/' },
      { id: 'cups-to-gallons', name: 'US cups to US gallons', path: '/tools/cups-to-gallons/' },
      { id: 'quarts-to-cups', name: 'US quarts to US cups', path: '/tools/quarts-to-cups/' },
      { id: 'cups-to-quarts', name: 'US cups to US quarts', path: '/tools/cups-to-quarts/' },
      { id: 'pints-to-cups', name: 'US pints to US cups', path: '/tools/pints-to-cups/' },
      { id: 'cups-to-pints', name: 'US cups to US pints', path: '/tools/cups-to-pints/' },
      { id: 'liters-to-ml', name: 'Liters to Milliliters', path: '/tools/liters-to-ml/' },
      { id: 'ml-to-liters', name: 'Milliliters to Liters', path: '/tools/ml-to-liters/' },
      { id: 'kb-to-gb', name: 'Kilobytes to Gigabytes', path: '/tools/kb-to-gb/' },
      { id: 'gb-to-kb', name: 'Gigabytes to Kilobytes', path: '/tools/gb-to-kb/' },
      { id: 'mb-to-tb', name: 'Megabytes to Terabytes', path: '/tools/mb-to-tb/' },
      { id: 'tb-to-mb', name: 'Terabytes to Megabytes', path: '/tools/tb-to-mb/' },
      { id: 'square-meters-to-acres', name: 'Square meters to Acres', path: '/tools/square-meters-to-acres/' },
      { id: 'acres-to-square-meters', name: 'Acres to Square meters', path: '/tools/acres-to-square-meters/' },
      { id: 'square-yards-to-square-meters', name: 'Square yards to Square meters', path: '/tools/square-yards-to-square-meters/' },
      { id: 'square-meters-to-square-yards', name: 'Square meters to Square yards', path: '/tools/square-meters-to-square-yards/' },
      { id: 'kilowatt-hours-to-watt-hours', name: 'Kilowatt-hours to Watt-hours', path: '/tools/kilowatt-hours-to-watt-hours/' },
      { id: 'watt-hours-to-kilowatt-hours', name: 'Watt-hours to Kilowatt-hours', path: '/tools/watt-hours-to-kilowatt-hours/' },
      { id: 'kilocalories-to-calories', name: 'Kilocalories to Calories', path: '/tools/kilocalories-to-calories/' },
      { id: 'calories-to-kilocalories', name: 'Calories to Kilocalories', path: '/tools/calories-to-kilocalories/' },
      { id: 'atmospheres-to-psi', name: 'Atmospheres to Psi', path: '/tools/atmospheres-to-psi/' },
      { id: 'psi-to-atmospheres', name: 'Psi to Atmospheres', path: '/tools/psi-to-atmospheres/' },
      { id: 'horsepower-to-watts', name: 'Horsepower to Watts', path: '/tools/horsepower-to-watts/' },
      { id: 'watts-to-horsepower', name: 'Watts to Horsepower', path: '/tools/watts-to-horsepower/' },
      { id: 'seconds-to-minutes', name: 'Seconds to Minutes', path: '/tools/seconds-to-minutes/' },
      { id: 'minutes-to-seconds', name: 'Minutes to Seconds', path: '/tools/minutes-to-seconds/' },
      { id: 'minutes-to-hours', name: 'Minutes to Hours', path: '/tools/minutes-to-hours/' },
      { id: 'hours-to-minutes', name: 'Hours to Minutes', path: '/tools/hours-to-minutes/' },
      { id: 'hours-to-days', name: 'Hours to Days', path: '/tools/hours-to-days/' },
      { id: 'days-to-hours', name: 'Days to Hours', path: '/tools/days-to-hours/' },
      { id: 'days-to-weeks', name: 'Days to Weeks', path: '/tools/days-to-weeks/' },
      { id: 'weeks-to-days', name: 'Weeks to Days', path: '/tools/weeks-to-days/' },
      { id: 'milliseconds-to-seconds', name: 'Milliseconds to Seconds', path: '/tools/milliseconds-to-seconds/' },
      { id: 'seconds-to-milliseconds', name: 'Seconds to Milliseconds', path: '/tools/seconds-to-milliseconds/' },
      { id: 'megahertz-to-gigahertz', name: 'Megahertz to Gigahertz', path: '/tools/megahertz-to-gigahertz/' },
      { id: 'gigahertz-to-megahertz', name: 'Gigahertz to Megahertz', path: '/tools/gigahertz-to-megahertz/' },
      { id: 'kilohertz-to-megahertz', name: 'Kilohertz to Megahertz', path: '/tools/kilohertz-to-megahertz/' },
      { id: 'megahertz-to-kilohertz', name: 'Megahertz to Kilohertz', path: '/tools/megahertz-to-kilohertz/' },
      { id: 'hertz-to-kilohertz', name: 'Hertz to Kilohertz', path: '/tools/hertz-to-kilohertz/' },
      { id: 'kilohertz-to-hertz', name: 'Kilohertz to Hertz', path: '/tools/kilohertz-to-hertz/' },
      { id: 'mbps-to-mb-per-second', name: 'Megabits per second to Megabytes per second', path: '/tools/mbps-to-mb-per-second/' },
      { id: 'mb-per-second-to-mbps', name: 'Megabytes per second to Megabits per second', path: '/tools/mb-per-second-to-mbps/' },
      { id: 'gbps-to-mbps', name: 'Gigabits per second to Megabits per second', path: '/tools/gbps-to-mbps/' },
      { id: 'mbps-to-gbps', name: 'Megabits per second to Gigabits per second', path: '/tools/mbps-to-gbps/' },
      { id: 'mbps-to-kbps', name: 'Megabits per second to Kilobits per second', path: '/tools/mbps-to-kbps/' },
      { id: 'kbps-to-mbps', name: 'Kilobits per second to Megabits per second', path: '/tools/kbps-to-mbps/' },
      { id: 'newton-metres-to-foot-pounds', name: 'Newton metres to Foot-pounds', path: '/tools/newton-metres-to-foot-pounds/' },
      { id: 'foot-pounds-to-newton-metres', name: 'Foot-pounds to Newton metres', path: '/tools/foot-pounds-to-newton-metres/' },
      { id: 'newton-metres-to-inch-pounds', name: 'Newton metres to Inch-pounds', path: '/tools/newton-metres-to-inch-pounds/' },
      { id: 'inch-pounds-to-newton-metres', name: 'Inch-pounds to Newton metres', path: '/tools/inch-pounds-to-newton-metres/' },
      { id: 'foot-pounds-to-inch-pounds', name: 'Foot-pounds to Inch-pounds', path: '/tools/foot-pounds-to-inch-pounds/' },
      { id: 'inch-pounds-to-foot-pounds', name: 'Inch-pounds to Foot-pounds', path: '/tools/inch-pounds-to-foot-pounds/' },
      { id: 'newtons-to-pounds-force', name: 'Newtons to Pounds-force', path: '/tools/newtons-to-pounds-force/' },
      { id: 'pounds-force-to-newtons', name: 'Pounds-force to Newtons', path: '/tools/pounds-force-to-newtons/' },
      { id: 'kilograms-force-to-newtons', name: 'Kilograms-force to Newtons', path: '/tools/kilograms-force-to-newtons/' },
      { id: 'newtons-to-kilograms-force', name: 'Newtons to Kilograms-force', path: '/tools/newtons-to-kilograms-force/' },
      { id: 'kilonewtons-to-newtons', name: 'Kilonewtons to Newtons', path: '/tools/kilonewtons-to-newtons/' },
      { id: 'newtons-to-kilonewtons', name: 'Newtons to Kilonewtons', path: '/tools/newtons-to-kilonewtons/' },
      { id: 'gallons-to-quarts', name: 'US gallons to US quarts', path: '/tools/gallons-to-quarts/' },
      { id: 'quarts-to-gallons', name: 'US quarts to US gallons', path: '/tools/quarts-to-gallons/' },
      { id: 'gallons-to-pints', name: 'US gallons to US pints', path: '/tools/gallons-to-pints/' },
      { id: 'pints-to-gallons', name: 'US pints to US gallons', path: '/tools/pints-to-gallons/' },
      { id: 'quarts-to-pints', name: 'US quarts to US pints', path: '/tools/quarts-to-pints/' },
      { id: 'pints-to-quarts', name: 'US pints to US quarts', path: '/tools/pints-to-quarts/' },
      { id: 'cups-to-fluid-ounces', name: 'US cups to US fluid ounces', path: '/tools/cups-to-fluid-ounces/' },
      { id: 'fluid-ounces-to-cups', name: 'US fluid ounces to US cups', path: '/tools/fluid-ounces-to-cups/' },
      { id: 'gallons-to-fluid-ounces', name: 'US gallons to US fluid ounces', path: '/tools/gallons-to-fluid-ounces/' },
      { id: 'fluid-ounces-to-gallons', name: 'US fluid ounces to US gallons', path: '/tools/fluid-ounces-to-gallons/' },
      { id: 'feet-to-inches', name: 'Feet to Inches', path: '/tools/feet-to-inches/' },
      { id: 'inches-to-feet', name: 'Inches to Feet', path: '/tools/inches-to-feet/' },
      { id: 'meters-to-mm', name: 'Meters to Millimeters', path: '/tools/meters-to-mm/' },
      { id: 'mm-to-meters', name: 'Millimeters to Meters', path: '/tools/mm-to-meters/' },
      { id: 'acres-to-square-feet', name: 'Acres to Square feet', path: '/tools/acres-to-square-feet/' },
      { id: 'square-feet-to-acres', name: 'Square feet to Acres', path: '/tools/square-feet-to-acres/' },
      { id: 'mmhg-to-kilopascals', name: 'Millimeters of mercury to Kilopascals', path: '/tools/mmhg-to-kilopascals/' },
      { id: 'kilopascals-to-mmhg', name: 'Kilopascals to Millimeters of mercury', path: '/tools/kilopascals-to-mmhg/' },
      { id: 'mmhg-to-psi', name: 'Millimeters of mercury to Psi', path: '/tools/mmhg-to-psi/' },
      { id: 'psi-to-mmhg', name: 'Psi to Millimeters of mercury', path: '/tools/psi-to-mmhg/' },
      { id: 'joules-to-kilojoules', name: 'Joules to Kilojoules', path: '/tools/joules-to-kilojoules/' },
      { id: 'kilojoules-to-joules', name: 'Kilojoules to Joules', path: '/tools/kilojoules-to-joules/' },
      { id: 'degrees-to-gradians', name: 'Degrees to Gradians', path: '/tools/degrees-to-gradians/' },
      { id: 'gradians-to-degrees', name: 'Gradians to Degrees', path: '/tools/gradians-to-degrees/' },
      { id: 'seconds-to-hours', name: 'Seconds to Hours', path: '/tools/seconds-to-hours/' },
      { id: 'hours-to-seconds', name: 'Hours to Seconds', path: '/tools/hours-to-seconds/' },
      { id: 'fahrenheit-to-kelvin', name: 'Fahrenheit to Kelvin', path: '/tools/fahrenheit-to-kelvin/' },
      { id: 'kelvin-to-fahrenheit', name: 'Kelvin to Fahrenheit', path: '/tools/kelvin-to-fahrenheit/' },
      { id: 'rpm-to-hertz', name: 'Revolutions per minute to Hertz', path: '/tools/rpm-to-hertz/' },
      { id: 'hertz-to-rpm', name: 'Hertz to Revolutions per minute', path: '/tools/hertz-to-rpm/' },
      { id: 'carats-to-grams', name: 'Carats to Grams', path: '/tools/carats-to-grams/' },
      { id: 'grams-to-carats', name: 'Grams to Carats', path: '/tools/grams-to-carats/' },
      { id: 'short-tons-to-kg', name: 'Short tons to Kilograms', path: '/tools/short-tons-to-kg/' },
      { id: 'kg-to-short-tons', name: 'Kilograms to Short tons', path: '/tools/kg-to-short-tons/' },
      { id: 'short-tons-to-lbs', name: 'Short tons to Pounds', path: '/tools/short-tons-to-lbs/' },
      { id: 'lbs-to-short-tons', name: 'Pounds to Short tons', path: '/tools/lbs-to-short-tons/' },
      { id: 'kg-to-milligrams', name: 'Kilograms to Milligrams', path: '/tools/kg-to-milligrams/' },
      { id: 'milligrams-to-kg', name: 'Milligrams to Kilograms', path: '/tools/milligrams-to-kg/' },
      { id: 'btu-to-kilojoules', name: 'BTU to Kilojoules', path: '/tools/btu-to-kilojoules/' },
      { id: 'kilojoules-to-btu', name: 'Kilojoules to BTU', path: '/tools/kilojoules-to-btu/' },
      { id: 'btu-to-watt-hours', name: 'BTU to Watt-hours', path: '/tools/btu-to-watt-hours/' },
      { id: 'watt-hours-to-btu', name: 'Watt-hours to BTU', path: '/tools/watt-hours-to-btu/' },
      { id: 'tb-to-pb', name: 'Terabytes to Petabytes', path: '/tools/tb-to-pb/' },
      { id: 'pb-to-tb', name: 'Petabytes to Terabytes', path: '/tools/pb-to-tb/' },
      { id: 'bytes-to-mb', name: 'Bytes to Megabytes', path: '/tools/bytes-to-mb/' },
      { id: 'mb-to-bytes', name: 'Megabytes to Bytes', path: '/tools/mb-to-bytes/' },
      { id: 'bytes-to-gb', name: 'Bytes to Gigabytes', path: '/tools/bytes-to-gb/' },
      { id: 'gb-to-bytes', name: 'Gigabytes to Bytes', path: '/tools/gb-to-bytes/' },
      { id: 'kilowatts-to-watts', name: 'Kilowatts to Watts', path: '/tools/kilowatts-to-watts/' },
      { id: 'watts-to-kilowatts', name: 'Watts to Kilowatts', path: '/tools/watts-to-kilowatts/' },
      { id: 'megawatts-to-kilowatts', name: 'Megawatts to Kilowatts', path: '/tools/megawatts-to-kilowatts/' },
      { id: 'kilowatts-to-megawatts', name: 'Kilowatts to Megawatts', path: '/tools/kilowatts-to-megawatts/' },
      { id: 'square-feet-to-square-inches', name: 'Square feet to Square inches', path: '/tools/square-feet-to-square-inches/' },
      { id: 'square-inches-to-square-feet', name: 'Square inches to Square feet', path: '/tools/square-inches-to-square-feet/' },
      { id: 'square-meters-to-square-centimeters', name: 'Square meters to Square centimeters', path: '/tools/square-meters-to-square-centimeters/' },
      { id: 'square-centimeters-to-square-meters', name: 'Square centimeters to Square meters', path: '/tools/square-centimeters-to-square-meters/' },
      { id: 'meters-per-second-to-mph', name: 'Meters per second to Miles per hour', path: '/tools/meters-per-second-to-mph/' },
      { id: 'mph-to-meters-per-second', name: 'Miles per hour to Meters per second', path: '/tools/mph-to-meters-per-second/' },
      { id: 'feet-per-second-to-meters-per-second', name: 'Feet per second to Meters per second', path: '/tools/feet-per-second-to-meters-per-second/' },
      { id: 'meters-per-second-to-feet-per-second', name: 'Meters per second to Feet per second', path: '/tools/meters-per-second-to-feet-per-second/' },
      { id: 'knots-to-meters-per-second', name: 'Knots to Meters per second', path: '/tools/knots-to-meters-per-second/' },
      { id: 'meters-per-second-to-knots', name: 'Meters per second to Knots', path: '/tools/meters-per-second-to-knots/' },
      { id: 'psi-to-pascals', name: 'Psi to Pascals', path: '/tools/psi-to-pascals/' },
      { id: 'pascals-to-psi', name: 'Pascals to Psi', path: '/tools/pascals-to-psi/' },
      { id: 'nautical-miles-to-km', name: 'Nautical miles to Kilometers', path: '/tools/nautical-miles-to-km/' },
      { id: 'km-to-nautical-miles', name: 'Kilometers to Nautical miles', path: '/tools/km-to-nautical-miles/' },
      { id: 'nautical-miles-to-miles', name: 'Nautical miles to Miles', path: '/tools/nautical-miles-to-miles/' },
      { id: 'miles-to-nautical-miles', name: 'Miles to Nautical miles', path: '/tools/miles-to-nautical-miles/' },
      { id: 'pints-to-liters', name: 'US pints to Liters', path: '/tools/pints-to-liters/' },
      { id: 'liters-to-pints', name: 'Liters to US pints', path: '/tools/liters-to-pints/' },
      { id: 'fluid-ounces-to-liters', name: 'US fluid ounces to Liters', path: '/tools/fluid-ounces-to-liters/' },
      { id: 'liters-to-fluid-ounces', name: 'Liters to US fluid ounces', path: '/tools/liters-to-fluid-ounces/' },
      { id: 'liters-to-cups', name: 'Liters to US cups', path: '/tools/liters-to-cups/' },
      { id: 'cups-to-liters', name: 'US cups to Liters', path: '/tools/cups-to-liters/' },
      { id: 'gallons-to-ml', name: 'US gallons to Milliliters', path: '/tools/gallons-to-ml/' },
      { id: 'ml-to-gallons', name: 'Milliliters to US gallons', path: '/tools/ml-to-gallons/' },
      { id: 'quarts-to-ml', name: 'US quarts to Milliliters', path: '/tools/quarts-to-ml/' },
      { id: 'ml-to-quarts', name: 'Milliliters to US quarts', path: '/tools/ml-to-quarts/' },
      { id: 'square-miles-to-acres', name: 'Square miles to Acres', path: '/tools/square-miles-to-acres/' },
      { id: 'acres-to-square-miles', name: 'Acres to Square miles', path: '/tools/acres-to-square-miles/' },
      { id: 'acres-to-square-yards', name: 'Acres to Square yards', path: '/tools/acres-to-square-yards/' },
      { id: 'square-yards-to-acres', name: 'Square yards to Acres', path: '/tools/square-yards-to-acres/' },
      { id: 'square-kilometers-to-hectares', name: 'Square kilometers to Hectares', path: '/tools/square-kilometers-to-hectares/' },
      { id: 'hectares-to-square-kilometers', name: 'Hectares to Square kilometers', path: '/tools/hectares-to-square-kilometers/' },
      { id: 'square-meters-to-square-kilometers', name: 'Square meters to Square kilometers', path: '/tools/square-meters-to-square-kilometers/' },
      { id: 'square-kilometers-to-square-meters', name: 'Square kilometers to Square meters', path: '/tools/square-kilometers-to-square-meters/' },
      { id: 'pascals-to-kilopascals', name: 'Pascals to Kilopascals', path: '/tools/pascals-to-kilopascals/' },
      { id: 'kilopascals-to-pascals', name: 'Kilopascals to Pascals', path: '/tools/kilopascals-to-pascals/' },
      { id: 'mmhg-to-atmospheres', name: 'Millimeters of mercury to Atmospheres', path: '/tools/mmhg-to-atmospheres/' },
      { id: 'atmospheres-to-mmhg', name: 'Atmospheres to Millimeters of mercury', path: '/tools/atmospheres-to-mmhg/' },
      { id: 'btu-to-kilowatt-hours', name: 'BTU to Kilowatt-hours', path: '/tools/btu-to-kilowatt-hours/' },
      { id: 'kilowatt-hours-to-btu', name: 'Kilowatt-hours to BTU', path: '/tools/kilowatt-hours-to-btu/' },
      { id: 'seconds-to-days', name: 'Seconds to Days', path: '/tools/seconds-to-days/' },
      { id: 'days-to-seconds', name: 'Days to Seconds', path: '/tools/days-to-seconds/' },
      { id: 'hours-to-weeks', name: 'Hours to Weeks', path: '/tools/hours-to-weeks/' },
      { id: 'weeks-to-hours', name: 'Weeks to Hours', path: '/tools/weeks-to-hours/' },
      { id: 'tonnes-to-lbs', name: 'Tonnes to Pounds', path: '/tools/tonnes-to-lbs/' },
      { id: 'lbs-to-tonnes', name: 'Pounds to Tonnes', path: '/tools/lbs-to-tonnes/' },
      { id: 'carats-to-milligrams', name: 'Carats to Milligrams', path: '/tools/carats-to-milligrams/' },
      { id: 'milligrams-to-carats', name: 'Milligrams to Carats', path: '/tools/milligrams-to-carats/' },
      { id: 'knots-to-feet-per-second', name: 'Knots to Feet per second', path: '/tools/knots-to-feet-per-second/' },
      { id: 'feet-per-second-to-knots', name: 'Feet per second to Knots', path: '/tools/feet-per-second-to-knots/' },
      { id: 'radians-to-gradians', name: 'Radians to Gradians', path: '/tools/radians-to-gradians/' },
      { id: 'gradians-to-radians', name: 'Gradians to Radians', path: '/tools/gradians-to-radians/' },
      { id: 'pounds-force-to-kilograms-force', name: 'Pounds-force to Kilograms-force', path: '/tools/pounds-force-to-kilograms-force/' },
      { id: 'kilograms-force-to-pounds-force', name: 'Kilograms-force to Pounds-force', path: '/tools/kilograms-force-to-pounds-force/' },
      { id: 'gbps-to-mb-per-second', name: 'Gigabits per second to Megabytes per second', path: '/tools/gbps-to-mb-per-second/' },
      { id: 'mb-per-second-to-gbps', name: 'Megabytes per second to Gigabits per second', path: '/tools/mb-per-second-to-gbps/' },
      { id: 'miles-to-meters', name: 'Miles to Meters', path: '/tools/miles-to-meters/' },
      { id: 'meters-to-miles', name: 'Meters to Miles', path: '/tools/meters-to-miles/' },
      { id: 'gb-to-pb', name: 'Gigabytes to Petabytes', path: '/tools/gb-to-pb/' },
      { id: 'pb-to-gb', name: 'Petabytes to Gigabytes', path: '/tools/pb-to-gb/' },
      { id: 'g-per-cm3-to-kg-per-m3', name: 'Grams per cubic centimetre to Kilograms per cubic metre', path: '/tools/g-per-cm3-to-kg-per-m3/' },
      { id: 'kg-per-m3-to-g-per-cm3', name: 'Kilograms per cubic metre to Grams per cubic centimetre', path: '/tools/kg-per-m3-to-g-per-cm3/' },
      { id: 'g-per-cm3-to-lb-per-ft3', name: 'Grams per cubic centimetre to Pounds per cubic foot', path: '/tools/g-per-cm3-to-lb-per-ft3/' },
      { id: 'lb-per-ft3-to-g-per-cm3', name: 'Pounds per cubic foot to Grams per cubic centimetre', path: '/tools/lb-per-ft3-to-g-per-cm3/' },
      { id: 'foot-candles-to-lux', name: 'Foot-candles to Lux', path: '/tools/foot-candles-to-lux/' },
      { id: 'lux-to-foot-candles', name: 'Lux to Foot-candles', path: '/tools/lux-to-foot-candles/' },
    ]
  },
  {
    name: 'Time & Date',
    tools: [
      { id: 'age',           name: 'Age & Date Diff',  path: '/tools/age/' },
      { id: 'timer',         name: 'Timer & Pomodoro', path: '/tools/timer/' },
      { id: 'timestamp',     name: 'Timestamp',        path: '/tools/timestamp/' },
      { id: 'cron',          name: 'Cron Explainer',   path: '/tools/cron/' },
      { id: 'timezone',      name: 'Time Zones',       path: '/tools/timezone/' },
      { id: 'working-days',  name: 'Working Days',     path: '/tools/working-days/' },
      { id: 'day-of-year',   name: 'Day of Year',      path: '/tools/day-of-year/' },
      { id: 'countdown',     name: 'Countdown',        path: '/tools/countdown/' },
      { id: 'date-format',   name: 'Date Format',      path: '/tools/date-format/' },
      { id: 'add-days',      name: 'Add Days',         path: '/tools/add-days/' },
      { id: 'sunrise',       name: 'Sunrise / Sunset', path: '/tools/sunrise/' },
      { id: 'moon',          name: 'Moon Phase',       path: '/tools/moon/' },
      { id: 'time-duration', name: 'Time Duration', path: '/tools/time-duration/' },
      { id: 'leap-year', name: 'Leap Year Checker', path: '/tools/leap-year/' },
      { id: 'day-of-week', name: 'Day of the Week', path: '/tools/day-of-week/' },
      { id: 'week-number', name: 'Week Number', path: '/tools/week-number/' },
      { id: 'zodiac', name: 'Zodiac Sign', path: '/tools/zodiac/' },
      { id: 'chinese-zodiac', name: 'Chinese Zodiac', path: '/tools/chinese-zodiac/' },
      { id: 'pet-age', name: 'Pet Age Calculator', path: '/tools/pet-age/' },
      { id: 'calendar', name: "Printable Calendar", path: '/tools/calendar/' },
    ]
  },
  {
    name: 'Money & Finance',
    tools: [
      { id: 'tip',           name: 'Tip Calculator',    path: '/tools/tip/' },
      { id: 'loan',          name: 'Mortgage / Loan',   path: '/tools/loan/' },
      { id: 'salary',        name: 'Salary Converter',  path: '/tools/salary/' },
      { id: 'compound',      name: 'Compound Interest', path: '/tools/compound/' },
      { id: 'discount',      name: 'Discount',          path: '/tools/discount/' },
      { id: 'vat',           name: 'VAT / Sales Tax',   path: '/tools/vat/' },
      { id: 'margin',        name: 'Profit Margin',     path: '/tools/margin/' },
      { id: 'hourly-rate',   name: 'Hourly Rate',       path: '/tools/hourly-rate/' },
      { id: 'savings-goal',  name: 'Savings Goal',      path: '/tools/savings-goal/' },
      { id: 'inflation',     name: 'Inflation',         path: '/tools/inflation/' },
      { id: 'roi',           name: 'ROI Calculator',    path: '/tools/roi/' },
      { id: 'net-worth',     name: 'Net Worth',         path: '/tools/net-worth/' },
      { id: 'paypal-fee', name: 'Payment Fee Calc', path: '/tools/paypal-fee/' },
      { id: 'break-even', name: 'Break-Even Calc', path: '/tools/break-even/' },
      { id: 'down-payment', name: "Down Payment", path: '/tools/down-payment/' },
      { id: 'stripe-fee', name: "Stripe Fee", path: '/tools/stripe-fee/' },
      { id: 'budget', name: "50/30/20 Budget", path: '/tools/budget/' },
    ]
  },
  {
    name: 'Security & Crypto',
    tools: [
      { id: 'password',          name: 'Password',           path: '/tools/password/' },
      { id: 'password-strength', name: 'Password Strength',  path: '/tools/password-strength/' },
      { id: 'passphrase',        name: 'Diceware Passphrase', path: '/tools/passphrase/' },
      { id: 'hash',              name: 'Hash Generator',     path: '/tools/hash/' },
      { id: 'hmac',              name: 'HMAC Generator',     path: '/tools/hmac/' },
      { id: 'jwt',               name: 'JWT Decoder',        path: '/tools/jwt/' },
      { id: 'jwt-sign',          name: 'JWT Signer',         path: '/tools/jwt-sign/' },
      { id: 'bcrypt',            name: 'Bcrypt',             path: '/tools/bcrypt/' },
      { id: 'htpasswd',          name: '.htpasswd',          path: '/tools/htpasswd/' },
      { id: 'rot13',             name: 'ROT13 / Caesar',     path: '/tools/rot13/' },
      { id: 'aes',               name: 'AES Encrypt/Decrypt', path: '/tools/aes/' },
      { id: 'totp',              name: 'TOTP / 2FA',         path: '/tools/totp/' },
      { id: 'vigenere', name: 'Vigenere Cipher', path: '/tools/vigenere/' },
      { id: 'random-key', name: 'Random Key / Token', path: '/tools/random-key/' },
      { id: 'caesar', name: 'Caesar Cipher', path: '/tools/caesar/' },
      { id: 'atbash', name: 'Atbash Cipher', path: '/tools/atbash/' },
      { id: 'xor-cipher', name: 'XOR Cipher', path: '/tools/xor-cipher/' },
    ]
  },
  {
    name: 'Generators',
    tools: [
      { id: 'qr',               name: 'QR Code',           path: '/tools/qr/' },
      { id: 'picker',           name: 'Random Picker',     path: '/tools/picker/' },
      { id: 'mock-data',        name: 'Mock Data',         path: '/tools/mock-data/' },
      { id: 'dice',             name: 'Dice Roller',       path: '/tools/dice/' },
      { id: 'coin',             name: 'Coin Flip',         path: '/tools/coin/' },
      { id: 'morse',            name: 'Morse Code',        path: '/tools/morse/' },
      { id: 'username',         name: 'Username',          path: '/tools/username/' },
      { id: 'identicon',        name: 'Identicon Avatar',  path: '/tools/identicon/' },
      { id: 'placeholder',      name: 'Placeholder Image', path: '/tools/placeholder/' },
      { id: 'avatar-initials',  name: 'Initials Avatar',   path: '/tools/avatar-initials/' },
      { id: 'color-shades',     name: 'Color Tints / Shades', path: '/tools/color-shades/' },
      { id: 'notepad',          name: 'Online Notepad',    path: '/tools/notepad/' },
      { id: 'wheel',            name: 'Spin Wheel',        path: '/tools/wheel/' },
      { id: 'decision',         name: 'Yes/No Decision',   path: '/tools/decision/' },
      { id: 'tone',             name: 'Tone Generator',    path: '/tools/tone/' },
      { id: 'tts',              name: 'Text-to-Speech',    path: '/tools/tts/' },
      { id: 'stt',              name: 'Speech-to-Text',    path: '/tools/stt/' },
      { id: 'audio-recorder',   name: 'Audio Recorder',    path: '/tools/audio-recorder/' },
      { id: 'ascii-art',        name: 'ASCII Art',         path: '/tools/ascii-art/' },
      { id: 'nato', name: 'NATO Phonetic', path: '/tools/nato/' },
      { id: 'barcode', name: 'Barcode Generator', path: '/tools/barcode/' },
      { id: 'list-shuffle', name: 'List Randomizer', path: '/tools/list-shuffle/' },
      { id: 'random-color', name: 'Random Color', path: '/tools/random-color/' },
      { id: 'team-generator', name: 'Team Generator', path: '/tools/team-generator/' },
      { id: 'secret-santa', name: 'Secret Santa', path: '/tools/secret-santa/' },
      { id: 'tournament-bracket', name: 'Tournament Bracket', path: '/tools/tournament-bracket/' },
      { id: 'would-you-rather', name: 'Would You Rather', path: '/tools/would-you-rather/' },
      { id: 'magic-8-ball', name: 'Magic 8 Ball', path: '/tools/magic-8-ball/' },
      { id: 'pin', name: "PIN Generator", path: '/tools/pin/' },
      { id: 'random-name', name: "Random Name", path: '/tools/random-name/' },
      { id: 'themed-ipsum', name: "Themed Ipsum", path: '/tools/themed-ipsum/' },
    ]
  },
  {
    name: 'Developers',
    tools: [
      { id: 'json',          name: 'JSON Formatter',    path: '/tools/json/' },
      { id: 'base64',        name: 'Base64',            path: '/tools/base64/' },
      { id: 'csv-json',      name: 'CSV \u2194 JSON',   path: '/tools/csv-json/' },
      { id: 'sql',           name: 'SQL Formatter',     path: '/tools/sql/' },
      { id: 'json-diff',     name: 'JSON Diff',         path: '/tools/json-diff/' },
      { id: 'json-schema',   name: 'JSON Schema',       path: '/tools/json-schema/' },
      { id: 'yaml',          name: 'YAML \u2194 JSON',  path: '/tools/yaml/' },
      { id: 'xml',           name: 'XML Formatter',     path: '/tools/xml/' },
      { id: 'http-status',   name: 'HTTP Status Codes', path: '/tools/http-status/' },
      { id: 'html-mini',     name: 'HTML Minifier',     path: '/tools/html-mini/' },
      { id: 'css-mini',      name: 'CSS Minifier',      path: '/tools/css-mini/' },
      { id: 'js-mini',       name: 'JS Minifier',       path: '/tools/js-mini/' },
      { id: 'url-parser',    name: 'URL Parser',        path: '/tools/url-parser/' },
      { id: 'ua-parser',     name: 'User-Agent Parser', path: '/tools/ua-parser/' },
      { id: 'url-encode',    name: 'URL Encode/Decode', path: '/tools/url-encode/' },
      { id: 'regex',         name: 'Regex Tester',      path: '/tools/regex/' },
      { id: 'html-entities', name: 'HTML Entities',     path: '/tools/html-entities/' },
      { id: 'binary-text',   name: 'Binary \u2194 Text', path: '/tools/binary-text/' },
      { id: 'uuid',          name: 'UUID',              path: '/tools/uuid/' },
      { id: 'gitignore',     name: '.gitignore',        path: '/tools/gitignore/' },
      { id: 'cidr',          name: 'CIDR / Subnet',     path: '/tools/cidr/' },
      { id: 'chmod',         name: 'chmod / Permissions', path: '/tools/chmod/' },
      { id: 'serp-preview',  name: 'SERP Preview',     path: '/tools/serp-preview/' },
      { id: 'robots-txt',    name: 'Robots.txt',       path: '/tools/robots-txt/' },
      { id: 'sitemap-gen',   name: 'Sitemap.xml',      path: '/tools/sitemap-gen/' },
      { id: 'schema-gen',    name: 'Schema Markup',    path: '/tools/schema-gen/' },
      { id: 'markdown-toc',  name: 'Markdown TOC',     path: '/tools/markdown-toc/' },
      { id: 'json-path',     name: 'JSONPath Tester',  path: '/tools/json-path/' },
      { id: 'json-to-ts', name: 'JSON to TypeScript', path: '/tools/json-to-ts/' },
      { id: 'html-to-jsx', name: 'HTML to JSX', path: '/tools/html-to-jsx/' },
      { id: 'curl-builder', name: 'cURL Builder', path: '/tools/curl-builder/' },
      { id: 'string-escape', name: 'String Escape', path: '/tools/string-escape/' },
      { id: 'id-generator', name: 'Nano ID / ULID', path: '/tools/id-generator/' },
      { id: 'svg-optimizer', name: 'SVG Optimizer', path: '/tools/svg-optimizer/' },
      { id: 'credit-card-test', name: 'Test Card Numbers', path: '/tools/credit-card-test/' },
      { id: 'base58', name: 'Base58', path: '/tools/base58/' },
      { id: 'discord-timestamp', name: 'Discord Timestamp', path: '/tools/discord-timestamp/' },
      { id: 'html-table', name: 'HTML Table', path: '/tools/html-table/' },
      { id: 'url-status', name: 'URL Status Checker', path: '/tools/url-status/' },
      { id: 'http-headers', name: 'HTTP Headers', path: '/tools/http-headers/' },
      { id: 'mime-types', name: 'MIME Type Lookup', path: '/tools/mime-types/' },
      { id: 'ascii-table', name: 'ASCII Table', path: '/tools/ascii-table/' },
      { id: 'bitwise-calculator', name: 'Bitwise Calculator', path: '/tools/bitwise-calculator/' },
      { id: 'ip-to-binary', name: 'IP to Binary', path: '/tools/ip-to-binary/' },
      { id: 'json-to-go', name: 'JSON to Go', path: '/tools/json-to-go/' },
      { id: 'html-preview', name: 'HTML Preview', path: '/tools/html-preview/' },
      { id: 'hex-to-text', name: 'Hex to Text', path: '/tools/hex-to-text/' },
      { id: 'base32', name: "Base32", path: '/tools/base32/' },
      { id: 'env-json', name: ".env to JSON", path: '/tools/env-json/' },
      { id: 'mac-address', name: "MAC Address", path: '/tools/mac-address/' },
      { id: 'json-to-python', name: "JSON to Python", path: '/tools/json-to-python/' },
      { id: 'json-to-rust', name: "JSON to Rust", path: '/tools/json-to-rust/' },
      { id: 'json-to-kotlin', name: "JSON to Kotlin", path: '/tools/json-to-kotlin/' },
      { id: 'htaccess', name: ".htaccess Generator", path: '/tools/htaccess/' },
      { id: 'git-command', name: "Git Commands", path: '/tools/git-command/' },
      { id: 'graphql', name: "GraphQL Formatter", path: '/tools/graphql/' },
      { id: 'csv-editor', name: "CSV Editor", path: '/tools/csv-editor/' },
    ]
  },
];

// Tracked so renderFooter can auto-show the bug report on tool pages.
let _SD_ACTIVE_PAGE = null;

function renderNav(activePage, options) {
  _SD_ACTIVE_PAGE = activePage;
  options = options || {};
  const nav = document.createElement('nav');
  nav.className = 'sd-nav';
  nav.setAttribute('aria-label', 'Main navigation');

  let html = '<a href="/" class="sd-nav-brand" aria-label="SharpDev.Tools home">' +
    '<svg class="sd-nav-logo" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
      '<text x="16" y="22" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="18" font-weight="700" fill="#ff4444" text-anchor="middle">&lt;/&gt;</text>' +
    '</svg>' +
    '<span class="sd-nav-brand-text">SharpDev<span class="accent">.</span>Tools</span>' +
  '</a>';

  // Mobile hamburger
  html += '<button class="sd-nav-toggle" aria-label="Open menu" onclick="document.querySelector(\'.sd-nav-links\').classList.toggle(\'open\')">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
          '</button>';

  html += '<div class="sd-nav-links">';
  html += '<a href="/" class="sd-nav-link' + (activePage === 'home' ? ' active' : '') + '">All tools</a>';

  // Figure out which category the active page belongs to
  let activeCategory = null;
  for (const cat of SD_CATEGORIES) {
    if (cat.tools.some(t => t.id === activePage)) { activeCategory = cat.name; break; }
  }

  for (const cat of SD_CATEGORIES) {
    const isActive = activeCategory === cat.name;
    const slug = _slugifyCategory(cat.name);
    html += '<div class="sd-dropdown' + (isActive ? ' active' : '') + '">';
    html += '<button class="sd-dropdown-toggle" type="button">' + cat.name +
            '<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2,4 6,8 10,4"/></svg>' +
            '</button>';
    html += '<div class="sd-dropdown-menu">';
    // "View all" link at the top of each dropdown so users can land on the
    // dedicated category page directly instead of digging through tool links.
    html += '<a href="/' + slug + '/" class="sd-dropdown-all">View all ' +
            cat.tools.length + ' ' + cat.name + ' tools →</a>';
    // Cap each dropdown to a short preview — the "View all" link above and the
    // site search cover the rest. Keeps the nav usable now that some categories
    // (Converters) have 240+ tools.
    var NAV_CAP = 8;
    var shown = cat.tools.slice(0, NAV_CAP);
    if (isActive) {  // keep the currently-open tool visible even if it's past the cap
      var act = null;
      for (var ai = 0; ai < cat.tools.length; ai++) {
        if (cat.tools[ai].id === activePage) { act = cat.tools[ai]; break; }
      }
      if (act && shown.indexOf(act) === -1) shown = shown.slice(0, NAV_CAP - 1).concat([act]);
    }
    for (const t of shown) {
      html += '<a href="' + t.path + '"' + (activePage === t.id ? ' class="active"' : '') + '>' + t.name + '</a>';
    }
    html += '</div></div>';
  }
  html += '</div>';

  nav.innerHTML = html;
  document.body.prepend(nav);

  // Dropdown click-to-toggle on mobile (hover handles desktop via CSS)
  nav.querySelectorAll('.sd-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (window.innerWidth > 900) return; // desktop uses hover
      e.preventDefault();
      const dd = btn.parentElement;
      nav.querySelectorAll('.sd-dropdown.open').forEach(o => { if (o !== dd) o.classList.remove('open'); });
      dd.classList.toggle('open');
    });
  });

  // Auto-render action bar (tip jar + request a tool) unless explicitly disabled
  if (options.actionBar !== false) {
    renderActionBar({ placement: options.actionBarPlacement || 'insideNav' });
  }

  // Site search (command palette). Isolated so a search bug can never break
  // the nav itself — the nav is on every one of the 320+ pages.
  try { renderSearch(); } catch (e) { /* search is non-critical */ }
}

function renderActionBar(options) {
  options = options || {};
  const placement = options.placement || 'insideNav'; // 'insideNav' | 'afterNav' | 'afterHero' | 'manual'

  const bar = document.createElement('div');
  bar.className = placement === 'insideNav' ? 'sd-nav-actions' : 'sd-action-bar';
  bar.innerHTML =
    '<a href="' + SD_TIP_URL + '" target="_blank" rel="noopener noreferrer" class="coffee-btn">' +
      '<svg class="coffee-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>' +
        '<line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>' +
      '</svg><span>Tip jar</span>' +
    '</a>' +
    '<a href="/request/" class="request-btn">' +
      '<span class="arrow">\u203A</span>' +
      '<span class="sd-req-long">Missing a tool? Request one \u2014 it\'s free</span>' +
      '<span class="sd-req-short">Request a tool</span>' +
    '</a>';

  // Insert into DOM
  if (placement === 'manual') {
    // caller will position it; return the element
  } else if (placement === 'insideNav') {
    // Append inside the nav so pills sit between brand and links
    const nav = document.querySelector('.sd-nav');
    if (nav) nav.appendChild(bar);
    else document.body.insertBefore(bar, document.body.firstChild);
  } else if (placement === 'afterHero') {
    const hero = document.querySelector('.hero');
    if (hero && hero.parentNode) hero.parentNode.insertBefore(bar, hero.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild.nextSibling);
  } else {
    // afterNav: place immediately after the nav
    const nav = document.querySelector('.sd-nav');
    if (nav && nav.parentNode) nav.parentNode.insertBefore(bar, nav.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild);
  }

  return bar;
}

// Turn a category display name into its URL anchor / page slug.
// "Time & Date" → "time-date", "PDF" → "pdf".
function _slugifyCategory(name) {
  return name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
}

// Look up the currently-active tool from SD_CATEGORIES (null on home/about/etc).
function _getActiveTool() {
  if (!_SD_ACTIVE_PAGE) return null;
  for (const cat of SD_CATEGORIES) {
    const tool = cat.tools.find(t => t.id === _SD_ACTIVE_PAGE);
    if (tool) return tool;
  }
  return null;
}

// Returns { tool, category } for the active page, or null off-tool.
function _getActiveToolWithCategory() {
  if (!_SD_ACTIVE_PAGE) return null;
  for (const cat of SD_CATEGORIES) {
    const tool = cat.tools.find(t => t.id === _SD_ACTIVE_PAGE);
    if (tool) return { tool, category: cat };
  }
  return null;
}

// Render a "Related tools" block at the bottom of every tool page.
// Picks up to 6 other tools from the same category, in stable order.
// Boosts internal linking + retention without per-page wiring.
function renderRelated() {
  const ctx = _getActiveToolWithCategory();
  if (!ctx) return; // not on a tool page

  const others = ctx.category.tools.filter(t => t.id !== ctx.tool.id).slice(0, 6);
  if (others.length === 0) return;

  const section = document.createElement('section');
  section.className = 'sd-related';
  let html = '<h2 class="sd-related-title">More ' + ctx.category.name + ' tools</h2>';
  html += '<div class="sd-related-grid">';
  for (const t of others) {
    html += '<a class="sd-related-card" href="' + t.path + '">' +
              '<span class="sd-related-name">' + t.name + '</span>' +
              '<span class="sd-related-arrow">›</span>' +
            '</a>';
  }
  html += '</div>';
  section.innerHTML = html;
  document.body.appendChild(section);
}

function renderBugReport() {
  const tool = _getActiveTool();
  if (!tool) return; // only on tool pages

  const wrap = document.createElement('section');
  wrap.className = 'sd-bug-wrap';
  wrap.innerHTML =
    '<details class="sd-bug-details">' +
      '<summary>' +
        '<span class="sd-bug-icon" aria-hidden="true">\uD83D\uDC1E</span>' +
        '<span>Found a bug with ' + _esc(tool.name) + '? Report it \u2014 it gets fixed fast.</span>' +
      '</summary>' +
      '<div class="sd-bug-card">' +
        '<form class="sd-bug-form" id="sd-bug-form">' +
          '<p class="lead">What went wrong? A short note is enough \u2014 I see every report.</p>' +
          '<label for="sd-bug-text">What\u2019s wrong?</label>' +
          '<textarea id="sd-bug-text" name="details" maxlength="2000" required placeholder="Describe what you did and what happened..."></textarea>' +
          '<label for="sd-bug-email">Your email <span class="optional">(optional, only if you want a reply)</span></label>' +
          '<input type="email" id="sd-bug-email" name="email" maxlength="200" placeholder="you@example.com">' +
          '<button type="submit" id="sd-bug-submit">Send bug report</button>' +
          '<div class="hint">Sent straight to my inbox. No newsletter, no spam. See the <a href="https://sharpdev.tools/datenschutz/">Datenschutzerkl\u00e4rung</a>.</div>' +
          '<div id="sd-bug-status" class="sd-bug-status"></div>' +
        '</form>' +
      '</div>' +
    '</details>';

  // Insert just before the footer if one exists, otherwise at end of body.
  const footer = document.querySelector('.sd-footer');
  if (footer && footer.parentNode) footer.parentNode.insertBefore(wrap, footer);
  else document.body.appendChild(wrap);

  const form = wrap.querySelector('#sd-bug-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = wrap.querySelector('#sd-bug-submit');
    const status = wrap.querySelector('#sd-bug-status');
    const details = wrap.querySelector('#sd-bug-text').value.trim();
    const email = wrap.querySelector('#sd-bug-email').value.trim();
    if (!details) return;
    const data = {
      tool: tool.name,
      toolId: tool.id,
      toolPath: tool.path,
      details,
      email,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
    };
    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.style.display = 'none';
    try {
      const res = await fetch('/api/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || 'Request failed');
      }
      status.className = 'sd-bug-status success';
      status.textContent = 'Thanks! Bug report received.';
      status.style.display = 'block';
      form.reset();
    } catch (err) {
      status.className = 'sd-bug-status error';
      status.textContent = 'Could not send: ' + err.message + '. Email gillian@videowien.at directly if this keeps failing.';
      status.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send bug report';
    }
  });
}

function _esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/* ----------------- Site search (command palette) -----------------
   Searches the full SD_CATEGORIES catalogue. Rendered on every page by
   renderNav() (a small nav trigger + a centered overlay). Opens via the
   trigger, the "/" key, Cmd/Ctrl+K, or a ?q= query param (fulfils the
   homepage SearchAction). Pure client-side, no index file, no network. */
let _sdSearchIndex = null;
let _sdSearchResults = [];
let _sdSearchSel = 0;

function _sdGetSearchIndex() {
  if (_sdSearchIndex) return _sdSearchIndex;
  const idx = [];
  for (const cat of SD_CATEGORIES) {
    for (const t of cat.tools) {
      // hay also folds the slug ("cm-to-inches" -> "cm to inches") so dashed
      // queries and natural-language queries both hit.
      const hay = (t.name + ' ' + t.id.replace(/-/g, ' ') + ' ' + cat.name).toLowerCase();
      idx.push({ name: t.name, path: t.path, cat: cat.name, nameLower: t.name.toLowerCase(), hay: hay });
    }
  }
  _sdSearchIndex = idx;
  return idx;
}

function _sdSearchFilter(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/);
  const out = [];
  for (const it of _sdGetSearchIndex()) {
    if (!tokens.every(function (tok) { return it.hay.indexOf(tok) !== -1; })) continue;
    let score = 4;
    if (it.nameLower === q) score = 0;
    else if (it.nameLower.indexOf(q) === 0) score = 1;
    else if (it.nameLower.indexOf(q) !== -1) score = 2;
    else if (tokens.every(function (tok) { return it.nameLower.indexOf(tok) !== -1; })) score = 3;
    out.push({ it: it, score: score });
  }
  out.sort(function (a, b) { return a.score - b.score || a.it.name.localeCompare(b.it.name); });
  return out.slice(0, 24).map(function (o) { return o.it; });
}

function _sdRenderSearchResults(q) {
  const list = document.getElementById('sdSearchList');
  if (!list) return;
  _sdSearchResults = _sdSearchFilter(q);
  _sdSearchSel = 0;
  if (!q.trim()) {
    list.innerHTML = '<div class="sd-search-empty">Start typing to search ' + _sdGetSearchIndex().length + ' tools…</div>';
    return;
  }
  if (!_sdSearchResults.length) {
    list.innerHTML = '<div class="sd-search-empty">No tools match &ldquo;' + _esc(q) + '&rdquo;. Try fewer or different words.</div>';
    return;
  }
  list.innerHTML = _sdSearchResults.map(function (it, i) {
    return '<a href="' + it.path + '" class="sd-search-item' + (i === 0 ? ' sel' : '') + '" data-i="' + i + '">' +
      '<span class="sd-search-name">' + _esc(it.name) + '</span>' +
      '<span class="cat">' + _esc(it.cat) + '</span>' +
    '</a>';
  }).join('');
}

function _sdMoveSel(delta) {
  const items = document.querySelectorAll('#sdSearchList .sd-search-item');
  if (!items.length) return;
  if (items[_sdSearchSel]) items[_sdSearchSel].classList.remove('sel');
  _sdSearchSel = (_sdSearchSel + delta + items.length) % items.length;
  const cur = items[_sdSearchSel];
  cur.classList.add('sel');
  cur.scrollIntoView({ block: 'nearest' });
}

function _sdOpenSearch(prefill) {
  const ov = document.getElementById('sdSearchOverlay');
  const inp = document.getElementById('sdSearchInput');
  if (!ov || !inp) return;
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof prefill === 'string') inp.value = prefill;
  _sdRenderSearchResults(inp.value);
  inp.focus();
  inp.select();
}

function _sdCloseSearch() {
  const ov = document.getElementById('sdSearchOverlay');
  if (!ov) return;
  ov.classList.remove('open');
  document.body.style.overflow = '';
}

function renderSearch() {
  const nav = document.querySelector('.sd-nav');
  if (!nav || document.getElementById('sdSearchOverlay')) return;
  const count = _sdGetSearchIndex().length;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'sd-search-trigger';
  trigger.setAttribute('aria-label', 'Search tools');
  trigger.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
    '<span class="sd-search-trigger-label">Search tools</span>' +
    '<span class="sd-search-trigger-kbd">/</span>';
  const brand = nav.querySelector('.sd-nav-brand');
  if (brand && brand.nextSibling) nav.insertBefore(trigger, brand.nextSibling);
  else nav.appendChild(trigger);

  const ov = document.createElement('div');
  ov.id = 'sdSearchOverlay';
  ov.className = 'sd-search-overlay';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', 'Search tools');
  ov.innerHTML =
    '<div class="sd-search-box">' +
      '<div class="sd-search-inputwrap">' +
        '<svg class="sd-search-mag" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input id="sdSearchInput" type="text" class="sd-search-input" placeholder="Search ' + count + ' tools…" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Search tools" aria-controls="sdSearchList" />' +
        '<button class="sd-search-esc" type="button" aria-label="Close search">esc</button>' +
      '</div>' +
      '<div id="sdSearchList" class="sd-search-list" role="listbox"></div>' +
      '<div class="sd-search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>' +
    '</div>';
  document.body.appendChild(ov);

  const inp = ov.querySelector('#sdSearchInput');
  trigger.addEventListener('click', function () { _sdOpenSearch(); });
  ov.querySelector('.sd-search-esc').addEventListener('click', _sdCloseSearch);
  ov.addEventListener('mousedown', function (e) { if (e.target === ov) _sdCloseSearch(); });
  inp.addEventListener('input', function () { _sdRenderSearchResults(inp.value); });
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); _sdMoveSel(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); _sdMoveSel(-1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const r = _sdSearchResults[_sdSearchSel];
      if (r) window.location.href = r.path;
    } else if (e.key === 'Escape') { e.preventDefault(); _sdCloseSearch(); }
  });

  document.addEventListener('keydown', function (e) {
    const t = e.target || {};
    const tag = t.tagName || '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault(); _sdOpenSearch();
    } else if (e.key === '/' && !typing && !ov.classList.contains('open')) {
      e.preventDefault(); _sdOpenSearch();
    }
  });

  // Fulfil the declared ?q= SearchAction (works on any page).
  try {
    const qp = new URLSearchParams(window.location.search).get('q');
    if (qp && qp.trim()) _sdOpenSearch(qp);
  } catch (e) { /* no-op */ }
}

function renderFooter() {
  // Auto-append the "Related tools" block (no-op off tool pages).
  renderRelated();
  // Auto-append the bug report section on any tool page.
  renderBugReport();

  const footer = document.createElement('footer');
  footer.className = 'sd-footer';
  footer.innerHTML = '<div class="footer-links">' +
    '<a href="https://sharpdev.tools/about/">About</a>' +
    '<a href="https://sharpdev.tools/impressum/">Impressum</a>' +
    '<a href="https://sharpdev.tools/datenschutz/">Datenschutz</a>' +
    '</div>' +
    '<div class="footer-copy">&copy; ' + new Date().getFullYear() + ' SharpDev.Tools &mdash; Gillian Scharf</div>';
  document.body.appendChild(footer);
}
