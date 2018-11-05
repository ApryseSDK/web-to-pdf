const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

(async () => {
  const renderer = new WebToPDF({
    dirname: __dirname,
    height: 'auto',
    width: 1200,
  });

  await renderer.render({
    templateSource: "https://www.pdftron.com",
    styles: [
      `
        .Header, .Footer, .main-cta  {
          display: none !important;
        }

      `
    ],
    outputName: "remote-source"
  })

})()
