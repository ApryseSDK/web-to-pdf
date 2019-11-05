require('@babel/polyfill');
const assert = require('assert');
const GetContent = require('../src/util/get-content');
const Renderer = require('../src');

describe('get content', () => {
  it('can read a json file', async () => {
    const obj = await GetContent({
      contentSource: 'assets/content.json',
      dirname: __dirname
    });
    assert(obj.test, 'test');
    return;
  });

  it('can read a js object', async () => {
    const obj = await GetContent({
      contentSource: {
        test: 'test'
      },
      dirname: __dirname
    });

    assert(obj.test, 'test');
    return;
  });

  it('can write nested content', async () => {

    const r = new Renderer({ dirname: __dirname });

    const html = `
      <html>
        <body>
          <div class='Page'>
            {{my.nested.content}}
          </div>
        </body> 
      </html>
    `;

    const contentSource = {
      my: {
        nested: {
          content: "Wow!"
        }
      }
    };

    const result = await r.render({
      templateSource: html,
      contentSource
    });

    assert(result.sourceMap.html[0].from.indexOf('Wow!') > -1);

  }).timeout(7000)
})