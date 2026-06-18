/**
 * Schema Markup Generator — JSON-LD for popular types
 */

const typeEl = document.getElementById('schema-type');
const formGrid = document.getElementById('form-grid');
const output = document.getElementById('output');
const statusMsg = document.getElementById('status-msg');

// Per-type field definitions
const SCHEMAS = {
  Article: {
    fields: [
      { id: 'headline', label: 'Headline', type: 'text' },
      { id: 'author', label: 'Author name', type: 'text' },
      { id: 'datePublished', label: 'Published date', type: 'date' },
      { id: 'dateModified', label: 'Modified date', type: 'date' },
      { id: 'image', label: 'Image URL', type: 'text', full: true },
      { id: 'description', label: 'Description', type: 'textarea', full: true },
      { id: 'url', label: 'Article URL', type: 'text', full: true },
      { id: 'publisher', label: 'Publisher name', type: 'text' },
      { id: 'publisherLogo', label: 'Publisher logo URL', type: 'text' },
    ],
    build: (v) => ({
      '@context': 'https://schema.org', '@type': 'Article',
      headline: v.headline, image: v.image ? [v.image] : undefined,
      author: v.author ? { '@type': 'Person', name: v.author } : undefined,
      datePublished: v.datePublished, dateModified: v.dateModified || v.datePublished,
      description: v.description, mainEntityOfPage: v.url ? { '@type': 'WebPage', '@id': v.url } : undefined,
      publisher: v.publisher ? {
        '@type': 'Organization', name: v.publisher,
        logo: v.publisherLogo ? { '@type': 'ImageObject', url: v.publisherLogo } : undefined,
      } : undefined,
    })
  },
  FAQPage: {
    isFaq: true,
    build: (faqs) => ({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  },
  Product: {
    fields: [
      { id: 'name', label: 'Product name', type: 'text' },
      { id: 'image', label: 'Image URL', type: 'text' },
      { id: 'description', label: 'Description', type: 'textarea', full: true },
      { id: 'sku', label: 'SKU', type: 'text' },
      { id: 'brand', label: 'Brand name', type: 'text' },
      { id: 'price', label: 'Price', type: 'text' },
      { id: 'currency', label: 'Currency (e.g. USD)', type: 'text' },
      { id: 'availability', label: 'Availability', type: 'select',
        options: ['InStock', 'OutOfStock', 'PreOrder', 'Discontinued'] },
      { id: 'ratingValue', label: 'Avg rating (e.g. 4.5)', type: 'text' },
      { id: 'reviewCount', label: 'Review count', type: 'text' },
    ],
    build: (v) => {
      const o = {
        '@context': 'https://schema.org', '@type': 'Product',
        name: v.name, image: v.image, description: v.description, sku: v.sku,
      };
      if (v.brand) o.brand = { '@type': 'Brand', name: v.brand };
      if (v.price) o.offers = {
        '@type': 'Offer', price: v.price, priceCurrency: v.currency || 'USD',
        availability: v.availability ? 'https://schema.org/' + v.availability : undefined,
      };
      if (v.ratingValue && v.reviewCount) o.aggregateRating = {
        '@type': 'AggregateRating', ratingValue: v.ratingValue, reviewCount: v.reviewCount,
      };
      return o;
    }
  },
  LocalBusiness: {
    fields: [
      { id: 'name', label: 'Business name', type: 'text' },
      { id: 'image', label: 'Image URL', type: 'text' },
      { id: 'phone', label: 'Phone (+1...)', type: 'text' },
      { id: 'url', label: 'Website URL', type: 'text' },
      { id: 'street', label: 'Street address', type: 'text', full: true },
      { id: 'city', label: 'City', type: 'text' },
      { id: 'region', label: 'State / Region', type: 'text' },
      { id: 'postal', label: 'Postal code', type: 'text' },
      { id: 'country', label: 'Country code (e.g. US)', type: 'text' },
      { id: 'hours', label: 'Opening hours', type: 'textarea', full: true,
        placeholder: 'Mo-Fr 09:00-17:00\nSa 10:00-14:00' },
    ],
    build: (v) => {
      const hours = v.hours ? v.hours.split('\n').map(h => h.trim()).filter(Boolean) : undefined;
      return {
        '@context': 'https://schema.org', '@type': 'LocalBusiness',
        name: v.name, image: v.image, telephone: v.phone, url: v.url,
        address: (v.street || v.city) ? {
          '@type': 'PostalAddress', streetAddress: v.street, addressLocality: v.city,
          addressRegion: v.region, postalCode: v.postal, addressCountry: v.country,
        } : undefined,
        openingHours: hours,
      };
    }
  },
  Recipe: {
    fields: [
      { id: 'name', label: 'Recipe name', type: 'text' },
      { id: 'image', label: 'Image URL', type: 'text' },
      { id: 'description', label: 'Description', type: 'textarea', full: true },
      { id: 'prepTime', label: 'Prep time (ISO, e.g. PT15M)', type: 'text' },
      { id: 'cookTime', label: 'Cook time (e.g. PT30M)', type: 'text' },
      { id: 'recipeYield', label: 'Yield (e.g. "4 servings")', type: 'text' },
      { id: 'ingredients', label: 'Ingredients (one per line)', type: 'textarea', full: true },
      { id: 'instructions', label: 'Instructions (one step per line)', type: 'textarea', full: true },
    ],
    build: (v) => ({
      '@context': 'https://schema.org', '@type': 'Recipe',
      name: v.name, image: v.image, description: v.description,
      prepTime: v.prepTime, cookTime: v.cookTime, recipeYield: v.recipeYield,
      recipeIngredient: v.ingredients ? v.ingredients.split('\n').filter(Boolean) : undefined,
      recipeInstructions: v.instructions ? v.instructions.split('\n').filter(Boolean).map(t => ({ '@type': 'HowToStep', text: t })) : undefined,
    })
  },
  HowTo: {
    fields: [
      { id: 'name', label: 'How-to title', type: 'text' },
      { id: 'description', label: 'Description', type: 'textarea', full: true },
      { id: 'totalTime', label: 'Total time (e.g. PT30M)', type: 'text' },
      { id: 'steps', label: 'Steps (one per line)', type: 'textarea', full: true },
    ],
    build: (v) => ({
      '@context': 'https://schema.org', '@type': 'HowTo',
      name: v.name, description: v.description, totalTime: v.totalTime,
      step: v.steps ? v.steps.split('\n').filter(Boolean).map((t, i) => ({
        '@type': 'HowToStep', position: i + 1, name: 'Step ' + (i + 1), text: t,
      })) : undefined,
    })
  },
  Event: {
    fields: [
      { id: 'name', label: 'Event name', type: 'text' },
      { id: 'startDate', label: 'Start (ISO 8601)', type: 'text' },
      { id: 'endDate', label: 'End (ISO 8601)', type: 'text' },
      { id: 'location', label: 'Location name', type: 'text' },
      { id: 'address', label: 'Address', type: 'text', full: true },
      { id: 'description', label: 'Description', type: 'textarea', full: true },
      { id: 'url', label: 'Event URL', type: 'text', full: true },
    ],
    build: (v) => ({
      '@context': 'https://schema.org', '@type': 'Event',
      name: v.name, startDate: v.startDate, endDate: v.endDate,
      description: v.description, url: v.url,
      location: (v.location || v.address) ? {
        '@type': 'Place', name: v.location,
        address: v.address ? { '@type': 'PostalAddress', streetAddress: v.address } : undefined,
      } : undefined,
    })
  },
  Organization: {
    fields: [
      { id: 'name', label: 'Organization name', type: 'text' },
      { id: 'url', label: 'URL', type: 'text' },
      { id: 'logo', label: 'Logo URL', type: 'text' },
      { id: 'sameAs', label: 'Social profile URLs (one per line)', type: 'textarea', full: true },
    ],
    build: (v) => ({
      '@context': 'https://schema.org', '@type': 'Organization',
      name: v.name, url: v.url, logo: v.logo,
      sameAs: v.sameAs ? v.sameAs.split('\n').filter(Boolean) : undefined,
    })
  },
  BreadcrumbList: {
    isBreadcrumb: true,
    build: (items) => ({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem', position: i + 1, name: it.name, item: it.url,
      })),
    })
  },
};

