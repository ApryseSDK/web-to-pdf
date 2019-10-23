require('@babel/polyfill');
const getAssetSources = require('../src/util/get-asset-source');
const assert = require('assert');
const path = require('path');

describe('assets', () => {
  it('can get a list of assets from HTML', async () => {
    
    const html = `
      <div>
        <img src='img.png' />
        <img src='asset.jpg' />
      </div>
    `

    const r = getAssetSources(html, null, __dirname);

    assert(r.length === 2);
    assert(r.indexOf(path.resolve(__dirname, 'img.png')) > -1);
    assert(r.indexOf(path.resolve(__dirname, 'asset.jpg')) > -1);

    return;
  });

  it('can get a list of assets from css', async () => {

    const html = `
      <div>
      </div>
    `

    const css = `
      .bg {
        background-image: url('img.png');
      }
    `

    const r = getAssetSources(html, css, __dirname);

    assert(r.length === 1);
    assert(r.indexOf(path.resolve(__dirname, 'img.png')) > -1);

    return;


  })

})