require('@babel/polyfill');
const assert = require('assert');
const listenToChanges = require('../src/util/listen-to-changes');
const writeFile = require('../src/util/write-file');
const path = require('path');
const Renderer = require('../src');

describe('real time listener', () => {
  it('can listen to files and return changed files', (done) => {

    const w = listenToChanges([path.resolve(__dirname, 'assets/temp.txt')], (changes) => {
      assert(changes.length === 1);
      assert(changes[0] === path.resolve(__dirname, 'assets/temp.txt'));
      w.close();
      done();
    })

    writeFile(path.resolve(__dirname, 'assets/temp.txt'), `My data ${Math.random()}`);
  }).timeout(60000);

  it('ignored empty entries', (done) => {

    const w = listenToChanges([path.resolve(__dirname, 'assets/temp.txt'), '', '', ''], (changes) => {
      assert(changes.length === 1);
      assert(changes[0] === path.resolve(__dirname, 'assets/temp.txt'));
      w.close();
      done();
    })

    writeFile(path.resolve(__dirname, 'assets/temp.txt'), `My data ${Math.random()}`);
  });

  it('can ignore files', (done) => {

    let called = false;

    const w = listenToChanges([path.resolve(__dirname, 'assets/temp.txt'), '', '', ''], (changes) => {
      called = true;
    }, false, "**/*.txt")

    writeFile(path.resolve(__dirname, 'assets/temp.txt'), `My data ${Math.random()}`);

    setTimeout(() => {
      assert(!called);
      done();
    }, 4000)
  }).timeout(6000);

  it('goes into real time mode when on change handler is set', (done) => {
    const r = new Renderer({ dirname: __dirname });
    const ren = () => {
      assert(!!r._changeFunc);

      r.stop();
      done();
    }
    r.on('change', ren);
    ren();
  }).timeout(7000);

  it('can accept an options file instead of options object', async () => {
    const r = new Renderer({ dirname: __dirname });
    const ren = async () => {
      assert(!!r._changeFunc);
      const sm = await r.render('assets/options.js');
      r.stop();
      return sm;
    }
    r.on('change', ren);
    const sm = await ren();

    assert(sm);

    r.stop();
    return;

  }).timeout(7000);
})