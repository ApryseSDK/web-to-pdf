const getType = require('./type-check');
const Path = require('path');
const customRequire = require('./custom-require');

const getComp = (dirname) => {
  p = Path.resolve(dirname, p);
  delete require.cache[require.resolve(p)]
  const c = require(p);
  return c;
}

module.exports = async (options, dirname) => {
  let optionsPath = '';
  const optionsType = getType(options)
  if (optionsType === 'string') {
    optionsPath = Path.resolve(dirname, options);
    delete customRequire().cache[customRequire().resolve(optionsPath)];
    options = customRequire()(optionsPath);
    
    if (getType(options) !== 'function') {
      await this.stop(new Error(chalk.bgRed.whiteBright(`Please export a function from ${optionsPath}. Got type: '${optionsType}'`)));
    }

    options = await options(getComp);
  }

  return { options, optionsPath };
}