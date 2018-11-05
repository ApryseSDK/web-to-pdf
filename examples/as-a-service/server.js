const Renderer = require('../../src');
const express = require('express');
const app = express();
const Path = require('path');
const port = 8080;

const r = new Renderer({ dirname: __dirname, keepAlive: true, height: 'auto' });

// use express to serve static assets at /outputs
app.use('/outputs', express.static(Path.resolve(__dirname, './outputs')));

// serve the client app
app.get('/', (req, res) => {
  res.sendFile(Path.join(__dirname + '/client.html'));
})

// convert api
app.get('/convert', async (req, res) => {
  const path = req.query.url;
  const u = new URL(path);

  await r.render({
    templateSource: path,
    outputFolder: Path.resolve(__dirname, './outputs'), // render stuff (relative to this file)
    outputName: u.hostname
  });

  // returns the remote location of the file
  res.send(`http://localhost:${port}/outputs/${u.hostname}.pdf`);
});

app.listen(port, () => { console.log(`Listening on port ${port}. Navigate to http://localhost:8080 to test the app!`) });