let faqs = [{ q: 'What is your refund policy?', a: 'We offer a 30-day money-back guarantee.' }];
let breadcrumbs = [{ name: 'Home', url: 'https://example.com/' }, { name: 'Blog', url: 'https://example.com/blog/' }];
let formValues = {};

function renderForm() {
  const t = SCHEMAS[typeEl.value];
  formGrid.innerHTML = '';
  formValues = {};

  if (t.isFaq) {
    const wrap = document.createElement('div');
    wrap.className = 'faq-list';
    wrap.innerHTML = `<label class="opt-label">Q &amp; A pairs</label>`;
    const list = document.createElement('div');
    list.style.display = 'flex'; list.style.flexDirection = 'column'; list.style.gap = '8px';
    faqs.forEach((f, i) => {
      const item = document.createElement('div');
      item.className = 'faq-item';
      item.innerHTML = `
        <div class="row">
          <span class="num">Q${i + 1}</span>
          <input type="text" placeholder="Question" value="${escAttr(f.q)}" data-k="q"/>
          <button class="x" type="button">×</button>
        </div>
        <textarea rows="2" placeholder="Answer" data-k="a">${escHtml(f.a)}</textarea>
      `;
      item.querySelector('[data-k=q]').addEventListener('input', (e) => { f.q = e.target.value; build(); });
      item.querySelector('[data-k=a]').addEventListener('input', (e) => { f.a = e.target.value; build(); });
      item.querySelector('.x').addEventListener('click', () => { faqs.splice(i, 1); renderForm(); build(); });
      list.appendChild(item);
    });
    wrap.appendChild(list);
    const add = document.createElement('button');
    add.className = 'add-btn'; add.type = 'button'; add.textContent = '+ Add Q&A';
    add.addEventListener('click', () => { faqs.push({ q: '', a: '' }); renderForm(); build(); });
    wrap.appendChild(add);
    formGrid.appendChild(wrap);
  } else if (t.isBreadcrumb) {
    const wrap = document.createElement('div');
    wrap.className = 'step-list';
    wrap.innerHTML = `<label class="opt-label">Breadcrumb items</label>`;
    const list = document.createElement('div');
    list.style.display = 'flex'; list.style.flexDirection = 'column'; list.style.gap = '6px';
    breadcrumbs.forEach((b, i) => {
      const item = document.createElement('div');
      item.className = 'step-item row';
      item.style.flexDirection = 'row';
      item.innerHTML = `
        <span class="num">${i + 1}.</span>
        <input type="text" placeholder="Name" value="${escAttr(b.name)}" data-k="name" style="flex:1"/>
        <input type="text" placeholder="URL" value="${escAttr(b.url)}" data-k="url" style="flex:2"/>
        <button class="x" type="button">×</button>
      `;
      item.querySelector('[data-k=name]').addEventListener('input', (e) => { b.name = e.target.value; build(); });
      item.querySelector('[data-k=url]').addEventListener('input', (e) => { b.url = e.target.value; build(); });
      item.querySelector('.x').addEventListener('click', () => { breadcrumbs.splice(i, 1); renderForm(); build(); });
      list.appendChild(item);
    });
    wrap.appendChild(list);
    const add = document.createElement('button');
    add.className = 'add-btn'; add.type = 'button'; add.textContent = '+ Add item';
    add.addEventListener('click', () => { breadcrumbs.push({ name: '', url: '' }); renderForm(); build(); });
    wrap.appendChild(add);
    formGrid.appendChild(wrap);
  } else {
    for (const f of t.fields) {
      const div = document.createElement('div');
      div.className = 'form-row' + (f.full ? ' full' : '');
      const labelEl = document.createElement('label');
      labelEl.className = 'opt-label';
      labelEl.textContent = f.label;
      div.appendChild(labelEl);
      let inp;
      if (f.type === 'textarea') {
        inp = document.createElement('textarea');
        inp.rows = 3;
        if (f.placeholder) inp.placeholder = f.placeholder;
      } else if (f.type === 'select') {
        inp = document.createElement('select');
        inp.innerHTML = '<option value="">(none)</option>' + f.options.map(o => `<option>${o}</option>`).join('');
      } else {
        inp = document.createElement('input');
        inp.type = f.type;
      }
      inp.addEventListener('input', () => { formValues[f.id] = inp.value; build(); });
      div.appendChild(inp);
      formGrid.appendChild(div);
    }
    // Some sensible defaults so the example isn't empty
    if (typeEl.value === 'Article') {
      formValues.headline = 'How I built 179 free tools';
      formValues.author = 'Gillian Scharf';
      formValues.datePublished = new Date().toISOString().slice(0, 10);
      formValues.description = 'A short summary of the article…';
      formValues.url = 'https://example.com/article/';
      // Populate the inputs
      [...formGrid.querySelectorAll('input, textarea, select')].forEach((el, i) => {
        const fid = t.fields[i]?.id;
        if (fid && formValues[fid]) el.value = formValues[fid];
      });
    }
  }
  build();
}

function build() {
  const t = SCHEMAS[typeEl.value];
  let data;
  if (t.isFaq) data = t.build(faqs.filter(f => f.q && f.a));
  else if (t.isBreadcrumb) data = t.build(breadcrumbs.filter(b => b.name && b.url));
  else data = t.build(formValues);
  // Remove undefined / empty
  const clean = JSON.parse(JSON.stringify(data, (k, v) => {
    if (v === '' || v === undefined) return undefined;
    if (Array.isArray(v) && v.length === 0) return undefined;
    if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return undefined;
    return v;
  }));
  output.textContent = JSON.stringify(clean, null, 2);
}

function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }
function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

typeEl.addEventListener('change', renderForm);

document.getElementById('copy-script').addEventListener('click', async () => {
  await navigator.clipboard.writeText(`<script type="application/ld+json">\n${output.textContent}\n<\/script>`);
  flash('✓ Copied <script> tag');
});
document.getElementById('copy-json').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent);
  flash('✓ Copied JSON');
});
function flash(msg) { statusMsg.textContent = msg; statusMsg.className = 'status-msg ok'; setTimeout(() => { statusMsg.textContent = ''; }, 1500); }

renderForm();
