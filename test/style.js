require('@babel/polyfill');
const assert = require('assert');
const getSrc = require('../src/util/get-css-src');
const injectStyles = require('../src/util/inject-styles');
const path = require('path');

describe('get styles', () => {
  it('gets sources from link tags', () => {
    const html = `
      <html>
        <head>
          <link href='styles.css'>
          <link href='assets/styles.css'>
        </head>

        <body>
        </body>
      </html>
    `

    const src = getSrc(html, null, __dirname);
    assert(src.indexOf(path.resolve(__dirname, 'styles.css')) > -1);
    assert(src.indexOf(path.resolve(__dirname, 'assets/styles.css')) > -1);
    assert(src.length === 2);
  });

  it('returns empty array if no sources found', () => {
    const html = `
      <html>
        <head>
        </head>

        <body>
        </body>
      </html>
    `

    const src = getSrc(html);
    assert(src.length === 0);
  })

  it('only picks up css and scss', () => {
    const html = `
    <html>
      <head>
        <link href='styles.css'>
        <link href='assets/styles.css'>
        <link href='assets/styles.scss'>
      </head>

      <body>
        <img src='image.png' />
      </body>
    </html>
    `

    const src = getSrc(html);
    assert(src.length === 3);
  })
})

describe('inject styles', () => {

  it('injects default stylesheet into html', () => {
    const html = `
      <html>
        <head></head>
        <body></body>
      </html>
    `;

    const results = injectStyles(html, false);

    assert(results.indexOf('index.css') > -1);
  })

  it('injects custom stylesheet into html if it exists', () => {
    const html = `
      <html>
        <head></head>
        <body></body>
      </html>
    `;

    const results = injectStyles(html, true);

    assert(results.indexOf('index.css') > -1);
    assert(results.indexOf('custom.css') > -1);
  });
})