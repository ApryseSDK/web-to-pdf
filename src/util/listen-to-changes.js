const chokidar = require('chokidar');
const chalk = require('chalk');
const anymatch = require('anymatch');
const fs = require('fs-extra');

module.exports = (sources, callback, debug, ignoreWatch) => {
  let throttle = null;

  sources = sources.filter((src, index) => {
    if (ignoreWatch) {
      if (anymatch(ignoreWatch, src)) {
        return false;
      }
    }
    if (!src || src === '') {
      return false;
    }

    if (!fs.existsSync(src)) {
      return false;
    }

    if (sources.indexOf(src) === index) {
      return true;
    }
    return false;
  });

  if (debug) {
    console.log(chalk.bgMagenta.whiteBright('Listening to these files:'))
    sources.forEach(src => console.log(chalk.magenta(src)));
    console.log("\n");
  }

  return chokidar.watch(sources).on('change', (...params) => {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      if (debug) {
        params.forEach(p => {
          if (typeof p === 'string') {
            console.log(chalk.magenta(`Detected change at ${chalk.bold(p)}`))
          }
        })
      }
      if (callback) {
        callback(params);
      }
    }, 1000)
  });
}