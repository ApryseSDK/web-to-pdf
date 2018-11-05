const Path = require('path');
const doesFileExist = require('./does-file-exist');
const readFile = require('./read-file');


module.exports = async (scripts, dirname, debug) => {
  const p = scripts.map((src) => {
    src = Path.resolve(dirname, src);
    return new Promise(async r => {
      const exists = doesFileExist(src);
      if (!exists) {
        if (debug) console.log(chalk.red(`File ${src} was not found, skipping`));
        return r('');
      }

      let data = '';
      data = await readFile(src);
      r(data);
    })
  });

  const result = await Promise.all(p);
  return result.reduce((acc, s) => { return acc + `\n${s}` }, '') || null;
}