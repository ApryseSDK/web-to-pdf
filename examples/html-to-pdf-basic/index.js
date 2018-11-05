const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

(async () => {
  const renderer = new WebToPDF({ dirname: __dirname, debug: true });

  const html = `
  <div class='Page'>
    <div class='container'>
      <h1>Web to PDF</h1>
      <p>Basic HTML Example</p>
    </div>
  </div>
  `;
  
  const scss = `
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;

      @media screen and (min-width: 300px) {
        background-color: red;
      }
  
      @media screen and (min-width: 400px) {
        background-color: green;
      }
  
      @media screen and (min-width: 500px) {
        background-color: blue;
      }
  
      @media screen and (min-width: 600px) {
        background-color: yellow;
      }
  
      @media screen and (min-width: 700px) {
        background-color: pink;
      }
  
      @media screen and (min-width: 800px) {
        background-color: black;
      }
  
      @media screen and (min-width: 900px) {
        background-color: grey;
      }
    }


  `;
  
  await renderer.render({
    templateSource: html,
    styles: [scss],
    outputName: 'htmlBasic'
  });
})()



