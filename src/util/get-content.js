const getType = require('./type-check');
const readFile = require('./read-file');
const Path = require('path');
const chalk = require('chalk');

module.exports = async ({ contentSource, debug, dirname }) => {
  let obj = {};
      // If content source is set, parse it an apply it
    if (contentSource) {
      const contentSourceType = getType(contentSource);

      if (contentSourceType === 'string') {
        contentSource = contentSource.trim();
        if (contentSource.endsWith('.json')) {
          const j = await readFile(Path.resolve(dirname, contentSource));
          try {
            obj = JSON.parse(j);
          } catch (e) {
            obj = null;
            if (debug) {
              console.log(chalk.red(`${Path.resolve(dirname, contentSource)} contains invalid JSON, Skipping`));
            }
          }
          
          if (debug) {
            console.log(chalk.keyword('orange')(`Got content from ${chalk.bold(Path.resolve(dirname, contentSource))}`))
          }

        } else {

          if (debug) {
            console.log(chalk.keyword('orange')(`Got content from object passed in from contentSource`))
          }
          obj = JSON.parse(contentSource);
        }
      } else if(contentSourceType === 'object' || contentSourceType === 'array'){
        obj = contentSource;
      }

      if(debug && !obj) {
        console.log(chalk.red('contentSource could not be parsed, skipping'));
      }
    }
  
  
  return obj;
}