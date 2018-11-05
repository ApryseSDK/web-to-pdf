const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

(async () => {
  const renderer = new WebToPDF({ dirname: __dirname });

  const renderFunc = () => {
    renderer.render('options.js');
  }

  renderer.on('change', renderFunc);
  renderFunc();

})()
