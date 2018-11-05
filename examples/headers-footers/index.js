const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

(async () => {
const renderer = new WebToPDF({ dirname: __dirname });

  await renderer.render({
    templateSource: "./src/index.html",
    chunks: {
      header: "./src/header.html",
      footer: "./src/footer.html"
    },
    outputName: "headers-footers"
  })

})()
