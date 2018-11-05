const liveServer = require('live-server');

module.exports = (port, host, outputFolder, debug) => {
  return new Promise(async r => {
    const params = {
      port,
      host,
      root: `${outputFolder}`,
      open: false,
      quiet: true,
      logLevel: 0,
      ignore: '**/*.html,**/*.js,**/*.css,**/*.scss',
      wait: 500
    };

    const s = liveServer.start(params);
    await new Promise(resolve => setTimeout(resolve, 1000));
    r(s);
  })

}

module.exports.close = (instance) => {
  liveServer.shutdown(instance);
}