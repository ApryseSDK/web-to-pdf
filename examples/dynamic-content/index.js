const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

(async () => {
  const renderer = new WebToPDF({ dirname: __dirname });

  // You could load this JSON object from your own service
  // This is useful for generating reports, invoices, etc
  const myContent = {
    pageTitle: "Using dynamic content in your PDFs",
    subtitle: "This example shows how you can use JSON data to render dynamic content in your PDF",
    content: {
      body: "You can even use nested data!"
    }
  }

  await renderer.render({
    templateSource: './src/index.html',
    contentSource: myContent,
    outputName: "dynamic-content"
  })

})()
