require('@babel/polyfill');
const assert = require('assert');
const Renderer = require('../src');

describe('verification', () => {
  it('can render a remote source', async () => {
    const renderer = new Renderer({ dirname: __dirname });

    const sm = await renderer.render({
      templateSource: 'http://pdftron.com'
    });

    assert(sm.sourceMap.html.indexOf('___gatsby') > -1);
    return;

  }).timeout(14000);


  it('can inject a stylesheet', async () => {
    const renderer = new Renderer({ dirname: __dirname });

    const sm = await renderer.render({
      templateSource: 'http://pdftron.com',
      styles: [
        './assets/style.scss'
      ]
    });

    assert(sm.sourceMap.html.indexOf('.MY-STYLE') > -1);
    return;

  }).timeout(14000);

  it('can inject a script', async () => {
    const renderer = new Renderer({ dirname: __dirname });

    const sm = await renderer.render({
      templateSource: 'http://pdftron.com',
      scripts: [
        './assets/script.js'
      ]
    });

    assert(sm.sourceMap.html.indexOf("console.log('waddup');") > -1);
    return;

  }).timeout(14000);

})