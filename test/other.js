require('@babel/polyfill');
const assert = require('assert');
const verifyPage = require('../src/util/verify-page');

describe('verification', () => {
  it('returns false if no .Page is present', async () => {
    
    const html = `<div></div>`;

    const html2 = "<div class='Page'></div>"

    assert(!verifyPage(html));
    assert(verifyPage(html2));

  });

})