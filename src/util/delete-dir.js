const rimraf = require('rimraf');

module.exports = (dir) => {
  return new Promise((r) => {
    rimraf(dir, r);
  })
}