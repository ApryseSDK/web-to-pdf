const NodeSass = require('node-sass');
const doesFileExist = require('./does-file-exist');
const Path = require('path');

module.exports = async (styles, dirname, debug) => {
  let linkedStyles = [];
  const p = styles.map((src) => {
    if (src.endsWith('css') || src.endsWith('scss')) {
      src = Path.resolve(dirname, src);
      return new Promise(async r => {
        const exists = doesFileExist(src);
        if (!exists) {
          if (debug) console.log(chalk.red(`File ${src} was not found, skipping`));
          return r('');
        }

        let data = '';
        if (src.endsWith('.css')) {
          data = await readFile(src);
        } else if (src.endsWith('.scss')) {
          const nodeResults = NodeSass.renderSync({ file: src })
          data = nodeResults.css;
          linkedStyles = nodeResults.stats.includedFiles;
        }
        r(data);
      })
    } else {
      const nodeResults = NodeSass.renderSync({ data: src })
      return Promise.resolve(nodeResults.css);
    }
    
  });

  const result = await Promise.all(p);
  return {
    css: result.reduce((acc, s) => { return acc + `\n${s}` }, '') || null,
    linkedStyles
  }
}