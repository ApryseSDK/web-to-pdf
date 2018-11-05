require('@babel/polyfill');
const assert = require('assert');
const getSciptSrc = require('../src/util/get-script-src');

describe('scripts', () => {
  it('can extract script tags', async () => {

    const html = `
      <html>
        <script src='test.js'>
        <script src='assets/test.js'>
      </html>
    `;

    const srcs = getSciptSrc(html);

    assert.equal(srcs.length, 2);
  });

  it('ignores remote sources', async () => {

    const html = `
      <html>
        <script src='test.js'>
        <script src='assets/test.js'>
        <script src='https://pdftron.com/script.js'>
      </html>
    `;

    const srcs = getSciptSrc(html);

    assert(srcs.length === 2);
  });

  it('ignores sources that arent scripts', () => {
    const html = `
      <html>
        <script src='test.js'>
        <img src='assets/test.png'>
      </html>
    `;

    const srcs = getSciptSrc(html);

    assert(srcs.length === 1);
  })


})