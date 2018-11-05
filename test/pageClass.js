require('@babel/polyfill');
const assert = require('assert');
const React = require('react');
const Renderer = require('../src');

describe('HTML Parser', () => {
  

  it('can use custom className as page divider', async () => {

    const r = new Renderer({ dirname: __dirname })

    const html = `
      <html>
        <body>
          <div class='Split'>
            Test 1
          </div>

          <div class='Split'>
            Test 2
          </div>
        </body>
      </html>
    `

    const sm = await r.render({
      templateSource: html,
      pageClass: 'Split'
    });

    assert.equal(sm.metadata.numberOfPages, 2);

    return;
  }).timeout(7000);

  it('replaces css page with custom class', async () => {
    const r = new Renderer({ dirname: __dirname })

    const html = `
      <html>
        <body>
          <div class='Split'>
            Test 1
          </div>

          <div class='Split'>
            Test 2
          </div>
        </body>
      </html>
    `

    const sm = await r.render({
      templateSource: html,
      pageClass: 'Split'
    });


    assert(sm.sourceMap.css[0].from.indexOf('.Split') > -1);
    assert(sm.sourceMap.css[0].from.indexOf('.Page') === -1);
  }).timeout(7000)



})