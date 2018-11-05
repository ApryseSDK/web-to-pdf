require('@babel/polyfill');
const assert = require('assert');
const cleanHTML = require('../src/util/clean-html');
const ensurePage = require('../src/util/ensure-page');
const insertChunks = require('../src/util/inject-header-footer');


describe('Inject headers and footers', () => {
  it('injects headers and footers', () => {

    const html = `
      <div class="Page">
        Content
      </div>
      <div class='Page'>
        Content
      </div>
    `

    const header = `<div class='header'>Header</div>`
    const footer = `<div class='footer'>Footer</div>`

    const result = insertChunks(html, 'Page', header, footer);

    assert.equal((result.match(/Header/g) || []).length, 2)
    assert.equal((result.match(/Footer/g) || []).length, 2)
    assert.equal((result.match(/Content/g) || []).length, 2)
    assert.equal((result.match(/webpdf-header/g) || []).length, 2)
    assert.equal((result.match(/webpdf-footer/g) || []).length, 2)

  })
})

describe('Ensure page', () => {
  it ('Doesnt add a page if one already exists', () => {
    const html = `
      <html>
        <body>
          <div class='Page'>
            Test
          </div>
        </body>
      </html> 
    `;

    const result = ensurePage(html, 'Page');

    assert(result === html);
  })

  it ('Adds a page if one doesnt exists', () => {
    const html = `
      <html>
        <body>
            Test
        </body>
      </html> 
    `;

    const result = ensurePage(html, 'Page');

    assert(result.indexOf("class='Page'") > -1);
    assert(result.indexOf("Test") > -1);
  })
})


describe('HTML cleaner', () => {
  it('adds html and body tags if none are present and true is passed', async () => {

    const html = `
      <div>

      </div>
    `;
    const result = cleanHTML(html, true);
    assert(result.indexOf('<html>') > -1);
    assert(result.indexOf('</html>') > -1);

    assert(result.indexOf('<body>') > -1);
    assert(result.indexOf('</body>') > -1);
    return;
  });

  it('does not add html and body tags if none are present and true is not passed', async () => {

    const html = `
      <div>

      </div>
    `;
    const result = cleanHTML(html);
    assert(result.indexOf('<html>') === -1);
    assert(result.indexOf('</html>') === -1);

    assert(result.indexOf('<body>') === -1);
    assert(result.indexOf('</body>') === -1);
    return;
  });

  it('Adds body tag if none present', () => {
    const html = `
      <html>
        <div>

        </div>
      </html>
    `;

    const result = cleanHTML(html, true);

    assert(result.indexOf('<body>') > -1);
    assert(result.indexOf('</body>') > -1);
  })

  it('Replaces encoded strings', async () => {

    const html = `
      &lt;div&gt;
        hello&amp;test
      &lt;/div&gt;
    `;
    const result = cleanHTML(html);
    assert(result.indexOf('<div>') > -1);
    assert(result.indexOf('</div>') > -1);

    assert(result.indexOf('hello&test') > -1);
    return;
  });
})