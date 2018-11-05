const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

(async () => {
  const renderer = new WebToPDF({ dirname: __dirname, debug: true });

  await renderer.render({
    templateSource: './src/index.html',
    outputName: 'javascript'
  })
})()
