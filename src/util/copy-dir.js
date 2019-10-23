const fs = require('fs-extra')
const path = require('path');

module.exports = (from, to) => {
  return new Promise(async (resolve) => {

    var cbCalled = false;

    fs.ensureDirSync(
      path.dirname(to)
    )

    var rd = fs.createReadStream(from);
    rd.on("error", function(err) {
      done(err);
    });
    var wr = fs.createWriteStream(to);
    wr.on("error", function(err) {
      done(err);
    });
    wr.on("close", function(ex) {
      done();
    });
    rd.pipe(wr);
  
    function done(err) {
      if (!cbCalled) {
        return resolve();
        cbCalled = true;
      }
    }

  })
}