const fs = require('fs');

module.exports = (path) => {
  return new Promise((resolve) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return resolve(null);
      }
      resolve('' + data);
    })
  })
}