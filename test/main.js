require('@babel/polyfill');
const assert = require('assert');
const Renderer = require('../src');
const Path = require('path');
const React = require('react');
async function assertThrowsAsync(fn, regExp) {
  let f = () => {};
  try {
    await fn();
  } catch(e) {
    f = () => {throw e};
  } finally {
    assert.throws(f, regExp);
  }
}

describe('WebToPDF', () => {

  it('throws if dirname is not provided', () => {
    assert.throws(() => {
      const ren = new Renderer({  });
    }, Error)
  })


  it('throws if no templateSource is provided', async () => {
    const ren = new Renderer({ dirname: __dirname });

    assertThrowsAsync(async () => {
      await ren.render({
        
      });
    }, /Error/)
  }).timeout(7000);

  it('throws if templateSource cannot be parsed', async () => {
    const ren = new Renderer({ dirname: __dirname });

    assertThrowsAsync(async () => {
      await ren.render({
        templateSource: 'dsgkhsdlfgj'
      });
    }, /Error/)
  }).timeout(7000);


  it('should return a sourcemap of assets written', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const html = `
      <html>
        <body>
          <div class='Page'>
          </div>
        </body>
      </html>
    `

    const sm = await ren.render({
      templateSource: html,
    });
    
    assert.equal(sm.sourceMap.html[0].to, 'outputs/index/index.html');
    assert(!!sm.sourceMap.html[0].from);
    assert(!!sm.sourceMap.html[0].method);

    assert.equal(sm.sourceMap.css[0].to, 'outputs/index/index.css');
    return;
  }).timeout(7000);

  it('automatically appends header and footer chunks to every page', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const source = `
      <html>
        <body>
          <div class='Page'>
            Content
          </div>

          <div class='Page'>
            Content
          </div>
        </body>
      </html>
    `;

    const header = `<div class='header'>My header</div>`
    const footer = `<div class='footer'>My footer</div>`

    const sm = await ren.render({
      templateSource: source,
      chunks: { header, footer }
    });

    const html = sm.sourceMap.html[0].from;

    assert.equal((html.match(/My header/g) || []).length, 2);
    assert.equal((html.match(/My footer/g) || []).length, 2);
    assert.equal((html.match(/Content/g) || []).length, 2);

  }).timeout(7000);


  it('should replace content in HTML', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const sm = await ren.render({
      templateSource: 'assets/index.html',
      contentSource: 'assets/content.json'
    });

    const html = sm.sourceMap.html[0].from;
    

    assert(html.indexOf('pdf') > -1);
    assert(html.indexOf('is cool') > -1);

    return;
  }).timeout(7000);


  it('should replace chunks in HTML', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const customFooter = `
      <div class='footer'>
        MY FOOTER!
      </div>
    `

    const sm = await ren.render({
      templateSource: 'assets/index.html',
      contentSource: 'assets/content.json',
      chunks: {
        customFooter
      }
    });

    const html = sm.sourceMap.html[0].from;
    
    assert(html.indexOf('MY FOOTER!') > -1);

    return;
  }).timeout(7000);

  it('should replace page numbers in HTML', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const htmlS = `
      <div class='Page'>
        ONE {{pageNumber}}
      </div>
      <div class='Page'>
        TWO {{pageNumber}}
      </div>
      <div class='Page'>
        THREE {{pageNumber}}

        {{otherContent}}
      </div>
    `
    const otherContent = `
      <div class='footer'>
        footer {{pageNumber}}
      </div>
    `

    const sm = await ren.render({
      templateSource: htmlS,
      contentSource: 'assets/content.json',
      chunks: {
        otherContent
      }
    });

    const html = sm.sourceMap.html[0].from;
    
    assert(html.indexOf('ONE 1') > -1);
    assert(html.indexOf('TWO 2') > -1);
    assert(html.indexOf('THREE 3') > -1);
    assert(html.indexOf('footer 3') > -1);

    return;
  }).timeout(7000);

  it('can set page width and height', async () => {
    const ren = new Renderer({ dirname: __dirname, width: 500, height: 700 });

    const sm = await ren.render({
      templateSource: 'assets/index.html',
      
    });

    const css = sm.sourceMap.css[0].from;
    
    assert(css.indexOf('width: __WIDTH') === -1);
    assert(css.indexOf('height: __HEIGHT') === -1);

    return;
  }).timeout(7000);

  it('passes content to a function', async () => {

    const ren = new Renderer({ dirname: __dirname });
    let called = false;
    const func = (content) => { 
      
      assert(content.test === 'hello');
      called = true;
      return `
        <html>
          <div class='Page'></div>
        </html>
      `
    }

    await ren.render({
      templateSource: func,
      contentSource: {
        "test": "hello"
      }
    });

    assert(called);

    return;
  }).timeout(7000);

  it('passes content to a react component', async () => {

    const ren = new Renderer({ dirname: __dirname });
    
    let called = false;
    class Comp extends React.Component {
      render() {
        const { content } = this.props;
        assert(content.test === 'hello');
        called = true;
        return <div className='Page'></div>
      }
    }

    await ren.render({
      templateSource: Comp,
      contentSource: {
        "test": "hello"
      }
    });

    assert(called);

    return;
  }).timeout(7000);

  it('copies scripts to server folder', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const html = `
      <html>
        <head>
          <script src='assets/script.js'></script>
        </head>
        <body>
          <div class='Page'></div>
        </body>
      </html>
    `;

    const sm = await ren.render({
      templateSource: html,
    });

    const write = sm.sourceMap.script[0];

    assert.equal(write.from, Path.resolve(__dirname, 'assets/script.js'));
    assert.equal(write.to, 'outputs/index/assets/script.js');

    return;
  }).timeout(7000);

  it('calls on html event', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const html = `
      <html>
        <head>
          <script src='assets/script.js'></script>
        </head>
        <body>
          <div class='Page'></div>
        </body>
      </html>
    `;

    let called = false;

    ren.on('html', (h) => {
      called = h;
    })

    const sm = await ren.render({
      templateSource: html,
    });

    assert(called);
    assert(called.indexOf('<html>') > -1);

    return;
  }).timeout(7000);

  it('can accept html transforming middleware', async () => { 
    const ren = new Renderer({ dirname: __dirname });

    const html = `
      <html>
        <head>
          <script src='assets/script.js'></script>
        </head>
        <body>
          <div class='Page'></div>
        </body>
      </html>
    `;


    const sm = await ren.render({
      templateSource: html,
      middleware: [
        (h) => {
          h = html.replace('assets/script.js', "TEST!");
          return h;
        }
      ]
    });

    const returnedHTML = sm.sourceMap.html[0].from;

    assert(returnedHTML.indexOf('TEST!') > -1);

    return;
  }).timeout(7000);


  it('can accept async middleware', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const html = `
      <html>
        <head>
          <script src='assets/script.js'></script>
        </head>
        <body>
          <div class='Page'></div>
        </body>
      </html>
    `;


    const sm = await ren.render({
      templateSource: html,
      middleware: [
        async (h) => {
          await new Promise(r => setTimeout(r, 500));
          h = h.replace('assets/script.js', "TEST!");
          return h;
        },
        async (h) => {
          await new Promise(r => setTimeout(r, 700));
          h = h.replace('TEST!', "TEST2!");
          return h;
        }
      ]
    });

    const returnedHTML = sm.sourceMap.html[0].from;

    assert(returnedHTML.indexOf('TEST!') === -1);
    assert(returnedHTML.indexOf('TEST2!') > -1);

    return;
  }).timeout(1233333)


  it.only('gets image sources in chunks', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const html = `
      <div class='Page'>
        {{htmlChunk}}
      </div>
    `;

    const sm = await ren.render({
      templateSource: html,
      chunks: {
        htmlChunk: `
          <div class='htmlChunk'>
            <p>I will be dynamically inserted!</p>
            <img src='./test.png'></img>
          </div>
        `
      },
    })

    const assets = sm.sourceMap.assets;
    assert.ok(assets);
    assert.ok(assets.length === 1);
    assert.ok(assets[0].from.indexOf('test.png') > -1)
   
    // const returnedHTML = sm.sourceMap.html[0].from;
  }).timeout(6000)

  it('can accept inline styles as a styles param', async () => {
    const ren = new Renderer({ dirname: __dirname });

    const html = `
      <div class='Page'></div>
    `;

    const css = `
      #testCSS {
        color: red;
      }
    `

    const scss = `
      #testSCSS {
        p.testP {
          color: white;
        }
      }  
    `;

    const sm = await ren.render({
      templateSource: html,
      styles: [ css, scss ]
    })

    const returnedCSS = sm.sourceMap.css[0].from;

    assert(returnedCSS.indexOf('#testCSS') > -1);
    assert(returnedCSS.indexOf('#testSCSS') > -1);
    assert(returnedCSS.indexOf('.testP') > -1);
    return;

  }).timeout(7000);
})