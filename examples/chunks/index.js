const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

const React = require('react');

class ReactChunk extends React.Component {
  render() {
    return (
      <div className='react-chunk'>
        Cool! Rendered via React.
      </div>
    )
  }
}

(async () => {
  const renderer = new WebToPDF({ dirname: __dirname });

  await renderer.render({
    templateSource: './src/index.html',
    chunks: {
      fileChunk: './src/myChunk.html',
      reactChunk: ReactChunk,
      htmlChunk: `
        <div class='htmlChunk'>
          <p>I will be dynamically inserted!</p>
        </div>
      `
    },
    outputName: "chunks"
  })

})()
