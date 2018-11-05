const fs = require('fs');

module.exports = (path) => {
  return fs.existsSync(path);
}