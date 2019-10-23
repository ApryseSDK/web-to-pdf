const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

(async () => {
  const renderer = new WebToPDF({ dirname: __dirname, debug: true });

  const html = `
  <div class='Page'>
    <div class='container'>
      <h1>Web to PDF</h1>
      <p>Basic assets example</p>
      <img src='./img/pdftron.png'></img>

      <div class='bg'>
        This should have a background image
      </div>
    </div>
  </div>
  `;

  const style = `
    .bg {
      background-image: url('./img/pdftron2.png');
    }
  `

  renderer.render({
    templateSource: html,
    styles: [style],
    outputName: 'assetsBasic'
  })

})()
