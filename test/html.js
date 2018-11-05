require('@babel/polyfill');
const assert = require('assert');
const getHTML = require('../src/util/get-html-from-source');
const React = require('react');

describe('HTML Parser', () => {
  
  const htmlGetter = getHTML({
    dirname: __dirname,
    obj: {}
  })

  it('can get html from a file', async () => {
    const { html, listenableSource } = await htmlGetter('assets/index.html');
    
    assert(html.indexOf('Page'));
    assert(listenableSource);
    return;
  });

  it ('can get html from a string', async () => {
    const { html, listenableSource } = await htmlGetter(`<html><div class='Page'></div></html>`);
    assert(html.indexOf('Page'));
    assert(!listenableSource);
    return;
  })

  it('can get html from a function', async () => {
    const fun = () => {
      return `<html><div class='Page'></div></html>`;
    }
    const { html, listenableSource } = await htmlGetter(fun);
    assert(html.indexOf('Page'));
    assert(!listenableSource);
    return;
  })

  it('can get html from a promise', async () => {
    const fun = () => {
      return new Promise(r => {
        setTimeout(() => {
          r(`<html><div class='Page'></div></html>`)
        }, 1000)
      });
    }
    const { html, listenableSource } = await htmlGetter(fun);
    assert(html.indexOf('Page'));
    assert(!listenableSource);
    return;
  })

  it('can get html from a react component', async () => {
    class Comp extends React.Component {
      render() {
        return (
          <div className='Page'></div>
        )
      }
    }

    const { html, listenableSource } = await htmlGetter(Comp);
    assert(html.indexOf('Page'));
    assert(!listenableSource);
    return;
  });

  it('can get html from a react function', async () => {
   
    const Comp = ({ }) => {
      return  <div className='Page'></div>
    }

    const { html, listenableSource } = await htmlGetter(Comp);
    assert(html.indexOf('Page'));
    assert(!listenableSource);
    return;
  })

})