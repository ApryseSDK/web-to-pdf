const fs = require('fs');
const EnsureExists = require('./ensure-exists');
const path = require('path');

module.exports = (filePath, data) => {
  return new Promise(async (resolve) => {

    const dir = path.dirname(filePath);

    await EnsureExists(dir);
    fs.writeFile(filePath, data, resolve);
  })
}