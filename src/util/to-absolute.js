const Path = require('path');

module.exports = (arr, dirname) => {
  return arr.map(src => Path.resolve(dirname, src));
}