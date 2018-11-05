const fs = require('fs');

module.exports = (path, mask) => {
  return new Promise(resolve => {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 484;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
          if (err.code == 'EEXIST') return resolve(); // ignore the error if the folder already exists
          throw err;
        } else resolve(); // successfully created folder
    });
  })
  
}