const chokidar = require('chokidar');
const chalk = require('chalk');
const anymatch = require('anymatch');
const fs = require('fs-extra');
const path = require('path');
module.exports = (sources, callback, debug, ignoreWatch, dirname) => {
  let throttle = null;

  sources = sources.reduce((acc, src) => {
    if (typeof src !== 'string') {
      return acc;
    }

    if (ignoreWatch && anymatch(ignoreWatch, src)) {
      return acc;
    }

    if (!src || src === '') {
      return acc;
    }

    if (!fs.existsSync(src)) {

      // try to resolve it
      src = path.resolve(dirname, src);

      if (!fs.existsSync(src)) {
        return acc;
      }
      
    }

    acc.push(src);

    return acc;
  }, []);

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