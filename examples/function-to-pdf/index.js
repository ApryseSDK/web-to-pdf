const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

const fetch = require('node-fetch');

(async () => {
  const renderer = new WebToPDF({ dirname: __dirname });

  const getHTML = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    let json = await response.json();

    json = json.slice(0, 10);

    const content = json.reduce((acc, data) => {
      return acc + `
        <div class='item'>
          <p>${data.title} ${data.completed ? "<span class='green'>✓</span>" : "<span class='red'>✖</span>"}</p>
        </div>
      `
    }, '')

    const html = `
      <div class='Page'>
        <div class='list'>
          ${content}
        </div>
      </div>
    `;

    return html;

  };

  await renderer.render({
    templateSource: getHTML,
    outputName: 'function-to-pdf',
    styles: [
      `
      .list {
        margin: 20px;
      }

      .item {
        p {
          font-size: 24px;

          .green {
            color: green;
          }

          .red {
            color: red;
          }
        }

      }
      `
    ]
  })
})()
