const React = require('react');
const ReactDOMServer = require('react-dom/server');

{/* <link rel='stylesheet' href='/index.css' />
<link rel='stylesheet' href='/${outputName}.css' /> */}

module.exports = ({ Component, content }) => {
  const inner = ReactDOMServer.renderToString(<Component content={content} />);

  return `
    <html>
      <head>

      </head>

      <body>
        ${inner}
      </body>
    </html>`
}